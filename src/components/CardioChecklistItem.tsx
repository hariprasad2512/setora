import React from 'react';
import {Check, Footprints} from 'lucide-react';
import type {CardioPrescription} from '../types/workout';
import {formatCardioActivity} from '../utils/workoutFormatters';

interface CardioChecklistItemProps {
  cardio: CardioPrescription;
  completed: boolean;
  onToggle: () => void;
}

export const CardioChecklistItem: React.FC<CardioChecklistItemProps> = ({
  cardio,
  completed,
  onToggle,
}) => {
  const activityLabel = formatCardioActivity(cardio.activity);

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-[18px] border p-4 transition-colors duration-150 ${
        completed
          ? 'border-[var(--primary)]/50 bg-[var(--surface-elevated)]'
          : 'border-[var(--border)] bg-[var(--surface)]'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border transition-colors duration-150 ${
            completed
              ? 'border-[var(--primary)]/40 bg-[var(--primary-tint)] text-[var(--primary)]'
              : 'border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]'
          }`}
        >
          <Footprints className="h-5 w-5" strokeWidth={1.75} />
        </div>

        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[var(--text-secondary)]">
            Cardio
          </p>
          <h3
            className={`font-heading text-[18px] font-semibold leading-snug transition-colors duration-150 ${
              completed
                ? 'text-[var(--text-secondary)] line-through'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {activityLabel}
          </h3>
          <p className="mt-0.5 text-[14px] text-[var(--text-secondary)] tabular-nums">
            {cardio.duration_minutes} minutes
          </p>
        </div>
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label={`Mark ${activityLabel} (${cardio.duration_minutes} minutes) as ${
          completed ? 'incomplete' : 'completed'
        }`}
        onClick={onToggle}
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-[10px] border transition-all duration-150 ${
            completed
              ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)] scale-100'
              : 'border-[var(--border)] bg-[var(--background)] text-transparent hover:border-[var(--primary)]'
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={2.75} />
        </span>
      </button>
    </div>
  );
};
