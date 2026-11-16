import React from 'react';
import {BookOpen, Check} from 'lucide-react';
import type {PrescribedExercise} from '../types/workout';
import {
  formatExerciseVolume,
  formatPrescribedWeight,
} from '../utils/workoutFormatters';
import {ExerciseDiagram} from './ExerciseDiagram';

interface ExerciseCardProps {
  exercise: PrescribedExercise;
  completed: boolean;
  hasNote?: boolean;
  onToggleComplete: () => void;
  onOpenGuide: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  completed,
  hasNote = false,
  onToggleComplete,
  onOpenGuide,
}) => {
  const volumeText = formatExerciseVolume(exercise);
  const weight = formatPrescribedWeight(exercise);

  return (
    <article
      className={`flex items-center justify-between gap-3 rounded-[18px] border p-3.5 sm:p-4 transition-colors duration-150 ${
        completed
          ? 'border-[var(--primary)]/50 bg-[var(--surface-elevated)]'
          : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)]'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenGuide}
          aria-label={`View posture guide for ${exercise.name}`}
          className="h-16 w-20 shrink-0 rounded-[12px] transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <ExerciseDiagram
            exerciseName={exercise.name}
            variant="thumbnail"
            className="h-full w-full"
          />
        </button>

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenGuide}
            className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <h3
              className={`font-heading text-[17px] sm:text-[18px] font-semibold leading-snug transition-colors duration-150 group-hover:text-[var(--primary)] ${
                completed
                  ? 'text-[var(--text-secondary)] line-through'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {exercise.name}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[14px] text-[var(--text-secondary)] tabular-nums">
              <span>{volumeText}</span>
              {weight && (
                <>
                  <span aria-hidden="true">·</span>
                  <span
                    className={
                      weight.isSuggestion
                        ? 'text-[var(--warning)]'
                        : 'text-[var(--text-primary)] font-medium'
                    }
                  >
                    {weight.label}
                  </span>
                </>
              )}
              {hasNote && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[var(--primary)]">Note saved</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onOpenGuide}
          aria-label={`Open guide for ${exercise.name}`}
          title="Exercise guide"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[12px] text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <BookOpen className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>

        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={`Mark ${exercise.name} as ${
            completed ? 'incomplete' : 'completed'
          }`}
          onClick={onToggleComplete}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-[10px] border transition-all duration-150 ${
              completed
                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]'
                : 'border-[var(--border)] bg-[var(--background)] text-transparent hover:border-[var(--primary)]'
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={2.75} />
          </span>
        </button>
      </div>
    </article>
  );
};
