// utils/toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showConfirm = (msg) => {
  return new Promise((resolve) => {
    const result = window.confirm(msg);
    resolve(result);
  });
};
