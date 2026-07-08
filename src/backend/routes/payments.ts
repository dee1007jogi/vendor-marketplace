import express, { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import { stripe } from "../lib/stripe";
import { razorpay, verifyRazorpaySignature } from "../lib/razorpay";
import { creditService } from "../services/credit.service";
import Stripe from "stripe";

const router = Router();

// GET /api/payments/transactions/:userId
router.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // We fetch transactions where either vendorId or buyerId matches
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { vendorId: userId },
          { buyerId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ items: transactions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST /api/payments/checkout (Mock Payment Gateway for testing)
router.post("/checkout", async (req, res) => {
  try {
    const { userId, amount, credits, transactionType } = req.body;
    
    // Only vendors can purchase credits
    if (transactionType === "lead_purchase" && credits > 0) {
      await prisma.vendorProfile.update({
        where: { userId },
        data: { leadCredits: { increment: credits } }
      });
    }

    await prisma.transaction.create({
      data: {
        vendorId: transactionType === "lead_purchase" ? userId : undefined,
        buyerId: transactionType !== "lead_purchase" ? userId : undefined,
        amount: amount,
        transactionType: transactionType || "payment",
        status: "success",
        paymentGatewayId: `mock_tx_${Date.now()}`
      }
    });

    req.app.get("io")?.emit("dashboard_update", { source: "checkout" });
    res.json({ success: true });
  } catch (error) {
    console.error("Mock checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { userId, amount } = req.body; // amount in cents (e.g., 500 for $5.00)

  if (!userId || !amount || amount < 50) { // enforce minimum $0.50
    return res.status(400).json({ error: 'Valid userId and amount (>= 50 cents) required' });
  }

  try {
    // Calculate credits upfront so the user knows what they are buying
    const creditsToGrant = creditService.calculateCredits(amount);

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.DEFAULT_CURRENCY || 'usd',
            product_data: {
              name: `${creditsToGrant} Vendor Credits`,
              description: `Purchase ${creditsToGrant} credits for your account.`,
            },
            unit_amount: amount, // e.g., 500 for $5.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5173'}/payment-cancel`,
      metadata: {
        userId: userId,
        creditsToGrant: creditsToGrant.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('[Stripe Error]', error.message);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/payments/razorpay/create-order
router.post("/razorpay/create-order", async (req: Request, res: Response) => {
  const { userId, amount } = req.body; // amount in INR typically, or lowest denomination

  if (!userId || !amount) {
    return res.status(400).json({ error: 'Valid userId and amount required' });
  }

  try {
    const creditsToGrant = creditService.calculateCredits(amount);
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay takes amount in paise (lowest denomination)
      currency: "INR",
      notes: {
        userId,
        creditsToGrant: creditsToGrant.toString()
      }
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error: any) {
    console.error('[Razorpay Error]', error);
    res.status(500).json({ error: 'Failed to create razorpay order' });
  }
});

// POST /api/payments/razorpay/verify-payment
router.post("/razorpay/verify-payment", async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, creditsToGrant, amount } = req.body;

  try {
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Grant credits
    await prisma.vendorProfile.update({
      where: { userId },
      data: { leadCredits: { increment: Number(creditsToGrant) } }
    });

    await prisma.transaction.create({
      data: {
        vendorId: userId,
        amount: Number(amount) / 100, // convert paise back to actual
        transactionType: "lead_purchase",
        status: "success",
        paymentGatewayId: razorpay_payment_id
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('[Razorpay Verify Error]', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// POST /api/payments/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract user and credits from metadata
    const userId = session.metadata?.userId;
    const creditsToGrant = parseInt(session.metadata?.creditsToGrant || '0', 10);

    if (!userId || creditsToGrant <= 0) {
      console.error('[Webhook] Missing metadata userId or credits');
      return res.status(400).send('Missing metadata');
    }

    try {
      // Grant the credits to the user in your database
      await prisma.vendorProfile.update({
        where: { userId },
        data: { leadCredits: { increment: creditsToGrant } }
      });
      console.log(`[Webhook] Granted ${creditsToGrant} credits to user ${userId}`);

      // Optional: log the transaction in a 'transactions' table
      await prisma.transaction.create({
         data: {
             vendorId: userId,
             amount: session.amount_total || 0,
             transactionType: "lead_purchase",
             status: "success",
             paymentGatewayId: session.id
         }
      });

    } catch (error) {
      console.error('[Webhook] Failed to grant credits:', error);
      // If DB fails, return 500 so Stripe retries the webhook later.
      return res.status(500).send('Internal Server Error');
    }
  }

  // Acknowledge receipt
  res.json({ received: true });
});

// POST /api/payments/escrow/release
router.post("/escrow/release", async (req, res) => {
  try {
    const { milestoneId, buyerId } = req.body;
    
    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    if (!milestone) return res.status(404).json({ error: "Milestone not found" });
    if (!milestone.project.awardedVendorId) return res.status(400).json({ error: "Project not awarded" });

    await prisma.$transaction(async (tx) => {
      // 1. Update milestone status
      await tx.projectMilestone.update({
        where: { id: milestoneId },
        data: { status: "released", releasedAt: new Date() }
      });

      // 2. Log Escrow Release Transaction
      await tx.transaction.create({
        data: {
          buyerId,
          vendorId: milestone.project.awardedVendorId,
          projectId: milestone.projectId,
          transactionType: "escrow_release",
          amount: milestone.amount,
          status: "success",
          paymentGatewayId: `escrow_rel_${Date.now()}`
        }
      });
    });

    res.json({ success: true, message: "Funds released to vendor." });
  } catch (error) {
    res.status(500).json({ error: "Failed to release escrow funds" });
  }
});

export default router;
