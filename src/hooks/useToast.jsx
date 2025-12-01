import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { nanoid } from "nanoid";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((message, variant = "success") => {
    const id = nanoid(8);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => remove(id), 3600);
  }, [remove]);

  const value = useMemo(() => pushToast, [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="toast-host">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.variant} visible`}>
              {toast.message}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (ctx === undefined) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
