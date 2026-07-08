import Razorpay from 'razorpay';
import * as crypto from 'crypto';

// Ensure Razorpay keys are set in .env
const key_id = process.env.RAZORPAY_KEY_ID || 'dummy_key_id';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generatedSignature === signature;
};
