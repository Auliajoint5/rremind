export function AppHeader({ onAddSubscription, onOpenSettings }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">rremind</p>
        <h1>订阅到期提醒中心</h1>
        <p className="subtitle">
          React + Vite 驱动的本地优先应用，支持 Telegram 推送、JSON 备份与多维度筛选。
        </p>
      </div>
      <div className="header-actions">
        <button className="ghost" onClick={onOpenSettings}>
          设置
        </button>
        <button className="primary" onClick={onAddSubscription}>
          + 添加订阅
        </button>
      </div>
    </header>
  );
}
