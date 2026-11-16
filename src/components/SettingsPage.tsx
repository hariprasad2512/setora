import React, {useState} from 'react';
import {ChevronDown, Monitor, Moon, RotateCcw, Sun, X} from 'lucide-react';
import type {
  ThemePreference,
  WeekStart,
  WorkoutBlock,
} from '../types/workout';
import {useTheme} from './ThemeProvider';
import {PWAInstallButton} from './PWAInstallButton';
import {formatShortDate, getTodayIsoDate} from '../utils/workoutFormatters';

interface SettingsPageProps {
  blocks: WorkoutBlock[];
  activeBlockId: string;
  weekStart: WeekStart;
  todayHasRecords: boolean;
  onSelectBlock: (blockId: string) => void;
  onChangeWeekStart: (weekStart: WeekStart) => void;
  onResetToday: () => void;
}

const THEME_OPTIONS: {
  id: ThemePreference;
  label: string;
  Icon: React.ComponentType<{className?: string}>;
}[] = [
  {id: 'dark', label: 'Dark', Icon: Moon},
  {id: 'light', label: 'Light', Icon: Sun},
  {id: 'system', label: 'System', Icon: Monitor},
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  blocks,
  activeBlockId,
  weekStart,
  todayHasRecords,
  onSelectBlock,
  onChangeWeekStart,
  onResetToday,
}) => {
  const {theme, setTheme} = useTheme();
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [resetDoneMessage, setResetDoneMessage] = useState(false);

  const todayIso = getTodayIsoDate();

  const handleConfirmReset = () => {
    onResetToday();
    setConfirmResetOpen(false);
    setResetDoneMessage(true);
    window.setTimeout(() => setResetDoneMessage(false), 2500);
  };

  return (
    <section aria-label="Settings" className="space-y-6">
      <div>
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          Preferences &amp; programme
        </p>
        <h1 className="mt-1 font-heading text-[28px] sm:text-[32px] font-bold leading-tight text-[var(--text-primary)]">
          Settings
        </h1>
      </div>

      <div className="space-y-4">
        {/* Theme */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <h2 className="font-heading text-[18px] font-semibold text-[var(--text-primary)]">
            Appearance
          </h2>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Choose Dark, Light, or follow your device setting.
          </p>
          <div
            role="radiogroup"
            aria-label="Theme preference"
            className="mt-4 grid grid-cols-3 gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--background)] p-1.5"
          >
            {THEME_OPTIONS.map(({id, label, Icon}) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(id)}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-3 text-[14px] font-medium transition-colors duration-150 whitespace-nowrap ${
                    active
                      ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Programme */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <label
            htmlFor="settings-programme-select"
            className="block font-heading text-[18px] font-semibold text-[var(--text-primary)]"
          >
            Active workout programme
          </label>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            All six trainer-prescribed blocks are preserved in sequence.
          </p>
          <div className="relative mt-4">
            <select
              id="settings-programme-select"
              value={activeBlockId}
              onChange={(e) => onSelectBlock(e.target.value)}
              className="min-h-[48px] w-full appearance-none rounded-[12px] border border-[var(--border)] bg-[var(--background)] py-2.5 pl-3.5 pr-10 text-[15px] font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
            >
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.label}
                  {block.status === 'partial_week' ? ' (Tue–Sat)' : ' (Mon–Sat)'}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Week Start Preference */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <h2 className="font-heading text-[18px] font-semibold text-[var(--text-primary)]">
            Week starts on
          </h2>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Adjust how weekdays are ordered in the weekday switcher strip.
          </p>
          <div
            role="radiogroup"
            aria-label="Week start preference"
            className="mt-4 grid grid-cols-2 gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--background)] p-1.5"
          >
            {(['monday', 'sunday'] as WeekStart[]).map((start) => {
              const active = weekStart === start;
              return (
                <button
                  key={start}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChangeWeekStart(start)}
                  className={`flex min-h-[44px] items-center justify-center rounded-[10px] px-3 text-[14px] font-medium transition-colors duration-150 whitespace-nowrap ${
                    active
                      ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {start === 'monday' ? 'Monday' : 'Sunday'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Today's Checklist */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <h2 className="font-heading text-[18px] font-semibold text-[var(--text-primary)]">
            Reset today&apos;s checklist
          </h2>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Clear checked items for {formatShortDate(todayIso)} without affecting past workout history.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!todayHasRecords}
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-2.5 text-[14px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--warning)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span>Reset Today&apos;s Checklist</span>
            </button>
            {resetDoneMessage && (
              <span className="text-[13px] font-medium text-[var(--success)]">
                Today&apos;s checklist cleared.
              </span>
            )}
          </div>
        </div>

        {/* Install App */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <h2 className="font-heading text-[18px] font-semibold text-[var(--text-primary)]">
            App installation
          </h2>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            Add Setora to your home screen for offline gym access.
          </p>
          <div className="mt-4">
            <PWAInstallButton />
          </div>
        </div>

        {/* About Setora */}
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <h2 className="font-heading text-[18px] font-semibold text-[var(--text-primary)]">
            About Setora
          </h2>
          <p className="mt-1 text-[15px] font-medium text-[var(--primary)]">
            setora. — Your training. Your rhythm.
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Setora is a calm personal workout notebook built around your trainer-prescribed schedule. Prescribed exercises, weights, and notes remain unmodified while your daily completion history is stored locally on this device.
          </p>
        </div>
      </div>

      {confirmResetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
          onClick={() => setConfirmResetOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h3
                id="reset-confirm-title"
                className="font-heading text-[20px] font-semibold text-[var(--text-primary)]"
              >
                Reset today&apos;s checklist?
              </h3>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                aria-label="Cancel reset"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[12px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-secondary)]">
              This clears all checked exercises and cardio for {formatShortDate(todayIso)}. Previous days in History stay untouched.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[48px] flex-1 rounded-[14px] bg-[var(--primary)] px-4 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                Reset Today
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="min-h-[48px] flex-1 rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-[15px] font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--primary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
