import { prisma } from '../prisma';
import cron from 'node-cron';

// Run every hour
export function startOtpCleanupJob() {
  cron.schedule('0 * * * *', async () => {
    try {
      const deleted = await prisma.otpAttempt.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { verifiedAt: { not: null } }, // Already used, can delete after 1 hour too
          ],
        },
      });
      console.log(`[Cleanup] Removed ${deleted.count} expired/used OTPs.`);
    } catch (error) {
      console.error('[Cleanup] Error during OTP cleanup:', error);
    }
  });
}
