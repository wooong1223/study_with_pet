import type { Animal, StudyData } from "../types/study";

const STORAGE_KEY = "studypet:data";

function normalizeAnimal(animal?: string): Animal | undefined {
  if (animal === "hamster") {
    return "tiger";
  }

  if (animal === "cat" || animal === "dog" || animal === "rabbit" || animal === "tiger") {
    return animal;
  }

  return undefined;
}

export function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayKey() {
  return getDateKey(new Date());
}

function getYesterdayKey() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return getDateKey(yesterday);
}

export function createDefaultStudyData(): StudyData {
  return {
    petName: "",
    totalSeconds: 0,
    todaySeconds: 0,
    weeklySeconds: {},
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
    const todaySeconds = lastStudyDate === today ? savedTodaySeconds : 0;
    const weeklySeconds = parsed.weeklySeconds ?? {};

    if (todaySeconds > 0 && weeklySeconds[today] == null) {
      weeklySeconds[today] = todaySeconds;
    }

    return {
      animal: normalizeAnimal(parsed.animal),
      petName: parsed.petName ?? "",
      totalSeconds: parsed.totalSeconds ?? Math.round((parsed.totalHours ?? 0) * 3600),
      todaySeconds,
      weeklySeconds,
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

export function setPetProfile(data: StudyData, animal: Animal, petName: string): StudyData {
  return {
    ...data,
    animal,
    petName,
  };
}

export function applyStudySession(data: StudyData, sessionSeconds: number): StudyData {
  const safeSessionSeconds = Math.max(0, sessionSeconds);
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  const previousTodaySeconds = data.lastStudyDate === today ? data.todaySeconds : 0;
  const weeklySeconds = { ...data.weeklySeconds };

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

  weeklySeconds[today] = (weeklySeconds[today] ?? 0) + safeSessionSeconds;

  return {
    ...data,
    totalSeconds: data.totalSeconds + safeSessionSeconds,
    todaySeconds: previousTodaySeconds + safeSessionSeconds,
    weeklySeconds,
    streak: nextStreak,
    lastStudyDate: today,
    sessions: data.sessions + 1,
  };
}

export function getCurrentWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  const distanceFromMonday = day === 0 ? 6 : day - 1;
  monday.setDate(today.getDate() - distanceFromMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return getDateKey(date);
  });
}

export function getCurrentWeekSeconds(weeklySeconds: Record<string, number>) {
  return getCurrentWeekDates().reduce((sum, dateKey) => sum + (weeklySeconds[dateKey] ?? 0), 0);
}
