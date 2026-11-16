import React from 'react';
import {CalendarCheck, History, Settings} from 'lucide-react';
import type {NavTab} from '../types/workout';

interface BottomNavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

const NAV_ITEMS: {
  id: NavTab;
  label: string;
  Icon: React.ComponentType<{className?: string; strokeWidth?: number}>;
}[] = [
  {id: 'today', label: 'Today', Icon: CalendarCheck},
  {id: 'history', label: 'History', Icon: History},
  {id: 'settings', label: 'Settings', Icon: Settings},
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)] pb-safe"
    >
      <div className="mx-auto grid h-16 max-w-5xl grid-cols-3 items-center px-2 sm:px-6">
        {NAV_ITEMS.map(({id, label, Icon}) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-[14px] px-3 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                isActive
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute top-0 h-[2px] w-8 rounded-full transition-opacity duration-150 ${
                  isActive ? 'bg-[var(--primary)] opacity-100' : 'opacity-0'
                }`}
              />
              <Icon
                className="h-5 w-5 shrink-0 transition-transform duration-150 group-active:scale-95"
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span className="text-[11px] font-medium tracking-tight whitespace-nowrap shrink-0">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
