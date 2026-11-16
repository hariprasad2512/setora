import type {
  PosturePattern,
  PrescribedExercise,
  RawWorkoutProgram,
  WeekdayName,
  WeekStart,
  WorkoutProgram,
} from '../types/workout';

const MONDAY_FIRST: WeekdayName[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const SUNDAY_FIRST: WeekdayName[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getOrderedWeekdays(weekStart: WeekStart): WeekdayName[] {
  return weekStart === 'sunday' ? SUNDAY_FIRST : MONDAY_FIRST;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function normalizeWorkoutProgram(raw: RawWorkoutProgram): WorkoutProgram {
  return {
    schema_version: raw.schema_version,
    program_id: raw.program_id,
    title: raw.title,
    exercise_categories: raw.exercise_categories,
    blocks: raw.blocks.map((block) => ({
      id: block.id,
      label: block.label,
      sequence: block.sequence,
      status: block.status,
      duplicate_of: block.duplicate_of,
      days: block.days.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex, index) => ({
          id: `${block.id}__${day.day.toLowerCase()}__${index}__${slugify(ex.name)}`,
          name: ex.name,
          sets: ex.sets,
          reps: typeof ex.reps === 'number' ? ex.reps : null,
          duration_seconds:
            typeof ex.duration_seconds === 'number' ? ex.duration_seconds : null,
          prescribed_weight_kg:
            typeof ex.prescribed_weight_kg === 'number'
              ? ex.prescribed_weight_kg
              : null,
          weight_note: ex.weight_note ?? null,
          per_side: Boolean(ex.per_side),
        })),
      })),
    })),
  };
}

export function formatCategoryLabel(category: string): string {
  switch (category) {
    case 'arms':
      return 'Arms';
    case 'lower_body':
      return 'Lower Body';
    case 'shoulders':
      return 'Shoulders';
    case 'core':
      return 'Core';
    case 'chest':
      return 'Chest';
    case 'legs':
      return 'Legs';
    case 'upper_body':
      return 'Upper Body';
    case 'full_body_circuit':
      return 'Full Body Circuit';
    case 'core_stability':
      return 'Core Stability';
    default:
      return category
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
  }
}

export function formatCardioActivity(activity: string): string {
  if (!activity) return 'Cardio';
  return activity.charAt(0).toUpperCase() + activity.slice(1).toLowerCase();
}

export function formatExerciseVolume(ex: PrescribedExercise): string {
  const base =
    ex.duration_seconds !== null
      ? `${ex.sets} sets × ${ex.duration_seconds} sec`
      : ex.reps !== null
        ? `${ex.sets} sets × ${ex.reps} reps`
        : `${ex.sets} sets`;

  return ex.per_side ? `${base} · per side` : base;
}

export interface FormattedWeight {
  label: string;
  isSuggestion: boolean;
}

