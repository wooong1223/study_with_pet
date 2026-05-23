import type { Stage } from "../types/study";

const STAGE_THRESHOLDS_HOURS = [0, 0, 10, 50, 150, 350] as const;
const STAGE_NAMES = ["알", "아기", "초딩", "중딩", "고딩", "대학생"] as const;

function hoursToSeconds(hours: number) {
  return hours * 60 * 60;
}

export function getStage(totalSeconds: number, sessions: number): Stage {
  if (totalSeconds <= 0 && sessions === 0) {
    return 0;
  }

  const totalHours = totalSeconds / 60 / 60;

  if (totalHours >= 350) {
    return 5;
  }
  if (totalHours >= 150) {
    return 4;
  }
  if (totalHours >= 50) {
    return 3;
  }
  if (totalHours >= 10) {
    return 2;
  }

  return 1;
}

export function getStageName(stage: Stage) {
  return STAGE_NAMES[stage];
}

export function getNextStageName(stage: Stage) {
  return stage === 5 ? null : STAGE_NAMES[stage + 1];
}

export function getNextStageSeconds(stage: Stage) {
  if (stage === 0) {
    return 1;
  }

  const nextHours = STAGE_THRESHOLDS_HOURS[stage + 1];
  return nextHours == null ? null : hoursToSeconds(nextHours);
}

export function getCurrentStageSeconds(stage: Stage) {
  return hoursToSeconds(STAGE_THRESHOLDS_HOURS[stage]);
}

export function getExpPercent(totalSeconds: number, stage: Stage) {
  const next = getNextStageSeconds(stage);
  if (next == null) {
    return 100;
  }

  if (stage === 0) {
    return totalSeconds > 0 ? 100 : 0;
  }

  const current = getCurrentStageSeconds(stage);
  return Math.min(100, Math.max(0, ((totalSeconds - current) / (next - current)) * 100));
}

export function getSecondsUntilNext(totalSeconds: number, stage: Stage) {
  const next = getNextStageSeconds(stage);
  if (next == null) {
    return 0;
  }

  return Math.max(0, next - totalSeconds);
}
