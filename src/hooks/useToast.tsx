import { useContext } from "react";
import { ToastContext } from "../context/Toast.context";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
