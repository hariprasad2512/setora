import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {
  getExerciseAnimationSpec,
  getRepPhaseLabel,
  interpolatePose,
  type EquipmentProp,
  type ExerciseAnimationSpec,
  type MuscleTarget,
  type Point,
  type PoseState,
  type StageProp,
} from '../data/exerciseAnimations';

interface ExerciseDiagramProps {
  exerciseName: string;
  variant?: 'thumbnail' | 'guide';
  className?: string;
}

function mid(a: Point, b: Point): Point {
  return {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2};
}

function renderStage(stage: StageProp, pose: PoseState) {
  switch (stage) {
    case 'mat':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="38" y="152" width="164" height="5" rx="2.5" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />
        </g>
      );

    case 'bench_flat':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="60" y="109" width="80" height="7" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="72" y1="116" x2="72" y2="156" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
          <line x1="128" y1="116" x2="128" y2="156" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'bench_upright':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="96" y="110" width="46" height="7" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="94" y="56" width="7" height="56" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="118" y1="117" x2="118" y2="156" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'bench_rear':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="50" y="118" width="40" height="7" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="58" y1="125" x2="58" y2="156" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
          <line x1="82" y1="125" x2="82" y2="156" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'box':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="122" y="118" width="50" height="39" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="122" y1="125" x2="172" y2="125" stroke="var(--border)" strokeWidth="1" />
        </g>
      );

    case 'cable_right': {
      const anchorY = pose.wristR.y < 70 ? 52 : 84;
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="190" y="24" width="8" height="133" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <circle cx="190" cy={anchorY} r="4" fill="var(--surface-elevated)" stroke="var(--primary)" strokeWidth="1.5" />
          <line x1="188" y1={anchorY} x2={pose.wristR.x} y2={pose.wristR.y} stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      );
    }

    case 'cable_left':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="42" y="24" width="8" height="133" rx="2" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="50" y1="70" x2={pose.wristL.x} y2={pose.wristL.y} stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      );

    case 'smith':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="94" y1="20" x2="94" y2="156" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="126" y1="20" x2="126" y2="156" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="90" y1="22" x2="130" y2="22" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'landmine':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="58" cy="154" r="4" fill="var(--border)" />
          <line x1="58" y1="154" x2={pose.wristR.x + 4} y2={pose.wristR.y - 4} stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
          <rect x={pose.wristR.x - 1} y={pose.wristR.y - 10} width="8" height="12" rx="2" fill="var(--primary)" />
        </g>
      );

    case 'wall':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="120" y1="14" x2="120" y2="156" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" />
        </g>
      );

    case 'machine_fly':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="98" y="34" width="44" height="80" rx="6" fill="none" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="98" y1="48" x2={pose.wristL.x} y2={pose.wristL.y} stroke="var(--primary)" strokeWidth="2" />
          <line x1="142" y1="48" x2={pose.wristR.x} y2={pose.wristR.y} stroke="var(--primary)" strokeWidth="2" />
        </g>
      );

    case 'machine_leg_ext':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="74" y="64" width="8" height="48" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <rect x="82" y="108" width="54" height="7" rx="3" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
          <line x1="98" y1="115" x2={pose.ankleR.x} y2={pose.ankleR.y} stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={pose.ankleR.x + 2} cy={pose.ankleR.y} r="4.5" fill="var(--primary)" />
        </g>
      );

    case 'machine_leg_press':
      return (
        <g>
          <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="56" y1="98" x2="96" y2="142" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
          <line x1="118" y1="138" x2="186" y2="68" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
          <line
            x1={pose.ankleR.x - 6}
            y1={pose.ankleR.y - 10}
            x2={pose.ankleR.x + 8}
            y2={pose.ankleR.y + 8}
            stroke="var(--primary)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      );

    case 'floor':
    default:
      return (
        <line x1="20" y1="157" x2="220" y2="157" stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round" />
      );
  }
}

