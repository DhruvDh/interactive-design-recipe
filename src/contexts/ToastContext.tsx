import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { ToastContext } from "./ToastContextDefinition";
import type { Toast } from "./ToastContextDefinition";

export function ToastProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const displayedToasts = useRef<Set<string>>(new Set());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    displayedToasts.current.delete(id);
  }, []);

  const addToast = useCallback(
    (message: string, type: Toast["type"], duration = 5000) => {
      const id = crypto.randomUUID();
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  // Idempotent effect to handle toast timeouts
  useEffect(() => {
    toasts.forEach((toast) => {
      if (displayedToasts.current.has(toast.id)) return; // Already processed

      displayedToasts.current.add(toast.id);

      if (toast.duration && toast.duration > 0) {
        setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
      }
    });
  }, [toasts, removeToast]);

  // Clean up displayed set on unmount
  useEffect(() => {
    const displayed = displayedToasts.current;
    return () => {
      displayed.clear();
    };
  }, []);

  // Memoize context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}
