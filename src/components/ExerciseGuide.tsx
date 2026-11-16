import React, {useEffect, useMemo, useState} from 'react';
import {ExternalLink, Film, PlayCircle, X} from 'lucide-react';
import type {PrescribedExercise} from '../types/workout';
import {
  formatExerciseVolume,
  formatPrescribedWeight,
} from '../utils/workoutFormatters';
import {parseCustomVideoUrl} from '../utils/videoHelpers';
import {exerciseNotesStorage} from '../services/storage';
import {ExerciseDiagram} from './ExerciseDiagram';

interface ExerciseGuideProps {
  exercise: PrescribedExercise | null;
  onClose: () => void;
}

export const ExerciseGuide: React.FC<ExerciseGuideProps> = ({
  exercise,
  onClose,
}) => {
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [mediaTab, setMediaTab] = useState<'animation' | 'video'>('animation');

  useEffect(() => {
    if (!exercise) return;
    const saved = exerciseNotesStorage.get(exercise.name);
    setCustomVideoUrl(saved.customVideoUrl ?? '');
    setMediaTab('animation');
  }, [exercise]);

  useEffect(() => {
    if (!exercise) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exercise, onClose]);

  const parsedVideo = useMemo(
    () => parseCustomVideoUrl(customVideoUrl),
    [customVideoUrl]
  );

  useEffect(() => {
    if (!parsedVideo && mediaTab === 'video') {
      setMediaTab('animation');
    }
  }, [parsedVideo, mediaTab]);

  if (!exercise) return null;

  const volumeText = formatExerciseVolume(exercise);
  const weight = formatPrescribedWeight(exercise);

  const handleVideoUrlChange = (nextUrl: string) => {
    setCustomVideoUrl(nextUrl);
    exerciseNotesStorage.saveVideoUrl(exercise.name, nextUrl);
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

        {parsedVideo && (
          <div
            role="tablist"
            aria-label="Demonstration media mode"
            className="mt-4 grid grid-cols-2 gap-1.5 rounded-[12px] border border-[var(--border)] bg-[var(--background)] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mediaTab === 'animation'}
              onClick={() => setMediaTab('animation')}
              className={`flex min-h-[40px] items-center justify-center gap-2 rounded-[9px] text-[13px] font-medium transition-colors ${
                mediaTab === 'animation'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <PlayCircle className="h-4 w-4 shrink-0" />
              <span>Animation</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mediaTab === 'video'}
              onClick={() => setMediaTab('video')}
              className={`flex min-h-[40px] items-center justify-center gap-2 rounded-[9px] text-[13px] font-medium transition-colors ${
                mediaTab === 'video'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Film className="h-4 w-4 shrink-0" />
              <span>Custom Video</span>
            </button>
          </div>
        )}

        <div className="mt-4">
          {mediaTab === 'video' && parsedVideo ? (
            <div className="overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)]">
              {parsedVideo.kind === 'youtube' && (
                <div className="aspect-video w-full">
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={`${exercise.name} video demonstration`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {parsedVideo.kind === 'direct' && (
                <video
                  src={parsedVideo.srcUrl}
                  controls
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="aspect-video w-full bg-black object-contain"
                />
              )}

              {parsedVideo.kind === 'external' && (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-[14px] text-[var(--text-secondary)]">
                    This link cannot be embedded directly inside the player.
                  </p>
                  <a
                    href={parsedVideo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[var(--primary)] px-4 py-2 text-[14px] font-semibold text-[var(--on-primary)] hover:bg-[var(--primary-hover)]"
                  >
                    <span>Open Video Link</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <ExerciseDiagram exerciseName={exercise.name} variant="guide" />
          )}
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

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="custom-video-url-input"
              className="block text-[13px] font-medium text-[var(--text-primary)]"
            >
              Custom video link (optional)
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                id="custom-video-url-input"
                type="url"
                value={customVideoUrl}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Paste a YouTube or direct .mp4 / .webm link..."
                className="min-h-[44px] w-full rounded-[12px] border border-[var(--border)] bg-[var(--background)] px-3.5 py-2 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] focus:outline-none"
              />
              {customVideoUrl.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => handleVideoUrlChange('')}
                  aria-label="Clear custom video link"
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--background)] text-[var(--text-secondary)] transition-colors hover:border-[var(--primary)] hover:text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-3 text-[15px] font-medium text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--primary)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
