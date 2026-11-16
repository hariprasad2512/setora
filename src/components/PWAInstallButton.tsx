import React, {useState} from 'react';
import {Download, Share, X} from 'lucide-react';
import {usePWAInstall} from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{compact?: boolean}> = ({
  compact = false,
}) => {
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return compact ? null : (
      <p className="text-[13px] text-[var(--success)]">
        Installed on this device
      </p>
    );
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={
          compact
            ? 'inline-flex min-h-[44px] items-center gap-2 rounded-[14px] bg-[var(--primary)] px-4 py-2 text-[14px] font-medium text-[var(--on-primary)] transition-colors duration-150 hover:bg-[var(--primary-hover)] whitespace-nowrap shrink-0'
            : 'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--primary)] px-5 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors duration-150 hover:bg-[var(--primary-hover)] whitespace-nowrap'
        }
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>Install Setora App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-[14px] font-medium text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--primary)] whitespace-nowrap shrink-0"
        >
          <Share className="h-4 w-4 shrink-0" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-install-title"
          >
            <div className="w-full max-w-sm rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center justify-between gap-4">
                <h3
                  id="ios-install-title"
                  className="font-heading text-[20px] font-semibold text-[var(--text-primary)]"
                >
                  Install on iPhone or iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="Close installation guide"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[12px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-[var(--text-secondary)]">
                <li>
                  1. Tap the <strong className="text-[var(--text-primary)]">Share</strong> button in your Safari toolbar.
                </li>
                <li>
                  2. Scroll down and select <strong className="text-[var(--text-primary)]">Add to Home Screen</strong>.
                </li>
                <li>
                  3. Confirm to launch Setora full-screen offline.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 min-h-[48px] w-full rounded-[14px] bg-[var(--primary)] px-4 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return compact ? null : (
    <p className="text-[13px] text-[var(--text-secondary)]">
      Open in Chrome or Edge on mobile or desktop to install Setora directly from your browser menu.
    </p>
  );
};
