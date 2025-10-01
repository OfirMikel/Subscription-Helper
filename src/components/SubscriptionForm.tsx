import { useEffect, useMemo, useState } from 'react';
import type { BillingCycle, Subscription } from '../types';

export interface SubscriptionFormProps {
  initial?: Partial<Subscription>;
  onSubmit: (subscription: Omit<Subscription, 'createdAt' | 'updatedAt' | 'id'> & { id?: string }) => void;
  onCancel?: () => void;
}

const cycles: BillingCycle[] = ['monthly', 'yearly'];

export default function SubscriptionForm({ initial, onSubmit, onCancel }: SubscriptionFormProps) {
  function getUpcomingTenth(): string {
    const now = new Date();
    const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const monthIndex = (now.getMonth() + 1) % 12; // next month 0-11
    const month = String(monthIndex + 1).padStart(2, '0');
    const day = '10';
    return `${year}-${month}-${day}`;
  }

  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    (initial?.billingCycle as BillingCycle) ?? 'monthly'
  );
  const [nextPaymentDate, setNextPaymentDate] = useState(initial?.nextPaymentDate ?? getUpcomingTenth());
  const [category, setCategory] = useState(initial?.category ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
    setPrice(initial?.price != null ? String(initial.price) : '');
    setBillingCycle((initial?.billingCycle as BillingCycle) ?? 'monthly');
    setNextPaymentDate(initial?.nextPaymentDate ?? getUpcomingTenth());
    setCategory(initial?.category ?? '');
  }, [initial?.id]);

  const isValid = useMemo(() => {
    const n = Number(price);
    return name.trim().length > 0 && Number.isFinite(n) && n >= 0 && cycles.includes(billingCycle);
  }, [name, price, billingCycle]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const n = Number(price);
    onSubmit({
      id: initial?.id,
      name: name.trim(),
      price: Number(n.toFixed(2)),
      billingCycle,
      nextPaymentDate: nextPaymentDate || undefined,
      category: category || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label>Name</label>
        <input
          type="text"
          required
          placeholder="Netflix, Spotify"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="row">
        <div className="field">
          <label>Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="9.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Billing Cycle</label>
          <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as BillingCycle)} required>
            {cycles.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>Next Payment</label>
          <input
            type="date"
            value={nextPaymentDate}
            onChange={(e) => setNextPaymentDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Category</label>
          <input
            type="text"
            placeholder="Entertainment"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="actions">
        {onCancel && (
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn" disabled={!isValid}>
          {initial?.id ? 'Save' : 'Add'}
        </button>
      </div>
    </form>
  );
}



