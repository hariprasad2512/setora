export type WeekdayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type WeekStart = 'monday' | 'sunday';

export type ThemePreference = 'dark' | 'light' | 'system';

export type NavTab = 'today' | 'history' | 'settings';

export type ExerciseCategory =
  | 'arms'
  | 'lower_body'
  | 'shoulders'
  | 'core'
  | 'chest'
  | 'legs'
  | 'upper_body'
  | 'full_body_circuit'
  | 'core_stability';

export interface CardioPrescription {
  activity: string;
  duration_minutes: number;
}

export interface RawPrescribedExercise {
  name: string;
  sets: number;
  reps?: number;
  duration_seconds?: number;
  prescribed_weight_kg?: number | null;
  weight_note?: string;
  per_side?: boolean;
}

export interface PrescribedExercise {
  id: string;
  name: string;
  sets: number;
  reps: number | null;
  duration_seconds: number | null;
  prescribed_weight_kg: number | null;
  weight_note: string | null;
  per_side: boolean;
}

export interface RawWorkoutDay {
  day: WeekdayName;
  category: ExerciseCategory | string;
  cardio: CardioPrescription;
  exercises: RawPrescribedExercise[];
  notes: string[];
}

export interface WorkoutDay {
  day: WeekdayName;
  category: ExerciseCategory | string;
  cardio: CardioPrescription;
  exercises: PrescribedExercise[];
  notes: string[];
}

export interface RawWorkoutBlock {
  id: string;
  label: string;
  sequence: number;
  status: 'partial_week' | 'complete_week' | string;
  duplicate_of?: string;
  source_note: string;
  days: RawWorkoutDay[];
}

export interface WorkoutBlock {
  id: string;
  label: string;
  sequence: number;
  status: 'partial_week' | 'complete_week' | string;
  duplicate_of?: string;
  days: WorkoutDay[];
}

export interface RawWorkoutProgram {
  schema_version: string;
  program_id: string;
  title: string;
  exercise_categories: string[];
  blocks: RawWorkoutBlock[];
}

export interface WorkoutProgram {
  schema_version: string;
  program_id: string;
  title: string;
  exercise_categories: string[];
  blocks: WorkoutBlock[];
}

export type CompletionStatus = 'in_progress' | 'completed';

export interface CompletionRecord {
  id: string;
  workout_date: string; // YYYY-MM-DD
  programme_id: string;
  programme_block_id: string;
  programme_block_label: string;
  workout_day: WeekdayName;
  category: string;
  cardio_completed: boolean;
  completed_exercise_ids: string[];
  total_exercises: number;
  completion_status: CompletionStatus;
  updated_at: string;
}

export interface ExercisePersonalNote {
  exerciseKey: string;
  startingPosition: string;
  personalNotes: string;
  customVideoUrl?: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: ThemePreference;
  activeBlockId: string;
  weekStart: WeekStart;
}

export type PosturePattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'hip_bridge'
  | 'press_vertical'
  | 'press_horizontal'
  | 'pull_row'
  | 'arm_curl'
  | 'arm_tricep'
  | 'core_floor'
  | 'cardio_plyo';