function renderMuscleHighlight(pose: PoseState, target: MuscleTarget) {
  const stroke = 'var(--primary)';
  switch (target) {
    case 'biceps':
      return (
        <g opacity="0.85">
          <line x1={pose.shoulderR.x} y1={pose.shoulderR.y} x2={pose.elbowR.x} y2={pose.elbowR.y} stroke={stroke} strokeWidth="6.5" strokeLinecap="round" />
        </g>
      );
    case 'triceps':
      return (
        <g opacity="0.85">
          <line x1={pose.shoulderR.x} y1={pose.shoulderR.y} x2={pose.elbowR.x} y2={pose.elbowR.y} stroke={stroke} strokeWidth="6.5" strokeLinecap="round" />
        </g>
      );
    case 'shoulders':
      return (
        <g opacity="0.9">
          <circle cx={pose.shoulderL.x} cy={pose.shoulderL.y} r="5.5" fill={stroke} />
          <circle cx={pose.shoulderR.x} cy={pose.shoulderR.y} r="5.5" fill={stroke} />
        </g>
      );
    case 'chest': {
      const chestMid = mid(pose.shoulderL, pose.shoulderR);
      return (
        <g opacity="0.85">
          <circle cx={chestMid.x} cy={chestMid.y + 6} r="6.5" fill={stroke} />
        </g>
      );
    }
    case 'back': {
      const upperMid = mid(pose.shoulderL, pose.shoulderR);
      const lowerMid = mid(pose.hipL, pose.hipR);
      const spineMid = mid(upperMid, lowerMid);
      return (
        <line x1={upperMid.x} y1={upperMid.y + 3} x2={spineMid.x} y2={spineMid.y + 2} stroke={stroke} strokeWidth="7" strokeLinecap="round" opacity="0.85" />
      );
    }
    case 'quads':
      return (
        <line x1={pose.hipR.x} y1={pose.hipR.y} x2={pose.kneeR.x} y2={pose.kneeR.y} stroke={stroke} strokeWidth="7.5" strokeLinecap="round" opacity="0.85" />
      );
    case 'glutes_hamstrings': {
      const hipC = mid(pose.hipL, pose.hipR);
      return (
        <g opacity="0.85">
          <circle cx={hipC.x} cy={hipC.y} r="6.5" fill={stroke} />
          <line x1={pose.hipR.x} y1={pose.hipR.y} x2={pose.kneeR.x} y2={pose.kneeR.y} stroke={stroke} strokeWidth="6.5" strokeLinecap="round" />
        </g>
      );
    }
    case 'calves':
      return (
        <line x1={pose.kneeR.x} y1={pose.kneeR.y} x2={pose.ankleR.x} y2={pose.ankleR.y} stroke={stroke} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      );
    case 'core': {
      const chest = mid(pose.shoulderL, pose.shoulderR);
      const pelvis = mid(pose.hipL, pose.hipR);
      const absMid = mid(chest, pelvis);
      return (
        <line x1={absMid.x} y1={absMid.y - 4} x2={pelvis.x} y2={pelvis.y - 2} stroke={stroke} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
      );
    }
    case 'full_body':
    default: {
      const chest = mid(pose.shoulderL, pose.shoulderR);
      const pelvis = mid(pose.hipL, pose.hipR);
      return (
        <line x1={chest.x} y1={chest.y + 4} x2={pelvis.x} y2={pelvis.y - 2} stroke={stroke} strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      );
    }
  }
}

