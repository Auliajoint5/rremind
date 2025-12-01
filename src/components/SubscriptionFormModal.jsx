import { useEffect, useState } from "react";
import { Modal } from "./Modal.jsx";
import { defaultSettings } from "../store/useSubscriptionStore.js";

const cycleOptions = [
  { value: "monthly", label: "每月" },
  { value: "quarterly", label: "每季度" },
  { value: "yearly", label: "每年" },
  { value: "custom", label: "自定义天数" },
];

const createEmptyForm = (defaultReminderDays = defaultSettings.defaultReminderDays) => ({
  name: "",
  category: "",
  tags: "",
  price: "",
  renewalDate: "",
  cycle: "yearly",
  customCycleDays: "",
  remindBeforeDays: defaultReminderDays,
  notes: "",
});

export function SubscriptionFormModal({
  open,
  initialData,
  onClose,
  onSubmit,
  onDelete,
  defaultReminderDays,
}) {
  const [form, setForm] = useState(createEmptyForm(defaultReminderDays));

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      setForm({
        ...createEmptyForm(defaultReminderDays),
        ...initialData,
        tags: initialData.tags?.join(",") ?? "",
        customCycleDays: initialData.customCycleDays ?? "",
        remindBeforeDays:
          initialData.remindBeforeDays ?? defaultReminderDays ?? defaultSettings.defaultReminderDays,
      });
    } else {
      setForm(createEmptyForm(defaultReminderDays));
    }
  }, [initialData, open, defaultReminderDays]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.renewalDate) return;

    const payload = {
      ...initialData,
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      price: Number(form.price) || 0,
      customCycleDays:
        form.cycle === "custom" ? Math.max(1, Number(form.customCycleDays) || 1) : null,
      remindBeforeDays: Math.max(0, Number(form.remindBeforeDays) || 0),
    };
    onSubmit(payload);
  };

  const showCustomCycle = form.cycle === "custom";

  return (
    <Modal
      open={open}
      title={initialData ? "编辑订阅" : "添加订阅"}
      onClose={onClose}
      actions={null}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          名称
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          分类
          <input type="text" name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          标签
          <input
            type="text"
            name="tags"
            placeholder="tag1,tag2"
            value={form.tags}
            onChange={handleChange}
          />
        </label>
        <label>
          费用 (¥)
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
          />
        </label>
        <label>
          下次扣费日期
          <input
            type="date"
            name="renewalDate"
            value={form.renewalDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          周期
          <select name="cycle" value={form.cycle} onChange={handleChange}>
            {cycleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {showCustomCycle && (
          <label>
            自定义周期 (天)
            <input
              type="number"
              name="customCycleDays"
              min="1"
              value={form.customCycleDays}
              onChange={handleChange}
              required
            />
          </label>
        )}
        <label>
          提前提醒 (天)
          <input
            type="number"
            name="remindBeforeDays"
            min="0"
            value={form.remindBeforeDays}
            onChange={handleChange}
          />
        </label>
        <label style={{ gridColumn: "1 / -1" }}>
          备注
          <textarea
            name="notes"
            rows={4}
            placeholder="补充细节、退订方式等"
            value={form.notes}
            onChange={handleChange}
          />
        </label>
        <div className="dialog-footer" style={{ gridColumn: "1 / -1" }}>
          <button
            className="ghost"
            type="button"
            style={{ visibility: initialData ? "visible" : "hidden" }}
            onClick={() => initialData && onDelete(initialData)}
          >
            删除
          </button>
          <div className="actions">
            <button type="button" className="ghost" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="primary">
              保存
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
