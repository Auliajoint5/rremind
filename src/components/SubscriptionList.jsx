import { SubscriptionCard } from "./SubscriptionCard.jsx";

export function SubscriptionList({ subscriptions, statuses, onEdit, onRemind }) {
  if (!subscriptions.length) {
    return (
      <div className="subscription-list">
        <div className="empty">
          <p>没有符合条件的订阅，试试调整过滤条件或添加新的条目。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-list">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          status={statuses[subscription.id]}
          onEdit={onEdit}
          onRemind={onRemind}
        />
      ))}
    </div>
  );
}
