import { useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader.jsx";
import { DashboardStats } from "./components/DashboardStats.jsx";
import { FilterPanel } from "./components/FilterPanel.jsx";
import { BackupControls } from "./components/BackupControls.jsx";
import { SubscriptionList } from "./components/SubscriptionList.jsx";
import { SubscriptionFormModal } from "./components/SubscriptionFormModal.jsx";
import { SettingsDrawer } from "./components/SettingsDrawer.jsx";
import { ReminderDaemon } from "./components/ReminderDaemon.jsx";
import { ToastProvider, useToast } from "./hooks/useToast.jsx";
import { useSubscriptionStore } from "./store/useSubscriptionStore.js";
import { computeDashboardStats, determineStatus, filterSubscriptions } from "./utils/subscriptions.js";
import { sendTelegramMessage } from "./utils/telegram.js";

const initialFilters = {
  query: "",
  status: "all",
  sort: "nearest",
};

function AppShell() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const settings = useSubscriptionStore((state) => state.settings);
  const addSubscription = useSubscriptionStore((state) => state.addSubscription);
  const updateSubscription = useSubscriptionStore((state) => state.updateSubscription);
  const deleteSubscription = useSubscriptionStore((state) => state.deleteSubscription);
  const setSettings = useSubscriptionStore((state) => state.setSettings);
  const importFromBackup = useSubscriptionStore((state) => state.importFromBackup);
  const markReminderSent = useSubscriptionStore((state) => state.markReminderSent);
  const toast = useToast();

  const [filters, setFilters] = useState(initialFilters);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const stats = useMemo(
    () => computeDashboardStats(subscriptions, settings),
    [subscriptions, settings],
  );

  const filtered = useMemo(
    () => filterSubscriptions(subscriptions, filters, settings),
    [subscriptions, filters, settings],
  );

  const statuses = useMemo(() => {
    const now = new Date();
    return filtered.reduce((acc, sub) => {
      acc[sub.id] = determineStatus(sub, settings, now);
      return acc;
    }, {});
  }, [filtered, settings]);

  const openFormForCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openFormForEdit = (subscription) => {
    setEditing(subscription);
    setFormOpen(true);
  };

  const handleFiltersChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSubscription = (payload) => {
    if (editing) {
      updateSubscription(editing.id, payload);
      toast("订阅已更新");
    } else {
      addSubscription(payload);
      toast("订阅已创建");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleDeleteSubscription = (subscription) => {
    if (confirm(`确定删除订阅「${subscription.name}」吗？`)) {
      deleteSubscription(subscription.id);
      toast("订阅已删除", "warning");
      setFormOpen(false);
      setEditing(null);
    }
  };

  const handleManualReminder = async (subscription) => {
    try {
      await sendTelegramMessage(subscription, settings, "manual");
      const todayKey = new Date().toISOString().slice(0, 10);
      markReminderSent(subscription.id, todayKey);
      toast(`已发送 Telegram 提醒：${subscription.name}`);
    } catch (error) {
      toast(error.message, "danger");
    }
  };

  const handleExportBackup = () => {
    const payload = JSON.stringify(
      {
        subscriptions,
        settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rremind-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("备份文件已生成");
  };

  const handleImportBackup = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.subscriptions)) {
        throw new Error("备份格式不正确");
      }
      importFromBackup(parsed);
      toast("备份已恢复");
    } catch (error) {
      toast(`恢复失败：${error.message}`, "danger");
    }
  };

  return (
    <div className="app-shell">
      <ReminderDaemon />
      <AppHeader onAddSubscription={openFormForCreate} onOpenSettings={() => setSettingsOpen(true)} />
      <DashboardStats stats={stats} />
      <FilterPanel filters={filters} onChange={handleFiltersChange} />

      <section className="card list-panel">
        <div className="list-header">
          <div>
            <h2 style={{ marginBottom: 0 }}>订阅列表</h2>
            <p className="section-description">支持实时过滤与手动触发提醒</p>
          </div>
          <BackupControls onExport={handleExportBackup} onImport={handleImportBackup} />
        </div>
        <SubscriptionList
          subscriptions={filtered}
          statuses={statuses}
          onEdit={openFormForEdit}
          onRemind={handleManualReminder}
        />
      </section>

      <SubscriptionFormModal
        open={isFormOpen}
        initialData={editing}
        defaultReminderDays={settings.defaultReminderDays}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmitSubscription}
        onDelete={handleDeleteSubscription}
      />

      <SettingsDrawer
        open={isSettingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={(next) => {
          setSettings(next);
          toast("设置已保存");
          setSettingsOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}
