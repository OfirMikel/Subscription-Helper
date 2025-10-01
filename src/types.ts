export type BillingCycle = 'monthly' | 'yearly';

export type Subscription = {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  nextPaymentDate?: string; // ISO date string
  category?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type Totals = {
  totalMonthly: number;
  totalYearly: number;
}

export function computeTotals(subscriptions: Subscription[]): Totals {
  let totalMonthly = 0;
  let totalYearly = 0;
  for (const sub of subscriptions) {
    if (Number.isFinite(sub.price)) {
      if (sub.billingCycle === 'monthly') {
        totalMonthly += sub.price;
        totalYearly += sub.price * 12;
      } else {
        // yearly
        totalYearly += sub.price;
        totalMonthly += sub.price / 12;
      }
    }
  }
  return {
    totalMonthly: Number(totalMonthly.toFixed(2)),
    totalYearly: Number(totalYearly.toFixed(2)),
  };
}


