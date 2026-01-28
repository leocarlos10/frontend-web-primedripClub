import type { ToastType } from "../Toast";

export interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}
