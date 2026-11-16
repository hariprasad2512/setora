import React from 'react';
import {Check, ChevronDown} from 'lucide-react';
import type {
  CompletionRecord,
  WeekStart,
  WeekdayName,
  WorkoutBlock,
} from '../types/workout';
import {
  formatCategoryLabel,
  getDateForWeekdayInWeek,
  getOrderedWeekdays,
  getTodayIsoDate,
  getWeekdayFromIsoDate,
} from '../utils/workoutFormatters';

interface WeekdaySwitcherStripProps {
  blocks: WorkoutBlock[];
  activeBlock: WorkoutBlock;
  weekStart: WeekStart;
  selectedDay: WeekdayName;
  completionRecords: CompletionRecord[];
  onSelectBlock: (blockId: string) => void;
  onSelectDay: (day: WeekdayName) => void;
}

export const WeekdaySwitcherStrip: React.FC<WeekdaySwitcherStripProps> = ({
  blocks,
  activeBlock,
  weekStart,
  selectedDay,
  completionRecords,
  onSelectBlock,
  onSelectDay,
}) => {
  const todayIso = getTodayIsoDate();
  const todayWeekday = getWeekdayFromIsoDate(todayIso);
  const orderedWeekdays = getOrderedWeekdays(weekStart);

  return (
    <section
      aria-label="Active block and weekday switcher"
      className="space-y-3 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-3.5 sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium text-[var(--text-secondary)]">
            Your training. Your rhythm.
          </p>
        </div>

        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <select
            aria-label="Select programme block"
            value={activeBlock.id}
            onChange={(e) => onSelectBlock(e.target.value)}
            className="min-h-[44px] w-full appearance-none rounded-[12px] border border-[var(--border)] bg-[var(--background)] py-2 pl-3.5 pr-9 text-[14px] font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
          >
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.label}
                {block.status === 'partial_week' ? ' (Tue–Sat)' : ' (Mon–Sat)'}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Days of the week"
        className="grid grid-cols-7 gap-1.5"
      >
        {orderedWeekdays.map((weekday) => {
          const workoutDay =
            activeBlock.days.find((d) => d.day === weekday) ?? null;
          const dateForDay = getDateForWeekdayInWeek(
            weekday,
            weekStart,
            todayIso
          );
          const dayNum = Number(dateForDay.split('-')[2]);
          const record =
            completionRecords.find(
              (r) =>
                r.workout_date === dateForDay &&
                r.programme_block_id === activeBlock.id &&
                r.workout_day === weekday
            ) ?? null;

          const isSelected = selectedDay === weekday;
          const isToday = weekday === todayWeekday;
          const isCompleted =
            record?.completion_status === 'completed' && Boolean(workoutDay);

          return (
            <button
              key={weekday}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-label={`${weekday} ${dayNum}${
                workoutDay ? `, ${formatCategoryLabel(workoutDay.category)}` : ', Rest Day'
              }`}
              onClick={() => onSelectDay(weekday)}
              className={`relative flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-[12px] border px-1 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
                isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]'
                  : isToday
                    ? 'border-[var(--primary)]/50 bg-[var(--primary-tint)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                    : workoutDay
                      ? 'border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] hover:border-[var(--primary)]/40'
                      : 'border-transparent bg-[var(--background)]/60 text-[var(--text-secondary)] hover:border-[var(--border)]'
              }`}
            >
              <span className="text-[11px] font-medium tracking-tight">
                {weekday.slice(0, 3)}
              </span>
              <span className="text-[14px] font-semibold tabular-nums leading-tight">
                {dayNum}
              </span>
              <span className="flex h-3 items-center justify-center">
                {isCompleted ? (
                  <Check
                    className={`h-3 w-3 ${
                      isSelected
                        ? 'text-[var(--on-primary)]'
                        : 'text-[var(--success)]'
                    }`}
                    strokeWidth={2.75}
                  />
                ) : isToday ? (
                  <span
                    className={`text-[9px] font-semibold uppercase tracking-wider ${
                      isSelected
                        ? 'text-[var(--on-primary)]'
                        : 'text-[var(--primary)]'
                    }`}
                  >
                    Now
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
