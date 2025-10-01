import type { Subscription } from '../types';
import SubscriptionCard from './SubscriptionCard';

export interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return <div className="empty">No subscriptions yet. Add your first one below.</div>;
  }
  return (
    <div className="list">
      {subscriptions.map((s) => (
        <SubscriptionCard key={s.id} subscription={s} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}



