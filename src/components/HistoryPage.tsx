import React from 'react';
import {CalendarCheck2, CheckCircle2, ChevronRight, Clock} from 'lucide-react';
import type {CompletionRecord} from '../types/workout';
import {
  formatCategoryLabel,
  formatShortDate,
} from '../utils/workoutFormatters';

interface HistoryPageProps {
  records: CompletionRecord[];
  onOpenRecord: (record: CompletionRecord) => void;
  onGoToSchedule: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  records,
  onOpenRecord,
  onGoToSchedule,
}) => {
  return (
    <section aria-label="Workout history" className="space-y-6">
      <div>
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          Completed &amp; in-progress sessions
        </p>
        <h1 className="mt-1 font-heading text-[28px] sm:text-[32px] font-bold leading-tight text-[var(--text-primary)]">
          History
        </h1>
      </div>

      {records.length === 0 ? (
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--primary)]">
            <CalendarCheck2 className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h2 className="mt-4 font-heading text-[20px] font-semibold text-[var(--text-primary)]">
            No workout sessions recorded yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[var(--text-secondary)]">
            Check off cardio or exercises on any day in your schedule and your date-specific log will appear here automatically.
          </p>
          <button
            type="button"
            onClick={onGoToSchedule}
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-[14px] bg-[var(--primary)] px-6 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-hover)]"
          >
            Go to Today&apos;s Workout
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map((record) => {
            const isCompleted = record.completion_status === 'completed';
            return (
              <button
                key={record.id}
                type="button"
                onClick={() => onOpenRecord(record)}
                className="group flex min-h-[76px] w-full items-center justify-between gap-4 rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 text-left transition-colors duration-150 hover:border-[var(--primary)]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-[var(--text-secondary)] tabular-nums">
                    <span className="font-medium text-[var(--text-primary)]">
                      {formatShortDate(record.workout_date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{record.workout_day}</span>
                    <span aria-hidden="true">·</span>
                    <span>{record.programme_block_label}</span>
                  </div>

                  <p className="mt-1 font-heading text-[18px] font-semibold text-[var(--text-primary)]">
                    {formatCategoryLabel(record.category)}
                  </p>

                  <p className="mt-1 text-[13px] text-[var(--text-secondary)] tabular-nums">
                    {record.completed_exercise_ids.length} /{' '}
                    {record.total_exercises} exercises
                    <span aria-hidden="true"> · </span>
                    Cardio {record.cardio_completed ? 'done' : 'pending'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${
                      isCompleted
                        ? 'text-[var(--success)]'
                        : 'text-[var(--primary)]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <Clock className="h-4 w-4 shrink-0" />
                    )}
                    <span>{isCompleted ? 'Completed' : 'In progress'}</span>
                  </span>

                  <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
