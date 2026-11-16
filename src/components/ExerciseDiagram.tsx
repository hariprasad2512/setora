import React from 'react';
import {
  classifyPosturePattern,
  getPosturePatternLabel,
} from '../utils/workoutFormatters';
import type {PosturePattern} from '../types/workout';

interface ExerciseDiagramProps {
  exerciseName: string;
  variant?: 'thumbnail' | 'guide';
  className?: string;
}

function renderPatternGeometry(pattern: PosturePattern) {
  switch (pattern) {
    case 'squat':
      return (
        <g>
          {/* Floor line */}
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Spine & torso */}
          <circle cx="88" cy="30" r="7" fill="var(--text-primary)" />
          <path d="M84 39 L70 64 L54 74 L58 96" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M70 64 L96 74 L92 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Arms / load line */}
          <path d="M82 43 L98 54" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Movement range arc */}
          <path d="M40 46 L40 76" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
          <path d="M35 71 L40 78 L45 71" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );

    case 'hinge':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Hip-hinge posture */}
          <circle cx="106" cy="38" r="7" fill="var(--text-primary)" />
          <path d="M100 44 L68 58 L72 96" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Arms + bar */}
          <path d="M92 48 L92 84" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="80" y1="86" x2="104" y2="86" stroke="var(--primary)" strokeWidth="4" strokeLinecap="round" />
          {/* Hip hinge indicator */}
          <path d="M54 48 C58 58, 58 66, 52 74" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'lunge':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="26" r="7" fill="var(--text-primary)" />
          {/* Torso */}
          <path d="M80 35 L78 62" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          {/* Lead leg */}
          <path d="M78 62 L106 68 L106 96" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Trail leg */}
          <path d="M78 62 L56 80 L46 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Vertical drop guide */}
          <path d="M122 44 L122 72" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
          <path d="M117 67 L122 74 L127 67" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );

    case 'hip_bridge':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Bench / support */}
          <rect x="26" y="72" width="24" height="24" rx="4" fill="none" stroke="var(--border)" strokeWidth="2" />
          {/* Supine bridge */}
          <circle cx="42" cy="54" r="6.5" fill="var(--text-primary)" />
          <path d="M50 62 L84 62 L108 66 L108 96" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Hip lift arrow */}
          <path d="M84 48 L84 32" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
          <path d="M79 37 L84 30 L89 37" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      );

    case 'press_vertical':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="40" r="7" fill="var(--text-primary)" />
          <path d="M80 49 L80 78" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M80 78 L70 96 M80 78 L90 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          {/* Overhead arms */}
          <path d="M80 54 L62 38 L62 22" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M80 54 L98 38 L98 22" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="52" y1="20" x2="108" y2="20" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );

    case 'press_horizontal':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Bench */}
          <line x1="36" y1="76" x2="110" y2="76" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
          <line x1="48" y1="78" x2="48" y2="96" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
          <line x1="98" y1="78" x2="98" y2="96" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
          {/* Supine body */}
          <circle cx="42" cy="64" r="6.5" fill="var(--text-primary)" />
          <path d="M52 68 L98 68 L114 96" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Press path */}
          <path d="M68 68 L68 36" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="54" y1="34" x2="82" y2="34" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M84 44 L84 26" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
        </g>
      );

    case 'pull_row':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="80" cy="30" r="7" fill="var(--text-primary)" />
          <path d="M80 39 L80 72" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M80 72 L70 96 M80 72 L90 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          {/* Pulling arms */}
          <path d="M80 46 L60 44 L66 56" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M80 46 L100 44 L94 56" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Retraction arrows */}
          <path d="M46 46 L56 46 M114 46 L104 46" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'arm_curl':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="76" cy="28" r="7" fill="var(--text-primary)" />
          <path d="M76 37 L76 72" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M76 72 L68 96 M76 72 L86 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          {/* Fixed upper arm + curling forearm */}
          <path d="M76 44 L76 62 L98 48" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="102" cy="45" r="4" fill="var(--primary)" />
          {/* Curl arc */}
          <path d="M106 64 C112 56, 112 46, 106 38" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'arm_tricep':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="76" cy="34" r="7" fill="var(--text-primary)" />
          <path d="M76 43 L76 74" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M76 74 L68 96 M76 74 L86 96" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          {/* Overhead extension / pushdown */}
          <path d="M76 48 L88 26 L102 36" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M104 24 L104 42" stroke="var(--primary)" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
        </g>
      );

    case 'cardio_plyo':
      return (
        <g>
          <line x1="20" y1="98" x2="140" y2="98" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Dynamic stride */}
          <circle cx="88" cy="28" r="7" fill="var(--text-primary)" />
          <path d="M84 37 L74 64" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M74 64 L96 76 L92 94" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M74 64 L56 76 L46 88" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Cadence rhythm waves */}
          <path d="M32 46 Q40 36 48 46 T64 46" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'core_floor':
    default:
      return (
        <g>
          <line x1="20" y1="94" x2="140" y2="94" stroke="var(--border)" strokeWidth="2" strokeLinecap="round" />
          {/* Plank / V-hold / floor stability silhouette */}
          <circle cx="42" cy="60" r="6.5" fill="var(--text-primary)" />
          <path d="M50 64 L92 68 L122 88" stroke="var(--text-primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M54 66 L52 90" stroke="var(--text-secondary)" strokeWidth="4" strokeLinecap="round" />
          {/* Bracing cue line */}
          <path d="M68 54 L96 56" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="4 3" strokeLinecap="round" />
        </g>
      );
  }
}

export const ExerciseDiagram: React.FC<ExerciseDiagramProps> = ({
  exerciseName,
  variant = 'thumbnail',
  className = '',
}) => {
  const pattern = classifyPosturePattern(exerciseName);
  const patternLabel = getPosturePatternLabel(pattern);

  if (variant === 'thumbnail') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-elevated)] ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 160 120"
          className="h-full w-full"
          role="img"
          aria-label={patternLabel}
        >
          {renderPatternGeometry(pattern)}
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-between overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 ${className}`}
    >
      <div className="w-full max-w-[280px] aspect-[4/3]">
        <svg
          viewBox="0 0 160 120"
          className="h-full w-full"
          role="img"
          aria-label={`${exerciseName} posture diagram: ${patternLabel}`}
        >
          {renderPatternGeometry(pattern)}
        </svg>
      </div>
      <p className="mt-1 text-center text-[13px] text-[var(--text-secondary)]">
        {patternLabel}
      </p>
    </div>
  );
};
