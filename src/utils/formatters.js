const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  minimumFractionDigits: 0,
});

export function formatCurrency(value = 0) {
  return currencyFormatter.format(Number(value) || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return "未知";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "未知";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatCycleLabel(subscription) {
  switch (subscription.cycle) {
    case "monthly":
      return "每月";
    case "quarterly":
      return "每季度";
    case "yearly":
      return "每年";
    case "custom":
      return `每 ${subscription.customCycleDays ?? "?"} 天`;
    default:
      return "未知";
  }
}
