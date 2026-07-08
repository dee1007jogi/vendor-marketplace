export class CreditService {
  private rate: number;
  private currency: string;

  constructor() {
    this.rate = parseFloat(process.env.CREDIT_RATE || '100');
    this.currency = process.env.DEFAULT_CURRENCY || 'usd';
  }

  /**
   * Converts the monetary amount (in smallest currency unit, e.g., cents) to credits.
   * @param amountInCents The amount paid, e.g., 1000 for $10.00
   * @returns The number of credits to grant.
   */
  calculateCredits(amountInCents: number): number {
    const amountInBaseUnit = amountInCents / 100;
    return Math.floor(amountInBaseUnit * this.rate);
  }
}

export const creditService = new CreditService();
