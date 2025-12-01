import { formatCurrency, formatDate, formatCycleLabel } from "../utils/formatters.js";

export function SubscriptionCard({ subscription, status, onEdit, onRemind }) {
  return (
    <article className="subscription-card">
      <div className={`badge ${status.variant !== "neutral" ? status.variant : ""}`}>
        {status.label}
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
          <h3>{subscription.name}</h3>
          <p className="category">{subscription.category || "未分类"}</p>
        </div>
        <p className="notes">{subscription.notes || "暂无备注"}</p>
        <div className="tags">
          {(subscription.tags?.length ? subscription.tags : ["无标签"]).map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="meta">
        <p>
          下次扣费 <span>{formatDate(subscription.renewalDate)}</span>
        </p>
        <p>
          周期 <span>{formatCycleLabel(subscription)}</span>
        </p>
        <p>
          费用 <span>{formatCurrency(subscription.price || 0)}</span>
        </p>
      </div>

      <div className="actions">
        <button className="ghost" onClick={() => onRemind(subscription)}>
          发送提醒
        </button>
        <button className="ghost" onClick={() => onEdit(subscription)}>
          编辑
        </button>
      </div>
    </article>
  );
}
