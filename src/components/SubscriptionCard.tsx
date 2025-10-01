import type { Subscription } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

export interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'ILS' }).format(value);
}
/**
 * Converts a date string from "yyyy-mm-dd" to "dd/mm/yyyy".
 *
 * @param isoDate - The date in ISO format (e.g. "2025-10-01")
 * @returns The date in "dd/mm/yyyy" format (e.g. "01/10/2025")
 */
function formatDateToDDMMYYYY(isoDate: string): string {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}
export default function SubscriptionCard({ subscription, onEdit, onDelete }: SubscriptionCardProps) {
  const monthly = subscription.billingCycle === 'monthly' ? subscription.price : subscription.price / 12;
  const yearly = subscription.billingCycle === 'yearly' ? subscription.price : subscription.price * 12;

  return (
    <div className="card subscription">
      <div className="card-main">
        <div className="title-row">
          <div className="title">
            <strong>{subscription.name}</strong>
            {subscription.category && <span className="chip">{subscription.category}</span>}
              <div className="prices">
                  <div className="price">{formatCurrency(monthly)} / mo</div>
                  <div className="price muted">{formatCurrency(yearly)} / yr</div>
              </div>
              {subscription.nextPaymentDate && (
                  <div className="next">Next: {formatDateToDDMMYYYY(subscription.nextPaymentDate)}</div>
              )}
          </div>
          <div className="actions">
            <button className="icon" aria-label="Edit" onClick={() => onEdit(subscription)}>
              <Pencil />
            </button>
            <button className="icon danger" aria-label="Delete" onClick={() => onDelete(subscription.id)}>
              <Trash2 />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


