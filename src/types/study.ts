export type Animal = "cat" | "dog" | "rabbit" | "hamster";

export type CharacterPose = "default" | "study";

export type CharacterAnimation = "float" | "bob" | "none";

export type Stage = 0 | 1 | 2 | 3 | 4 | 5;

export interface StudyData {
  animal?: Animal;
  totalSeconds: number;
  todaySeconds: number;
  streak: number;
  lastStudyDate: string;
  sessions: number;
}

export interface StudyResult {
  sessionSeconds: number;
  totalSeconds: number;
  todaySeconds: number;
  previousStage: Stage;
  stage: Stage;
}
