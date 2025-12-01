import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";

const STORAGE_KEY = "rremind_state_v2";

export const defaultSettings = {
  telegramEnabled: false,
  telegramToken: "",
  telegramChatId: "",
  defaultReminderDays: 7,
};

export const defaultState = {
  subscriptions: [],
  settings: { ...defaultSettings },
  restoredFromBackup: false,
};

function normalizeNewSubscription(payload) {
  return {
    id: payload.id ?? nanoid(12),
    name: payload.name ?? "未命名",
    category: payload.category ?? "",
    tags: Array.isArray(payload.tags)
      ? payload.tags.filter(Boolean)
      : String(payload.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    price: Number(payload.price) || 0,
    renewalDate: payload.renewalDate ?? "",
    cycle: payload.cycle ?? "yearly",
    customCycleDays: payload.customCycleDays ? Number(payload.customCycleDays) : null,
    remindBeforeDays:
      payload.remindBeforeDays !== undefined
        ? Math.max(0, Number(payload.remindBeforeDays) || 0)
        : defaultSettings.defaultReminderDays,
    notes: payload.notes ?? "",
    createdAt: payload.createdAt ?? new Date().toISOString(),
    updatedAt: payload.updatedAt ?? null,
    lastReminderSentOn: payload.lastReminderSentOn ?? null,
  };
}

function mergeSubscription(existing, updates = {}) {
  const remindBeforeDays =
    updates.remindBeforeDays !== undefined
      ? Math.max(0, Number(updates.remindBeforeDays) || 0)
      : existing.remindBeforeDays ?? defaultSettings.defaultReminderDays;

  const tagsSource = updates.tags ?? existing.tags ?? [];

  return {
    ...existing,
    ...updates,
    tags: Array.isArray(tagsSource)
      ? tagsSource.filter(Boolean)
      : String(tagsSource || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    price: Number(updates.price ?? existing.price) || 0,
    customCycleDays: updates.customCycleDays
      ? Number(updates.customCycleDays)
      : existing.customCycleDays ?? null,
    remindBeforeDays,
    updatedAt: new Date().toISOString(),
  };
}

export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      ...defaultState,
      addSubscription: (payload) =>
        set((state) => ({
          subscriptions: [...state.subscriptions, normalizeNewSubscription(payload)],
        })),
      updateSubscription: (id, updates) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((item) =>
            item.id === id ? mergeSubscription(item, updates) : item,
          ),
        })),
      deleteSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((item) => item.id !== id),
        })),
      setSettings: (settings) =>
        set(() => ({
          settings: { ...defaultSettings, ...settings },
        })),
      markReminderSent: (id, isoDate) =>
        set((state) => ({
          subscriptions: state.subscriptions.map((item) =>
            item.id === id ? { ...item, lastReminderSentOn: isoDate } : item,
          ),
        })),
      importFromBackup: (payload) => {
        const safeSubscriptions = Array.isArray(payload?.subscriptions)
          ? payload.subscriptions.map(normalizeNewSubscription)
          : [];
        set({
          subscriptions: safeSubscriptions,
          settings: { ...defaultSettings, ...(payload?.settings ?? {}) },
          restoredFromBackup: true,
        });
      },
      resetRestoredFlag: () => set({ restoredFromBackup: false }),
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const safeSubscriptions = Array.isArray(persistedState?.subscriptions)
          ? persistedState.subscriptions.map(normalizeNewSubscription)
          : [];
        return {
          ...defaultState,
          ...persistedState,
          subscriptions: safeSubscriptions,
          settings: { ...defaultSettings, ...(persistedState?.settings ?? {}) },
        };
      },
    },
  ),
);
