import React from 'react';
import {ArrowLeft, Calendar, CheckCircle2, Info} from 'lucide-react';
import type {
  CompletionRecord,
  PrescribedExercise,
  WeekdayName,
  WorkoutBlock,
  WorkoutDay,
} from '../types/workout';
import {
  formatCategoryLabel,
  formatReadableDate,
  getTodayIsoDate,
  slugify,
} from '../utils/workoutFormatters';
import {exerciseNotesStorage} from '../services/storage';
import {CardioChecklistItem} from './CardioChecklistItem';
import {CompletionProgress} from './CompletionProgress';
import {ExerciseCard} from './ExerciseCard';

interface DailyChecklistProps {
  block: WorkoutBlock;
  weekday: WeekdayName;
  workoutDay: WorkoutDay | null;
  workoutDate: string;
  completionRecord: CompletionRecord | null;
  backLabel?: string;
  hideBackOnDesktop?: boolean;
  onBack?: () => void;
  onChangeDate: (nextDate: string) => void;
  onToggleCardio: () => void;
  onToggleExercise: (exerciseId: string) => void;
  onOpenGuide: (exercise: PrescribedExercise) => void;
  onSelectWeekday?: (day: WeekdayName) => void;
  noteVersion: number;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  block,
  weekday,
  workoutDay,
  workoutDate,
  completionRecord,
  backLabel,
  hideBackOnDesktop = false,
  onBack,
  onChangeDate,
  onToggleCardio,
  onToggleExercise,
  onOpenGuide,
  onSelectWeekday,
  noteVersion,
}) => {
  const todayIso = getTodayIsoDate();
  const savedNotesMap = React.useMemo(() => {
    void noteVersion;
    return exerciseNotesStorage.getAll();
  }, [noteVersion]);

  const completedIds = new Set(completionRecord?.completed_exercise_ids ?? []);
  const cardioCompleted = completionRecord?.cardio_completed ?? false;
  const totalExercises = workoutDay?.exercises.length ?? 0;
  const completedCount = workoutDay
    ? workoutDay.exercises.filter((ex) => completedIds.has(ex.id)).length
    : 0;

  const isAllDone =
    Boolean(workoutDay) &&
    totalExercises > 0 &&
    completedCount === totalExercises &&
    cardioCompleted;

  return (
    <section aria-label="Daily workout checklist" className="space-y-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-[12px] px-1 text-[14px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] ${
            hideBackOnDesktop ? 'lg:hidden' : ''
          }`}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>{backLabel ?? 'Back to schedule'}</span>
        </button>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[var(--text-secondary)]">
            {block.label}
            <span aria-hidden="true"> · </span>
            <span>{formatReadableDate(workoutDate)}</span>
          </p>
          <h1 className="mt-1 font-heading text-[28px] sm:text-[32px] font-bold leading-tight text-[var(--text-primary)]">
            {weekday}
            {workoutDay ? ` — ${formatCategoryLabel(workoutDay.category)}` : ''}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative flex min-h-[44px] items-center gap-2 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] font-medium text-[var(--text-primary)] focus-within:border-[var(--primary)]">
            <Calendar className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
            <input
              type="date"
              aria-label="Workout session date"
              value={workoutDate}
              onChange={(e) => {
                if (e.target.value) onChangeDate(e.target.value);
              }}
              className="bg-transparent text-[13px] text-[var(--text-primary)] tabular-nums focus:outline-none"
            />
          </label>
          {workoutDate !== todayIso && (
            <button
              type="button"
              onClick={() => onChangeDate(todayIso)}
              className="min-h-[44px] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] font-medium text-[var(--primary)] transition-colors hover:border-[var(--primary)] whitespace-nowrap"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {!workoutDay ? (
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <p className="text-[12px] font-medium text-[var(--primary)]">
            {weekday === 'Sunday' ? 'Recovery' : 'Unscheduled'}
          </p>
          <h2 className="mt-1 font-heading text-[22px] font-semibold text-[var(--text-primary)]">
            {weekday === 'Sunday'
              ? 'Rest Day'
              : `No ${weekday} workout in ${block.label}`}
          </h2>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {weekday === 'Sunday'
              ? 'No prescribed exercises today. Take time to recover, or pick another day below to preview or log a session.'
              : 'This partial programme block runs Tuesday through Saturday. Choose another training day below or switch blocks above.'}
          </p>

          {onSelectWeekday && block.days.length > 0 && (
            <div className="mt-6 space-y-2.5">
              <p className="text-[13px] font-medium text-[var(--text-secondary)]">
                Jump to a training day
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {block.days.map((d) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => onSelectWeekday(d.day)}
                    className="flex min-h-[48px] items-center justify-between gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-left transition-colors hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                  >
                    <span className="font-heading text-[15px] font-semibold text-[var(--text-primary)]">
                      {d.day}
                    </span>
                    <span className="text-[13px] text-[var(--text-secondary)]">
                      {formatCategoryLabel(d.category)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <CompletionProgress
            completedExercises={completedCount}
            totalExercises={totalExercises}
            cardioCompleted={cardioCompleted}
            hasCardio={Boolean(workoutDay.cardio)}
          />

          {isAllDone && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-[18px] border border-[var(--success)]/40 bg-[var(--success-tint)] p-4 text-[var(--text-primary)]"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--success)]" />
              <div>
                <p className="font-heading text-[16px] font-semibold">
                  Workout completed
                </p>
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Saved to your history for {formatReadableDate(workoutDate)}.
                </p>
              </div>
            </div>
          )}

          {workoutDay.notes.length > 0 && (
            <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <div className="space-y-1">
                  <p className="text-[12px] font-medium text-[var(--text-secondary)]">
                    Trainer instructions
                  </p>
                  {workoutDay.notes.map((note, idx) => (
                    <p
                      key={idx}
                      className="text-[14px] font-medium text-[var(--text-primary)]"
                    >
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <h2 className="font-heading text-[20px] font-semibold text-[var(--text-primary)]">
              Cardio
            </h2>
            <CardioChecklistItem
              cardio={workoutDay.cardio}
              completed={cardioCompleted}
              onToggle={onToggleCardio}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-heading text-[20px] font-semibold text-[var(--text-primary)]">
                Exercises
              </h2>
              <span className="text-[13px] text-[var(--text-secondary)] tabular-nums">
                {totalExercises}{' '}
                {totalExercises === 1 ? 'movement' : 'movements'}
              </span>
            </div>

            <div className="space-y-2.5">
              {workoutDay.exercises.map((exercise) => {
                const noteEntry = savedNotesMap[slugify(exercise.name)];
                const hasNote = Boolean(
                  noteEntry &&
                    (noteEntry.startingPosition.trim() ||
                      noteEntry.personalNotes.trim())
                );
                return (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    completed={completedIds.has(exercise.id)}
                    hasNote={hasNote}
                    onToggleComplete={() => onToggleExercise(exercise.id)}
                    onOpenGuide={() => onOpenGuide(exercise)}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
};
