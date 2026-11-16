import type {RawWorkoutProgram, WorkoutProgram} from '../types/workout';
import {normalizeWorkoutProgram} from '../utils/workoutFormatters';

export const PROGRAMME_JSON_PATH =
  '/assets/aistudio/gym_workout_program_393f9047.json';

let cachedProgram: WorkoutProgram | null = null;

export async function loadWorkoutProgram(): Promise<WorkoutProgram> {
  if (cachedProgram) {
    return cachedProgram;
  }

  const response = await fetch(PROGRAMME_JSON_PATH);
  if (!response.ok) {
    throw new Error(
      `Unable to load workout programme (${response.status} ${response.statusText})`
    );
  }

  const raw = (await response.json()) as RawWorkoutProgram;
  cachedProgram = normalizeWorkoutProgram(raw);
  return cachedProgram;
}
