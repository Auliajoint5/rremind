import { createPortal } from "react-dom";

export function Modal({ open, title, onClose, width = "modal-panel", children, actions }) {
  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-panel ${width}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="ghost" onClick={onClose}>
            ✕
          </button>
        </div>
        <div>{children}</div>
        {actions}
      </div>
    </div>,
    document.body,
  );
}
