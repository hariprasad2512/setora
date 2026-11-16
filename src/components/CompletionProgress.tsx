import React from 'react';

interface CompletionProgressProps {
  completedExercises: number;
  totalExercises: number;
  cardioCompleted: boolean;
  hasCardio: boolean;
}

export const CompletionProgress: React.FC<CompletionProgressProps> = ({
  completedExercises,
  totalExercises,
  cardioCompleted,
  hasCardio,
}) => {
  const totalItems = totalExercises + (hasCardio ? 1 : 0);
  const completedItems = completedExercises + (hasCardio && cardioCompleted ? 1 : 0);
  const ratio = totalItems > 0 ? Math.min(1, completedItems / totalItems) : 0;
  const percent = Math.round(ratio * 100);
  const allDone = totalItems > 0 && completedItems === totalItems;

  return (
    <section
      aria-label="Daily completion progress"
      className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[14px] font-medium text-[var(--text-primary)] tabular-nums">
          {completedExercises} / {totalExercises} exercises completed
          {hasCardio && (
            <span className="text-[var(--text-secondary)]">
              {' '}
              · Cardio {cardioCompleted ? 'done' : 'pending'}
            </span>
          )}
        </p>
        <span
          className={`text-[14px] font-semibold tabular-nums ${
            allDone ? 'text-[var(--success)]' : 'text-[var(--primary)]'
          }`}
        >
          {percent}%
        </span>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--surface-elevated)]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full origin-left rounded-full transition-transform duration-200 ease-out"
          style={{
            transform: `scaleX(${ratio})`,
            backgroundColor: allDone ? 'var(--success)' : 'var(--primary)',
          }}
        />
      </div>
    </section>
  );
};
