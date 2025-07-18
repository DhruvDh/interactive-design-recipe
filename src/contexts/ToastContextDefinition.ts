import { createContext } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