function renderEquipment(pose: PoseState, equipment: EquipmentProp) {
  switch (equipment) {
    case 'dumbbell_supinated_dual':
      return (
        <g>
          {/* Horizontal supinated bars */}
          {[pose.wristL, pose.wristR].map((w, i) => (
            <g key={i}>
              <line x1={w.x - 7} y1={w.y} x2={w.x + 7} y2={w.y} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
              <rect x={w.x - 9} y={w.y - 4.5} width="3.5" height="9" rx="1.2" fill="var(--primary)" />
              <rect x={w.x + 5.5} y={w.y - 4.5} width="3.5" height="9" rx="1.2" fill="var(--primary)" />
            </g>
          ))}
        </g>
      );

    case 'dumbbell_hammer_dual':
    case 'dumbbell_hammer_alt':
      return (
        <g>
          {/* Vertical neutral hammer grip dumbbells */}
          {[pose.wristL, pose.wristR].map((w, i) => (
            <g key={i}>
              <line x1={w.x} y1={w.y - 7} x2={w.x} y2={w.y + 7} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
              <rect x={w.x - 4.5} y={w.y - 9} width="9" height="3.5" rx="1.2" fill="var(--primary)" />
              <rect x={w.x - 4.5} y={w.y + 5.5} width="9" height="3.5" rx="1.2" fill="var(--primary)" />
            </g>
          ))}
        </g>
      );

    case 'dumbbell_single_right':
      return (
        <g>
          <line x1={pose.wristR.x} y1={pose.wristR.y - 7} x2={pose.wristR.x} y2={pose.wristR.y + 7} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
          <rect x={pose.wristR.x - 4.5} y={pose.wristR.y - 9} width="9" height="3.5" rx="1.2" fill="var(--primary)" />
          <rect x={pose.wristR.x - 4.5} y={pose.wristR.y + 5.5} width="9" height="3.5" rx="1.2" fill="var(--primary)" />
        </g>
      );

    case 'dumbbell_overhead_both': {
      const c = mid(pose.wristL, pose.wristR);
      return (
        <g>
          <line x1={c.x} y1={c.y - 8} x2={c.x} y2={c.y + 8} stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
          <rect x={c.x - 5} y={c.y - 10} width="10" height="4" rx="1.5" fill="var(--primary)" />
          <rect x={c.x - 5} y={c.y + 6} width="10" height="4" rx="1.5" fill="var(--primary)" />
        </g>
      );
    }

    case 'barbell_hands': {
      const dx = pose.wristR.x - pose.wristL.x;
      const dy = pose.wristR.y - pose.wristL.y;
      const isSideView = Math.hypot(dx, dy) < 18;
      if (isSideView) {
        const c = mid(pose.wristL, pose.wristR);
        return (
          <g>
            <circle cx={c.x} cy={c.y} r="9" fill="none" stroke="var(--primary)" strokeWidth="3" />
            <circle cx={c.x} cy={c.y} r="3" fill="var(--primary)" />
          </g>
        );
      }
      return (
        <g>
          <line
            x1={pose.wristL.x - 16}
            y1={pose.wristL.y}
            x2={pose.wristR.x + 16}
            y2={pose.wristR.y}
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x={pose.wristL.x - 18} y={pose.wristL.y - 7} width="5" height="14" rx="1.5" fill="var(--primary)" />
          <rect x={pose.wristR.x + 13} y={pose.wristR.y - 7} width="5" height="14" rx="1.5" fill="var(--primary)" />
        </g>
      );
    }

    case 'barbell_back': {
      const neckBar = mid(pose.shoulderL, pose.shoulderR);
      return (
        <g>
          <circle cx={neckBar.x - 3} cy={neckBar.y - 3} r="8" fill="none" stroke="var(--primary)" strokeWidth="3" />
          <circle cx={neckBar.x - 3} cy={neckBar.y - 3} r="2.5" fill="var(--primary)" />
        </g>
      );
    }

    case 'kettlebell_hands': {
      const c = mid(pose.wristL, pose.wristR);
      return (
        <g>
          <path d={`M ${c.x - 4} ${c.y} A 4 4 0 0 1 ${c.x + 4} ${c.y}`} stroke="var(--primary)" strokeWidth="2.5" fill="none" />
          <circle cx={c.x} cy={c.y + 7} r="6.5" fill="var(--primary)" />
        </g>
      );
    }

    case 'kettlebell_right': {
      const w = pose.wristR;
      return (
        <g>
          <path d={`M ${w.x - 3.5} ${w.y} A 3.5 3.5 0 0 1 ${w.x + 3.5} ${w.y}`} stroke="var(--primary)" strokeWidth="2.5" fill="none" />
          <circle cx={w.x} cy={w.y + 6.5} r="6" fill="var(--primary)" />
        </g>
      );
    }

    case 'plate_hands': {
      const c = mid(pose.wristL, pose.wristR);
      return (
        <g>
          <ellipse cx={c.x + 3} cy={c.y} rx="3.5" ry="10" fill="var(--primary)" />
        </g>
      );
    }

    case 'water_bottles':
      return (
        <g>
          {[pose.wristL, pose.wristR].map((w, i) => (
            <rect key={i} x={w.x - 3} y={w.y - 6} width="6" height="11" rx="2" fill="var(--primary)" />
          ))}
        </g>
      );

    case 'cable_handle_both':
    case 'cable_handle_right':
      return <circle cx={pose.wristR.x} cy={pose.wristR.y} r="3.5" fill="var(--primary)" />;

    case 'none':
    default:
      return null;
  }
}

