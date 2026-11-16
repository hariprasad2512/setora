import type {
  CompletionRecord,
  ExercisePersonalNote,
  UserPreferences,
  WeekdayName,
} from '../types/workout';
import {buildCompletionRecordId, slugify} from '../utils/workoutFormatters';

const PREFERENCES_KEY = 'setora_preferences';
const COMPLETIONS_KEY = 'setora_completion_records';
const EXERCISE_NOTES_KEY = 'setora_exercise_notes';

export const DEFAULT_ACTIVE_BLOCK_ID = 'block_04';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  activeBlockId: DEFAULT_ACTIVE_BLOCK_ID,
  weekStart: 'monday',
};

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export const preferencesStorage = {
  get(): UserPreferences {
    const stored = safeReadJson<Partial<UserPreferences>>(
      PREFERENCES_KEY,
      DEFAULT_PREFERENCES
    );
    return {
      theme:
        stored.theme === 'dark' ||
        stored.theme === 'light' ||
        stored.theme === 'system'
          ? stored.theme
          : DEFAULT_PREFERENCES.theme,
      activeBlockId:
        typeof stored.activeBlockId === 'string' && stored.activeBlockId.length > 0
          ? stored.activeBlockId
          : DEFAULT_PREFERENCES.activeBlockId,
      weekStart:
        stored.weekStart === 'monday' || stored.weekStart === 'sunday'
          ? stored.weekStart
          : DEFAULT_PREFERENCES.weekStart,
    };
  },

  save(prefs: UserPreferences): void {
    safeWriteJson(PREFERENCES_KEY, prefs);
  },
};

export const completionStorage = {
  getAll(): CompletionRecord[] {
    const records = safeReadJson<CompletionRecord[]>(COMPLETIONS_KEY, []);
    if (!Array.isArray(records)) return [];
    return records
      .filter(
        (r) =>
          r &&
          typeof r.id === 'string' &&
          typeof r.workout_date === 'string' &&
          typeof r.programme_block_id === 'string'
      )
      .sort((a, b) => {
        if (a.workout_date !== b.workout_date) {
          return b.workout_date.localeCompare(a.workout_date);
        }
        return b.updated_at.localeCompare(a.updated_at);
      });
  },

  getRecord(
    workoutDate: string,
    blockId: string,
    day: WeekdayName
  ): CompletionRecord | null {
    const id = buildCompletionRecordId(workoutDate, blockId, day);
    const all = this.getAll();
    return all.find((r) => r.id === id) ?? null;
  },

  getById(id: string): CompletionRecord | null {
    return this.getAll().find((r) => r.id === id) ?? null;
  },

  saveRecord(record: CompletionRecord): CompletionRecord[] {
    const all = this.getAll();
    const next = all.filter((r) => r.id !== record.id);
    const hasProgress =
      record.cardio_completed || record.completed_exercise_ids.length > 0;

    if (hasProgress) {
      next.unshift(record);
    }

    const sorted = next.sort((a, b) => {
      if (a.workout_date !== b.workout_date) {
        return b.workout_date.localeCompare(a.workout_date);
      }
      return b.updated_at.localeCompare(a.updated_at);
    });

    safeWriteJson(COMPLETIONS_KEY, sorted);
    return sorted;
  },

  resetByDate(workoutDate: string): CompletionRecord[] {
    const all = this.getAll();
    const filtered = all.filter((r) => r.workout_date !== workoutDate);
    safeWriteJson(COMPLETIONS_KEY, filtered);
    return filtered;
  },
};

export const exerciseNotesStorage = {
  getAll(): Record<string, ExercisePersonalNote> {
    const notes = safeReadJson<Record<string, ExercisePersonalNote>>(
      EXERCISE_NOTES_KEY,
      {}
    );
    return notes && typeof notes === 'object' ? notes : {};
  },

  get(exerciseName: string): ExercisePersonalNote {
    const key = slugify(exerciseName);
    const all = this.getAll();
    const existing = all[key];
    return {
      exerciseKey: key,
      startingPosition: existing?.startingPosition ?? '',
      personalNotes: existing?.personalNotes ?? '',
      customVideoUrl: existing?.customVideoUrl ?? '',
      updatedAt: existing?.updatedAt ?? '',
    };
  },

  save(
    exerciseName: string,
    startingPosition: string,
    personalNotes: string,
    customVideoUrl = ''
  ): ExercisePersonalNote {
    const key = slugify(exerciseName);
    const all = this.getAll();
    const entry: ExercisePersonalNote = {
      exerciseKey: key,
      startingPosition,
      personalNotes,
      customVideoUrl: customVideoUrl.trim(),
      updatedAt: new Date().toISOString(),
    };
    all[key] = entry;
    safeWriteJson(EXERCISE_NOTES_KEY, all);
    return entry;
  },

  saveVideoUrl(exerciseName: string, customVideoUrl: string): ExercisePersonalNote {
    const key = slugify(exerciseName);
    const all = this.getAll();
    const existing = all[key];
    const entry: ExercisePersonalNote = {
      exerciseKey: key,
      startingPosition: existing?.startingPosition ?? '',
      personalNotes: existing?.personalNotes ?? '',
      customVideoUrl: customVideoUrl.trim(),
      updatedAt: new Date().toISOString(),
    };
    all[key] = entry;
    safeWriteJson(EXERCISE_NOTES_KEY, all);
    return entry;
  },
};
