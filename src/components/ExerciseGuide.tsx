import React, {useEffect, useState} from 'react';
import {Check, X} from 'lucide-react';
import type {PrescribedExercise} from '../types/workout';
import {
  formatExerciseVolume,
  formatPrescribedWeight,
} from '../utils/workoutFormatters';
import {exerciseNotesStorage} from '../services/storage';
import {ExerciseDiagram} from './ExerciseDiagram';

interface ExerciseGuideProps {
  exercise: PrescribedExercise | null;
  onClose: () => void;
  onNoteSaved?: () => void;
}

export const ExerciseGuide: React.FC<ExerciseGuideProps> = ({
  exercise,
  onClose,
  onNoteSaved,
}) => {
  const [startingPosition, setStartingPosition] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (!exercise) return;
    const saved = exerciseNotesStorage.get(exercise.name);
    setStartingPosition(saved.startingPosition);
    setPersonalNotes(saved.personalNotes);
    setSavedFeedback(false);
  }, [exercise]);

  useEffect(() => {
    if (!exercise) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exercise, onClose]);

  if (!exercise) return null;

  const volumeText = formatExerciseVolume(exercise);
  const weight = formatPrescribedWeight(exercise);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    exerciseNotesStorage.save(exercise.name, startingPosition, personalNotes);
    setSavedFeedback(true);
    onNoteSaved?.();
    window.setTimeout(() => setSavedFeedback(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-guide-title"
    >
      <div
        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-t-[24px] sm:rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--border)] sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-medium text-[var(--primary)]">
              Exercise Guide
            </p>
            <h2
              id="exercise-guide-title"
              className="mt-1 font-heading text-[22px] sm:text-[24px] font-bold leading-tight text-[var(--text-primary)]"
            >
              {exercise.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close exercise guide"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[12px] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <ExerciseDiagram exerciseName={exercise.name} variant="guide" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--background)] p-4">
          <div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Prescribed Volume
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[var(--text-primary)] tabular-nums">
              {volumeText}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Prescribed Weight
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[var(--text-primary)] tabular-nums">
              {weight ? weight.label : 'Not specified by trainer'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveNotes} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="starting-position-input"
              className="block text-[13px] font-medium text-[var(--text-primary)]"
            >
              Starting position cues
            </label>
            <textarea
              id="starting-position-input"
              rows={2}
              value={startingPosition}
              onChange={(e) => {
                setStartingPosition(e.target.value);
                setSavedFeedback(false);
              }}
              placeholder="Add your trainer's setup cues (stance, grip, bench height)..."
              className="mt-1.5 w-full resize-none rounded-[12px] border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="personal-notes-input"
              className="block text-[13px] font-medium text-[var(--text-primary)]"
            >
              Personal form &amp; weight notes
            </label>
            <textarea
              id="personal-notes-input"
              rows={3}
              value={personalNotes}
              onChange={(e) => {
                setPersonalNotes(e.target.value);
                setSavedFeedback(false);
              }}
              placeholder="Record personal execution cues, common mistakes to avoid, or actual weight adjustments..."
              className="mt-1.5 w-full resize-none rounded-[12px] border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[14px] bg-[var(--primary)] px-5 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors duration-150 hover:bg-[var(--primary-hover)]"
            >
              {savedFeedback ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  <span>Notes Saved</span>
                </>
              ) : (
                <span>Save Form Notes</span>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3 text-[15px] font-medium text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--primary)]"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
