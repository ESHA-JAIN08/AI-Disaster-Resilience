import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../utils/AppContext.jsx';

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {t.type === 'success'
            ? <CheckCircle size={16} color="var(--green)" />
            : <AlertCircle size={16} color="var(--red)" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