export function formatPrescribedWeight(ex: PrescribedExercise): FormattedWeight | null {
  const hasNumeric = ex.prescribed_weight_kg !== null;
  const hasNote = Boolean(ex.weight_note);

  if (hasNumeric && hasNote) {
    return {
      label: `${ex.prescribed_weight_kg} kg (${ex.weight_note})`,
      isSuggestion: false,
    };
  }

  if (hasNumeric) {
    return {
      label: `${ex.prescribed_weight_kg} kg`,
      isSuggestion: false,
    };
  }

  if (hasNote && ex.weight_note) {
    const isSuggestion =
      ex.weight_note.toLowerCase().startsWith('try') ||
      ex.weight_note.toLowerCase().includes('add');
    return {
      label: ex.weight_note,
      isSuggestion,
    };
  }

  return null;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekdayFromDate(date: Date): WeekdayName {
  const names: WeekdayName[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return names[date.getDay()];
}

export function getWeekdayFromIsoDate(isoDate: string): WeekdayName {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return getWeekdayFromDate(new Date());
  return getWeekdayFromDate(new Date(y, m - 1, d));
}

export function getDateForWeekdayInWeek(
  weekday: WeekdayName,
  weekStart: WeekStart,
  referenceIsoDate?: string
): string {
  const ref = referenceIsoDate
    ? (() => {
        const [y, m, d] = referenceIsoDate.split('-').map(Number);
        return new Date(y, m - 1, d);
      })()
    : new Date();

  const ordered = getOrderedWeekdays(weekStart);
  const currentWeekday = getWeekdayFromDate(ref);
  const currentIdx = ordered.indexOf(currentWeekday);
  const targetIdx = ordered.indexOf(weekday);
  const diff = targetIdx - currentIdx;

  const target = new Date(ref);
  target.setDate(ref.getDate() + diff);

  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatReadableDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function buildCompletionRecordId(
  workoutDate: string,
  blockId: string,
  day: WeekdayName
): string {
  return `${workoutDate}__${blockId}__${day.toLowerCase()}`;
}

export function classifyPosturePattern(exerciseName: string): PosturePattern {
  const n = exerciseName.toLowerCase();

  if (n.includes('lunge')) return 'lunge';
  if (
    n.includes('deadlift') ||
    n.includes('good morning') ||
    n.includes('kettlebell swing')
  ) {
    return 'hinge';
  }
  if (
    n.includes('hip thrust') ||
    n.includes('bridge') ||
    n.includes('clamshell') ||
    n.includes('fire hydrant') ||
    n.includes('side leg raise')
  ) {
    return 'hip_bridge';
  }
  if (
    n.includes('squat') ||
    n.includes('leg press') ||
    n.includes('leg extension') ||
    n.includes('step-up') ||
    n.includes('duck walk')
  ) {
    return 'squat';
  }
  if (
    n.includes('bicep') ||
    n.includes('hammer curl') ||
    n.includes('cross curl')
  ) {
    return 'arm_curl';
  }
  if (n.includes('tricep')) {
    return 'arm_tricep';
  }
  if (
    n.includes('bench press') ||
    n.includes('squeeze press') ||
    n.includes('plate press') ||
    n.includes('push-up') ||
    n.includes('machine fly') ||
    n.includes('crossover') ||
    n.includes('pullover')
  ) {
    return 'press_horizontal';
  }
  if (
    n.includes('overhead press') ||
    n.includes('shoulder press') ||
    n.includes('arnold press') ||
    n.includes('front raise') ||
    n.includes('arm circles') ||
    n.includes('wall arm slides')
  ) {
    return 'press_vertical';
  }
  if (
    n.includes('row') ||
    n.includes('face pull') ||
    n.includes('reverse fly') ||
    n.includes('rear delt') ||
    n.includes('pulldown') ||
    n.includes('shrug') ||
    n.includes('snatch')
  ) {
    return 'pull_row';
  }
  if (
    n.includes('jumping jack') ||
    n.includes('high knees') ||
    n.includes('burpee') ||
    n.includes('speed run') ||
    n.includes('calf raise') ||
    n.includes('running') ||
    n.includes('walking') ||
    n.includes('cycling')
  ) {
    return 'cardio_plyo';
  }

  return 'core_floor';
}

export function getPosturePatternLabel(pattern: PosturePattern): string {
  switch (pattern) {
    case 'squat':
      return 'Lower-body knee & hip flexion';
    case 'hinge':
      return 'Posterior hip-hinge alignment';
    case 'lunge':
      return 'Split-stance single-leg stability';
    case 'hip_bridge':
      return 'Glute & pelvic bridge control';
    case 'press_vertical':
      return 'Overhead & scapular elevation';
    case 'press_horizontal':
      return 'Horizontal chest & press path';
    case 'pull_row':
      return 'Upper-back retraction & pull';
    case 'arm_curl':
      return 'Elbow flexion isolation';
    case 'arm_tricep':
      return 'Elbow extension isolation';
    case 'cardio_plyo':
      return 'Rhythmic conditioning & cadence';
    case 'core_floor':
      return 'Trunk bracing & floor stability';
  }
}