function renderAnatomicalFigure(pose: PoseState, spec: ExerciseAnimationSpec) {
  const shoulderMid = mid(pose.shoulderL, pose.shoulderR);
  const hipMid = mid(pose.hipL, pose.hipR);

  return (
    <g>
      {/* Back/Left limbs (subdued for clean 3D depth) */}
      <g opacity="0.52">
        <line x1={pose.hipL.x} y1={pose.hipL.y} x2={pose.kneeL.x} y2={pose.kneeL.y} stroke="var(--text-secondary)" strokeWidth="7.5" strokeLinecap="round" />
        <line x1={pose.kneeL.x} y1={pose.kneeL.y} x2={pose.ankleL.x} y2={pose.ankleL.y} stroke="var(--text-secondary)" strokeWidth="6" strokeLinecap="round" />
        <line x1={pose.shoulderL.x} y1={pose.shoulderL.y} x2={pose.elbowL.x} y2={pose.elbowL.y} stroke="var(--text-secondary)" strokeWidth="5.5" strokeLinecap="round" />
        <line x1={pose.elbowL.x} y1={pose.elbowL.y} x2={pose.wristL.x} y2={pose.wristL.y} stroke="var(--text-secondary)" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* Torso mass */}
      <line
        x1={shoulderMid.x}
        y1={shoulderMid.y}
        x2={hipMid.x}
        y2={hipMid.y}
        stroke="var(--text-primary)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.92"
      />
      <polygon
        points={`${pose.shoulderL.x},${pose.shoulderL.y} ${pose.shoulderR.x},${pose.shoulderR.y} ${pose.hipR.x},${pose.hipR.y} ${pose.hipL.x},${pose.hipL.y}`}
        fill="var(--text-primary)"
        stroke="var(--text-primary)"
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.92"
      />

      {/* Neck & Head */}
      <line x1={pose.neck.x} y1={pose.neck.y} x2={pose.head.x} y2={pose.head.y} stroke="var(--text-primary)" strokeWidth="5" strokeLinecap="round" />
      <circle cx={pose.head.x} cy={pose.head.y} r="9" fill="var(--text-primary)" />

      {/* Front/Right leg */}
      <line x1={pose.hipR.x} y1={pose.hipR.y} x2={pose.kneeR.x} y2={pose.kneeR.y} stroke="var(--text-primary)" strokeWidth="8" strokeLinecap="round" />
      <line x1={pose.kneeR.x} y1={pose.kneeR.y} x2={pose.ankleR.x} y2={pose.ankleR.y} stroke="var(--text-primary)" strokeWidth="6.5" strokeLinecap="round" />
      <circle cx={pose.ankleR.x} cy={pose.ankleR.y} r="3" fill="var(--text-primary)" />

      {/* Front/Right arm */}
      <line x1={pose.shoulderR.x} y1={pose.shoulderR.y} x2={pose.elbowR.x} y2={pose.elbowR.y} stroke="var(--text-primary)" strokeWidth="6" strokeLinecap="round" />
      <line x1={pose.elbowR.x} y1={pose.elbowR.y} x2={pose.wristR.x} y2={pose.wristR.y} stroke="var(--text-primary)" strokeWidth="5" strokeLinecap="round" />

      {/* Target muscle highlight */}
      {renderMuscleHighlight(pose, spec.muscleTarget)}

      {/* Subtle joint accents */}
      <circle cx={pose.shoulderR.x} cy={pose.shoulderR.y} r="2.5" fill="var(--background)" />
      <circle cx={pose.elbowR.x} cy={pose.elbowR.y} r="2" fill="var(--background)" />
      <circle cx={pose.kneeR.x} cy={pose.kneeR.y} r="2.2" fill="var(--background)" />

      {/* Equipment & Grip */}
      {renderEquipment(pose, spec.equipment)}
    </g>
  );
}

