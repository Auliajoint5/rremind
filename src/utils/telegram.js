import { formatCurrency, formatCycleLabel, formatDate } from "./formatters.js";
import { determineStatus } from "./subscriptions.js";

export async function sendTelegramMessage(subscription, settings, mode = "manual") {
  if (!settings.telegramEnabled) {
    throw new Error("未启用 Telegram 提醒");
  }
  if (!settings.telegramToken || !settings.telegramChatId) {
    throw new Error("请先在设置中填写 Bot Token 和 Chat ID");
  }

  const status = determineStatus(subscription, settings);
  const text = [
    `🔔 订阅提醒 (${mode === "auto" ? "自动" : "手动"})`,
    `服务：${subscription.name}`,
    `状态：${status.label}`,
    `下次扣费：${formatDate(subscription.renewalDate)}`,
    `周期：${formatCycleLabel(subscription)}`,
    `金额：${formatCurrency(subscription.price || 0)}`,
    subscription.notes ? `备注：${subscription.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.telegram.org/bot${settings.telegramToken}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: settings.telegramChatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.description || "Telegram API 调用失败");
  }

  return true;
}
