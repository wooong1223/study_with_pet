import type { Animal, StudyData } from "../types/study";

const STORAGE_KEY = "studypet:data";

export function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getYesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, "0");
  const day = String(yesterday.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createDefaultStudyData(): StudyData {
  return {
    totalSeconds: 0,
    todaySeconds: 0,
    streak: 0,
    lastStudyDate: "",
    sessions: 0,
  };
}

export function loadStudyData(): StudyData {
  const fallback = createDefaultStudyData();
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw == null) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<
      StudyData & {
        totalHours: number;
        todayHours: number;
      }
    >;

    const today = getTodayKey();
    const lastStudyDate = parsed.lastStudyDate ?? "";
    const savedTodaySeconds =
      parsed.todaySeconds ?? Math.round((parsed.todayHours ?? 0) * 3600);

    return {
      animal: parsed.animal,
      totalSeconds: parsed.totalSeconds ?? Math.round((parsed.totalHours ?? 0) * 3600),
      todaySeconds: lastStudyDate === today ? savedTodaySeconds : 0,
      streak: parsed.streak ?? 0,
      lastStudyDate,
      sessions: parsed.sessions ?? 0,
    };
  } catch {
    return fallback;
  }
}

export function saveStudyData(data: StudyData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function setAnimal(data: StudyData, animal: Animal): StudyData {
  return {
    ...data,
    animal,
  };
}

export function applyStudySession(data: StudyData, sessionSeconds: number): StudyData {
  const safeSessionSeconds = Math.max(0, sessionSeconds);
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const previousTodaySeconds = data.lastStudyDate === today ? data.todaySeconds : 0;

  if (safeSessionSeconds === 0) {
    return {
      ...data,
      todaySeconds: previousTodaySeconds,
    };
  }

  const nextStreak =
    data.lastStudyDate === today
      ? Math.max(1, data.streak)
      : data.lastStudyDate === yesterday
        ? data.streak + 1
        : 1;

  return {
    ...data,
    totalSeconds: data.totalSeconds + safeSessionSeconds,
    todaySeconds: previousTodaySeconds + safeSessionSeconds,
    streak: nextStreak,
    lastStudyDate: today,
    sessions: data.sessions + 1,
  };
}