export const ExerciseDiagram: React.FC<ExerciseDiagramProps> = ({
  exerciseName,
  variant = 'thumbnail',
  className = '',
}) => {
  const spec = useMemo(
    () => getExerciseAnimationSpec(exerciseName),
    [exerciseName]
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.5 | 1>(1);
  const [t, setT] = useState<number>(spec.thumbnailT);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    if (mq.matches) setIsPlaying(false);
    const onChange = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setT(variant === 'thumbnail' ? spec.thumbnailT : 0);
    lastTimeRef.current = null;
  }, [spec.id, spec.thumbnailT, variant]);

  useEffect(() => {
    if (variant !== 'guide' || !isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let rafId = 0;
    const step = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const deltaMs = Math.min(now - lastTimeRef.current, 100);
      lastTimeRef.current = now;
      const effectiveDuration = spec.durationMs / speed;
      setT((prev) => (prev + deltaMs / effectiveDuration) % 1);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [variant, isPlaying, speed, spec.durationMs]);

  const activeT = variant === 'thumbnail' ? spec.thumbnailT : t;
  const pose = interpolatePose(spec.keyframes, activeT);

  if (variant === 'thumbnail') {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-[12px] border border-[var(--border)] bg-[var(--surface-elevated)] ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 240 180"
          className="h-full w-full"
          role="img"
          aria-label={spec.label}
        >
          {renderStage(spec.stage, pose)}
          {renderAnatomicalFigure(pose, spec)}
        </svg>
      </div>
    );
  }

  const phaseLabel = getRepPhaseLabel(spec, activeT);

  return (
    <div
      className={`overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface-elevated)] ${className}`}
    >
      <div className="relative aspect-[4/3] w-full">
        <svg
          viewBox="0 0 240 180"
          className="h-full w-full"
          role="img"
          aria-label={`${exerciseName} animated demonstration: ${spec.cueSummary}`}
        >
          {renderStage(spec.stage, pose)}
          {renderAnatomicalFigure(pose, spec)}
        </svg>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 px-2.5 py-1 text-[12px] font-medium text-[var(--text-primary)]">
            {phaseLabel}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSpeed((s) => (s === 1 ? 0.5 : 1))}
              aria-label={`Playback speed ${speed === 1 ? '1x, switch to 0.5x' : '0.5x, switch to 1x'}`}
              className="flex min-h-[36px] min-w-[44px] items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 px-2.5 text-[12px] font-semibold text-[var(--text-primary)] tabular-nums transition-colors hover:border-[var(--primary)]"
            >
              {speed === 1 ? '1×' : '0.5×'}
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
              className="flex min-h-[36px] min-w-[44px] items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface)]/95 px-2.5 text-[var(--primary)] transition-colors hover:border-[var(--primary)]"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">
          {spec.cueSummary}
        </p>
        <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
          Target: {spec.muscleLabel}
          {prefersReducedMotion && !isPlaying ? ' · Paused (reduced motion)' : ''}
        </p>
      </div>
    </div>
  );
};
