import { useEffect } from "react";
import { useSubscriptionStore } from "../store/useSubscriptionStore.js";
import { determineStatus } from "../utils/subscriptions.js";
import { sendTelegramMessage } from "../utils/telegram.js";
import { useToast } from "../hooks/useToast.jsx";

export function ReminderDaemon() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const settings = useSubscriptionStore((state) => state.settings);
  const markReminderSent = useSubscriptionStore((state) => state.markReminderSent);
  const toast = useToast();

  useEffect(() => {
    const run = () => {
      if (!settings.telegramEnabled) return;
      const todayKey = new Date().toISOString().slice(0, 10);
      subscriptions.forEach((sub) => {
        const status = determineStatus(sub, settings);
        if (status.variant !== "warning") return;
        if (sub.lastReminderSentOn === todayKey) return;
        sendTelegramMessage(sub, settings, "auto")
          .then(() => {
            markReminderSent(sub.id, todayKey);
          })
          .catch((error) => {
            toast(error.message, "danger");
          });
      });
    };

    run();
    const timer = setInterval(run, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [subscriptions, settings, markReminderSent, toast]);

  return null;
}
