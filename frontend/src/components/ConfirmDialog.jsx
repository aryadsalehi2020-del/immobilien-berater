import React from 'react';

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Bestätigung',
  message = 'Möchten Sie fortfahren?',
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: (
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      iconBg: 'bg-red-500/20',
      confirmBtn: 'bg-red-500 hover:bg-red-600 text-white',
      titleColor: 'text-red-400'
    },
    warning: {
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      iconBg: 'bg-amber-500/20',
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 text-white',
      titleColor: 'text-amber-400'
    },
    info: {
      icon: (
        <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-neon-blue/20',
      confirmBtn: 'bg-neon-blue hover:bg-neon-blue/80 text-white',
      titleColor: 'text-neon-blue'
    }
  };

  const style = variants[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative glass-card rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl animate-scale-in">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            {style.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${style.titleColor} mb-2`}>
              {title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-white/20 text-text-secondary hover:border-white/40 hover:text-white rounded-xl transition-all font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-3 rounded-xl transition-all font-bold ${style.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
