import React, {useEffect, useMemo, useState} from 'react';
import {loadWorkoutProgram} from './data/programmes';
import {
  completionStorage,
  DEFAULT_ACTIVE_BLOCK_ID,
  preferencesStorage,
} from './services/storage';
import type {
  CompletionRecord,
  NavTab,
  PrescribedExercise,
  UserPreferences,
  WeekdayName,
  WeekStart,
  WorkoutBlock,
  WorkoutProgram,
} from './types/workout';
import {
  buildCompletionRecordId,
  getDateForWeekdayInWeek,
  getTodayIsoDate,
  getWeekdayFromIsoDate,
} from './utils/workoutFormatters';
import {AppLayout} from './components/AppLayout';
import {DailyChecklist} from './components/DailyChecklist';
import {ExerciseGuide} from './components/ExerciseGuide';
import {HistoryPage} from './components/HistoryPage';
import {PWAInstallButton} from './components/PWAInstallButton';
import {SettingsPage} from './components/SettingsPage';
import {ThemeProvider} from './components/ThemeProvider';
import {WeekdaySwitcherStrip} from './components/WeekdaySwitcherStrip';

function SetoraAppContent() {
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    preferencesStorage.get()
  );
  const [completionRecords, setCompletionRecords] = useState<CompletionRecord[]>(
    () => completionStorage.getAll()
  );

  const todayIso = getTodayIsoDate();
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [selectedDay, setSelectedDay] = useState<WeekdayName>(() =>
    getWeekdayFromIsoDate(todayIso)
  );
  const [activeWorkoutDate, setActiveWorkoutDate] = useState<string>(todayIso);
  const [historyInspectRecord, setHistoryInspectRecord] =
    useState<CompletionRecord | null>(null);

  const [guideExercise, setGuideExercise] = useState<PrescribedExercise | null>(
    null
  );
  const [noteVersion, setNoteVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoadError(null);
    loadWorkoutProgram()
      .then((loaded) => {
        if (!active) return;
        setProgram(loaded);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setLoadError(
          err instanceof Error ? err.message : 'Unable to load programme.'
        );
      });
    return () => {
      active = false;
    };
  }, [reloadNonce]);

  const activeBlock: WorkoutBlock | null = useMemo(() => {
    if (!program || program.blocks.length === 0) return null;
    if (historyInspectRecord) {
      return (
        program.blocks.find(
          (b) => b.id === historyInspectRecord.programme_block_id
        ) ?? program.blocks[program.blocks.length - 1]
      );
    }
    return (
      program.blocks.find((b) => b.id === preferences.activeBlockId) ??
      program.blocks.find((b) => b.id === DEFAULT_ACTIVE_BLOCK_ID) ??
      program.blocks[program.blocks.length - 1]
    );
  }, [program, preferences.activeBlockId, historyInspectRecord]);

  const activeWorkoutDay = useMemo(() => {
    if (!activeBlock) return null;
    return activeBlock.days.find((d) => d.day === selectedDay) ?? null;
  }, [activeBlock, selectedDay]);

  const currentCompletionRecord = useMemo(() => {
    if (!activeBlock) return null;
    const id = buildCompletionRecordId(
      activeWorkoutDate,
      activeBlock.id,
      selectedDay
    );
    return completionRecords.find((r) => r.id === id) ?? null;
  }, [activeBlock, activeWorkoutDate, selectedDay, completionRecords]);

  const todayHasRecords = useMemo(() => {
    return completionRecords.some((r) => r.workout_date === todayIso);
  }, [completionRecords, todayIso]);

  const handleSelectBlock = (blockId: string) => {
    const next = {...preferences, activeBlockId: blockId};
    setPreferences(next);
    preferencesStorage.save(next);
    setHistoryInspectRecord(null);
  };

  const handleChangeWeekStart = (weekStart: WeekStart) => {
    const next = {...preferences, weekStart};
    setPreferences(next);
    preferencesStorage.save(next);
  };

  const handleSelectDay = (day: WeekdayName) => {
    setHistoryInspectRecord(null);
    setSelectedDay(day);
    setActiveWorkoutDate(
      getDateForWeekdayInWeek(day, preferences.weekStart, todayIso)
    );
  };

  const handleToggleCardio = () => {
    if (!program || !activeBlock || !activeWorkoutDay) return;

    const existing = currentCompletionRecord;
    const nextCardio = !(existing?.cardio_completed ?? false);
    const completedIds = existing?.completed_exercise_ids ?? [];
    const totalExercises = activeWorkoutDay.exercises.length;
    const allDone =
      nextCardio && totalExercises > 0 && completedIds.length === totalExercises;

    const updated: CompletionRecord = {
      id: buildCompletionRecordId(
        activeWorkoutDate,
        activeBlock.id,
        selectedDay
      ),
      workout_date: activeWorkoutDate,
      programme_id: program.program_id,
      programme_block_id: activeBlock.id,
      programme_block_label: activeBlock.label,
      workout_day: selectedDay,
      category: activeWorkoutDay.category,
      cardio_completed: nextCardio,
      completed_exercise_ids: completedIds,
      total_exercises: totalExercises,
      completion_status: allDone ? 'completed' : 'in_progress',
      updated_at: new Date().toISOString(),
    };

    const nextRecords = completionStorage.saveRecord(updated);
    setCompletionRecords(nextRecords);
  };

  const handleToggleExercise = (exerciseId: string) => {
    if (!program || !activeBlock || !activeWorkoutDay) return;

    const existing = currentCompletionRecord;
    const prevIds = existing?.completed_exercise_ids ?? [];
    const nextIds = prevIds.includes(exerciseId)
      ? prevIds.filter((id) => id !== exerciseId)
      : [...prevIds, exerciseId];
    const cardioDone = existing?.cardio_completed ?? false;
    const totalExercises = activeWorkoutDay.exercises.length;
    const allDone =
      cardioDone && totalExercises > 0 && nextIds.length === totalExercises;

    const updated: CompletionRecord = {
      id: buildCompletionRecordId(
        activeWorkoutDate,
        activeBlock.id,
        selectedDay
      ),
      workout_date: activeWorkoutDate,
      programme_id: program.program_id,
      programme_block_id: activeBlock.id,
      programme_block_label: activeBlock.label,
      workout_day: selectedDay,
      category: activeWorkoutDay.category,
      cardio_completed: cardioDone,
      completed_exercise_ids: nextIds,
      total_exercises: totalExercises,
      completion_status: allDone ? 'completed' : 'in_progress',
      updated_at: new Date().toISOString(),
    };

    const nextRecords = completionStorage.saveRecord(updated);
    setCompletionRecords(nextRecords);
  };

  const handleOpenHistoryRecord = (record: CompletionRecord) => {
    setHistoryInspectRecord(record);
    setSelectedDay(record.workout_day);
    setActiveWorkoutDate(record.workout_date);
  };

  const handleResetToday = () => {
    const nextRecords = completionStorage.resetByDate(todayIso);
    setCompletionRecords(nextRecords);
  };

  const resetToToday = () => {
    const currentToday = getTodayIsoDate();
    setActiveTab('today');
    setHistoryInspectRecord(null);
    setSelectedDay(getWeekdayFromIsoDate(currentToday));
    setActiveWorkoutDate(currentToday);
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'today') {
      resetToToday();
      return;
    }
    setActiveTab(tab);
    setHistoryInspectRecord(null);
  };

  if (loadError) {
    return (
      <AppLayout
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onLogoClick={resetToToday}
      >
        <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <h1 className="font-heading text-[22px] font-semibold text-[var(--text-primary)]">
            Could not load workout programme
          </h1>
          <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            className="mt-5 min-h-[48px] rounded-[14px] bg-[var(--primary)] px-6 py-3 text-[15px] font-semibold text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-hover)]"
          >
            Try Again
          </button>
        </div>
      </AppLayout>
    );
  }

  if (!program || !activeBlock) {
    return (
      <AppLayout
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onLogoClick={resetToToday}
      >
        <div className="space-y-4" aria-busy="true" aria-label="Loading workout">
          <div className="h-24 w-full animate-pulse rounded-[18px] bg-[var(--surface)]" />
          <div className="h-14 w-64 animate-pulse rounded-[12px] bg-[var(--surface)]" />
          <div className="h-20 w-full animate-pulse rounded-[18px] bg-[var(--surface)]" />
          <div className="h-20 w-full animate-pulse rounded-[18px] bg-[var(--surface)]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onChangeTab={handleTabChange}
      onLogoClick={resetToToday}
      rightAction={<PWAInstallButton compact />}
    >
      {activeTab === 'today' && (
        <div className="mx-auto max-w-3xl space-y-6">
          <WeekdaySwitcherStrip
            blocks={program.blocks}
            activeBlock={activeBlock}
            weekStart={preferences.weekStart}
            selectedDay={selectedDay}
            completionRecords={completionRecords}
            onSelectBlock={handleSelectBlock}
            onSelectDay={handleSelectDay}
          />

          <DailyChecklist
            block={activeBlock}
            weekday={selectedDay}
            workoutDay={activeWorkoutDay}
            workoutDate={activeWorkoutDate}
            completionRecord={currentCompletionRecord}
            onChangeDate={(nextDate) => setActiveWorkoutDate(nextDate)}
            onToggleCardio={handleToggleCardio}
            onToggleExercise={handleToggleExercise}
            onOpenGuide={(ex) => setGuideExercise(ex)}
            onSelectWeekday={handleSelectDay}
            noteVersion={noteVersion}
          />
        </div>
      )}

      {activeTab === 'history' && !historyInspectRecord && (
        <div className="mx-auto max-w-3xl">
          <HistoryPage
            records={completionRecords}
            onOpenRecord={handleOpenHistoryRecord}
            onGoToSchedule={resetToToday}
          />
        </div>
      )}

      {activeTab === 'history' && historyInspectRecord && (
        <div className="mx-auto max-w-3xl">
          <DailyChecklist
            block={activeBlock}
            weekday={selectedDay}
            workoutDay={activeWorkoutDay}
            workoutDate={activeWorkoutDate}
            completionRecord={currentCompletionRecord}
            backLabel="Back to history"
            onBack={() => setHistoryInspectRecord(null)}
            onChangeDate={(nextDate) => setActiveWorkoutDate(nextDate)}
            onToggleCardio={handleToggleCardio}
            onToggleExercise={handleToggleExercise}
            onOpenGuide={(ex) => setGuideExercise(ex)}
            noteVersion={noteVersion}
          />
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="mx-auto max-w-3xl">
          <SettingsPage
            blocks={program.blocks}
            activeBlockId={preferences.activeBlockId}
            weekStart={preferences.weekStart}
            todayHasRecords={todayHasRecords}
            onSelectBlock={handleSelectBlock}
            onChangeWeekStart={handleChangeWeekStart}
            onResetToday={handleResetToday}
          />
        </div>
      )}

      <ExerciseGuide
        exercise={guideExercise}
        onClose={() => setGuideExercise(null)}
        onNoteSaved={() => setNoteVersion((v) => v + 1)}
      />
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SetoraAppContent />
    </ThemeProvider>
  );
}
