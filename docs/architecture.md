# 架构与实现说明

## 顶层概览

```
src/
├── App.jsx                     # 页面骨架 + 过滤/备份/交互逻辑
├── components/
│   ├── AppHeader.jsx           # 顶部 Hero + CTA
│   ├── DashboardStats.jsx      # 四个 KPI 卡片
│   ├── FilterPanel.jsx         # 搜索/状态/排序
│   ├── SubscriptionList.jsx    # 列表壳
│   ├── SubscriptionCard.jsx    # 单条订阅卡片
│   ├── SubscriptionFormModal.jsx
│   ├── SettingsDrawer.jsx
│   ├── BackupControls.jsx
│   ├── ReminderDaemon.jsx      # 定时自动提醒，挂在 AppShell 内
│   └── Modal.jsx               # 通用模态框容器
├── hooks/useToast.js           # 轻量 Toast Provider
├── store/useSubscriptionStore.js
├── utils/
│   ├── formatters.js           # 货币/日期/周期格式化
│   ├── subscriptions.js        # 状态机、筛选、统计
│   └── telegram.js             # 与 Telegram Bot API 交互
└── index.css + main.jsx
```

## 状态管理

- 使用 Zustand + `persist` 中间件将 `subscriptions` 和 `settings` 序列化到 `localStorage`（键 `rremind_state_v2`）。
- `normalizeNewSubscription()` 在新增/导入时兜底所有字段，确保 tags/价格/周期合法。
- `mergeSubscription()` 用于编辑操作，保证提醒阈值和 tags 数组始终保持结构。
- `markReminderSent(id, isoDate)` 由自动守护进程 & 手动推送共用，避免同一天重复提醒。

### 数据形状

```ts
type Subscription = {
  id: string;
  name: string;
  renewalDate: string;
  cycle: "monthly" | "quarterly" | "yearly" | "custom";
  customCycleDays?: number | null;
  remindBeforeDays: number;
  price: number;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string | null;
  lastReminderSentOn: string | null; // YYYY-MM-DD
}

type Settings = {
  telegramEnabled: boolean;
  telegramToken: string;
  telegramChatId: string;
  defaultReminderDays: number;
}
```

## 业务模块

- **DashboardStats**：通过 `computeDashboardStats()` 得到 KPI，年费由 `cycleToAnnualMultiplier` 换算。
- **筛选/排序**：`filterSubscriptions()` 处理关键字、状态、排序策略，返回新数组供列表渲染。
- **ReminderDaemon**：组件挂载后立即执行一次检查，并每小时运行一次。只在 Telegram 打开且处于“即将到期”状态时触发 `sendTelegramMessage()`，成功后写入 `lastReminderSentOn`。
- **Telegram Client**：集中在 `utils/telegram.js`，只暴露一个 `sendTelegramMessage()`，组件只需捕获异常并吐司提示。
- **备份/恢复**：在 App 层构造和解析 JSON。`importFromBackup()` 会重新走 normalization，保证兼容旧版本数据。

## 扩展建议

1. **PWA + 推送**：可在 `vite.config.js` 中挂 Workbox 插件，实现离线缓存和通知。
2. **多渠道提醒**：将 `sendTelegramMessage()` 抽象为 `useNotifiers()`，根据设置同时推送多个渠道。
3. **路线图**：
   - 订阅分组看板 / 甘特图
   - 导出 CSV / ICS / Google Calendar
   - 可配置的周期模版（如双周、48 天等）
