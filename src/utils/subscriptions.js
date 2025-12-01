import { differenceInCalendarDays } from "date-fns";
import { formatCurrency } from "./formatters.js";

export function determineStatus(subscription, settings, referenceDate = new Date()) {
  if (!subscription?.renewalDate) {
    return { label: "未知", variant: "neutral", diffDays: Infinity };
  }
  const renewalDate = new Date(subscription.renewalDate);
  const diffDays = differenceInCalendarDays(renewalDate, referenceDate);
  const reminderThreshold =
    subscription.remindBeforeDays ?? settings?.defaultReminderDays ?? 7;

  if (Number.isNaN(renewalDate.getTime())) {
    return { label: "未知", variant: "neutral", diffDays: Infinity };
  }

  if (diffDays < 0) {
    return { label: "已过期", variant: "danger", diffDays };
  }
  if (diffDays <= reminderThreshold) {
    return { label: `即将到期 · ${Math.max(diffDays, 0)}天`, variant: "warning", diffDays };
  }
  return { label: "正常", variant: "neutral", diffDays };
}

export function cycleToAnnualMultiplier(subscription) {
  switch (subscription.cycle) {
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "yearly":
      return 1;
    case "custom":
      return subscription.customCycleDays ? 365 / subscription.customCycleDays : 0;
    default:
      return 0;
  }
}

export function computeDashboardStats(subscriptions, settings) {
  const now = new Date();
  let expiringSoon = 0;
  let expired = 0;
  let annualCost = 0;

  subscriptions.forEach((sub) => {
    const status = determineStatus(sub, settings, now);
    if (status.variant === "warning") expiringSoon += 1;
    if (status.variant === "danger") expired += 1;
    annualCost += (sub.price || 0) * cycleToAnnualMultiplier(sub);
  });

  return {
    total: subscriptions.length,
    expiringSoon,
    expired,
    annualCostDisplay: formatCurrency(Math.round(annualCost)),
  };
}

export function filterSubscriptions(subscriptions, filters, settings) {
  const query = filters.query.trim().toLowerCase();
  const statusFilter = filters.status;
  const sort = filters.sort;
  const now = new Date();

  let result = [...subscriptions];

  if (query) {
    result = result.filter((sub) => {
      const tokens = [
        sub.name,
        sub.category,
        sub.notes,
        ...(Array.isArray(sub.tags) ? sub.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return tokens.includes(query);
    });
  }

  if (statusFilter !== "all") {
    result = result.filter((sub) => {
      const status = determineStatus(sub, settings, now);
      if (statusFilter === "active") return status.variant === "neutral";
      if (statusFilter === "expiring") return status.variant === "warning";
      if (statusFilter === "expired") return status.variant === "danger";
      return true;
    });
  }

  result.sort((a, b) => {
    if (sort === "name") {
      return (a.name || "").localeCompare(b.name || "", "zh-CN");
    }
    if (sort === "price") {
      return (b.price || 0) - (a.price || 0);
    }
    const dateA = new Date(a.renewalDate);
    const dateB = new Date(b.renewalDate);
    return dateA - dateB;
  });

  return result;
}
