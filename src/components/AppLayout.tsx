import React from 'react';
import {WifiOff} from 'lucide-react';
import type {NavTab} from '../types/workout';
import {useOnlineStatus} from '../hooks/useOnlineStatus';
import {BottomNavigation} from './BottomNavigation';

interface AppLayoutProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  onLogoClick: () => void;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onChangeTab,
  onLogoClick,
  rightAction,
  children,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onLogoClick}
            className="font-heading text-[22px] font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
          >
            setora<span className="text-[var(--primary)]">.</span>
          </button>

          <div className="flex items-center gap-3 shrink-0">
            {!isOnline && (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--warning)] whitespace-nowrap">
                <WifiOff className="h-3.5 w-3.5 shrink-0" />
                <span>Offline</span>
              </span>
            )}
            {rightAction}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <BottomNavigation activeTab={activeTab} onChangeTab={onChangeTab} />
    </div>
  );
};
