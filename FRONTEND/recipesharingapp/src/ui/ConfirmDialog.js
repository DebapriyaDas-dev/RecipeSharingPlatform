import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiHelpCircle } from "react-icons/fi";

// Themed replacement for window.confirm
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && !busy && onCancel();
    document.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => confirmRef.current && confirmRef.current.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
    };
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sn-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}
        >
          <motion.div
            className="sn-modal__panel sn-card"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sn-confirm-title"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <span className={`sn-modal__icon sn-modal__icon--${tone}`}>
              {tone === "danger" ? <FiAlertTriangle /> : <FiHelpCircle />}
            </span>
            <h3 id="sn-confirm-title">{title}</h3>
            {message && <p>{message}</p>}
            <div className="sn-modal__actions">
              <button type="button" className="sn-btn sn-btn--ghost" onClick={onCancel} disabled={busy}>
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                type="button"
                className={`sn-btn ${tone === "danger" ? "sn-btn--danger-solid" : "sn-btn--primary"}`}
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? <span className="sn-spinner" aria-hidden="true" /> : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
