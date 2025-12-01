import { useEffect, useState } from "react";
import { Modal } from "./Modal.jsx";

const defaultForm = {
  telegramEnabled: false,
  telegramToken: "",
  telegramChatId: "",
  defaultReminderDays: 7,
};

export function SettingsDrawer({ open, settings, onClose, onSave }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({ ...defaultForm, ...settings });
    }
  }, [settings, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      defaultReminderDays: Math.max(0, Number(form.defaultReminderDays) || 0),
    });
  };

  return (
    <Modal open={open} title="全局设置" onClose={onClose} width="modal-panel drawer-panel">
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="toggle" style={{ gridColumn: "1 / -1" }}>
          <input
            type="checkbox"
            name="telegramEnabled"
            checked={form.telegramEnabled}
            onChange={handleChange}
          />
          <span>启用 Telegram 提醒</span>
        </label>

        <label>
          Bot Token
          <input
            type="password"
            name="telegramToken"
            placeholder="123456:ABCDEF"
            value={form.telegramToken}
            onChange={handleChange}
          />
        </label>

        <label>
          Chat ID
          <input
            type="text"
            name="telegramChatId"
            placeholder="可填 group id 或 user id"
            value={form.telegramChatId}
            onChange={handleChange}
          />
        </label>

        <label>
          默认提前提醒 (天)
          <input
            type="number"
            name="defaultReminderDays"
            min="0"
            value={form.defaultReminderDays}
            onChange={handleChange}
          />
        </label>

        <p className="hint" style={{ gridColumn: "1 / -1" }}>
          提示：凭据仅保存在当前浏览器的 localStorage 中，导出备份时也会包含这些字段。
        </p>

        <div className="dialog-footer" style={{ gridColumn: "1 / -1" }}>
          <div className="actions" style={{ marginLeft: "auto" }}>
            <button type="button" className="ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="primary">
              保存设置
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
