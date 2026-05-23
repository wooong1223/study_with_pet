export type Animal = "cat" | "dog" | "rabbit" | "tiger";

export type CharacterPose = "default" | "study" | "sad";

export type CharacterAnimation = "float" | "bob" | "none";

export type Stage = 0 | 1 | 2 | 3 | 4 | 5;

export interface StudyData {
  animal?: Animal;
  petName: string;
  totalSeconds: number;
  todaySeconds: number;
  weeklySeconds: Record<string, number>;
  streak: number;
  lastStudyDate: string;
  sessions: number;
}

export interface StudyResult {
  sessionSeconds: number;
  totalSeconds: number;
  todaySeconds: number;
  weekSeconds: number;
  streak: number;
  previousStage: Stage;
  stage: Stage;
}
