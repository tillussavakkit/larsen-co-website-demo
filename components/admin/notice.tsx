'use client';

import type { ReactNode } from 'react';

type NoticeProps = {
  children: ReactNode;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onDismiss?: () => void;
};

export function Notice({
  children,
  title,
  variant = 'info',
  onDismiss,
}: NoticeProps) {
  const urgent = variant === 'error';

  return (
    <div
      className={`admin-notice admin-notice--${variant}`}
      role={urgent ? 'alert' : 'status'}
      aria-live={urgent ? 'assertive' : 'polite'}
    >
      <span className="admin-notice__mark" aria-hidden="true">
        {variant === 'success' ? '✓' : variant === 'error' ? '!' : 'i'}
      </span>
      <div className="admin-notice__content">
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="admin-notice__dismiss"
          onClick={onDismiss}
          aria-label="Luk besked"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
