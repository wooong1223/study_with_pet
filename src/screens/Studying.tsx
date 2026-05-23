import { CharacterView } from "../components/CharacterView";
import { StatCard } from "../components/StatCard";
import { TimerRing } from "../components/TimerRing";
import { useTimer } from "../hooks/useTimer";
import type { StudyData } from "../types/study";
import { formatStudyTime } from "../utils/format";
import { getStage } from "../utils/stageCalc";
import styles from "./Studying.module.css";

interface StudyingProps {
  data: StudyData;
  onFinish: (sessionSeconds: number) => void;
}

const FOCUS_TARGET_SECONDS = 25 * 60;

export function Studying({ data, onFinish }: StudyingProps) {
  const timer = useTimer(true);
  const animal = data.animal ?? "cat";
  const stage = getStage(data.totalSeconds, data.sessions);

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <p>집중 모드</p>
        <h1>지금은 공부 중이에요</h1>
        {!timer.isRunning ? <span>앱을 벗어나 타이머가 멈췄어요</span> : null}
      </header>

      <TimerRing elapsedSeconds={timer.elapsedSeconds} targetSeconds={FOCUS_TARGET_SECONDS} />

      <section className={styles.character}>
        <CharacterView animal={animal} stage={stage} pose="study" size={116} animate="bob" />
      </section>

      <section className={styles.stats}>
        <StatCard label="오늘 공부" value={formatStudyTime(data.todaySeconds + timer.elapsedSeconds)} />
        <StatCard label="이번 세션" value={formatStudyTime(timer.elapsedSeconds)} />
      </section>

      <div className={styles.actions}>
        <button
          type="button"
          className="ghostButton"
          onClick={timer.isRunning ? timer.pause : timer.start}
        >
          {timer.isRunning ? "잠시 멈춤" : "다시 시작"}
        </button>
        <button
          type="button"
          className="primaryButton"
          onClick={() => onFinish(timer.elapsedSeconds)}
        >
          공부 종료
        </button>
      </div>
    </main>
  );
}
