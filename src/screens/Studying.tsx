import { useEffect, useMemo, useState } from "react";

import { CharacterView } from "../components/CharacterView";
import { StatCard } from "../components/StatCard";
import { useTimer } from "../hooks/useTimer";
import type { StudyData } from "../types/study";
import { formatDigitalTimer, formatStudyTime } from "../utils/format";
import { withSubjectParticle } from "../utils/korean";
import { getStage } from "../utils/stageCalc";
import styles from "./Studying.module.css";

interface StudyingProps {
  data: StudyData;
  onFinish: (sessionSeconds: number) => void;
}

function getMessages(petName: string) {
  const nameWithParticle = withSubjectParticle(petName || "친구");

  return [
    `${nameWithParticle} 열심히 응원하고 있어요 🐾`,
    "지금 이 순간이 미래를 만들어요",
    "조금만 더, 잘하고 있어요!",
    "집중력이 올라가고 있어요 📚",
    `${nameWithParticle} 함께하고 있어요`,
  ];
}

export function Studying({ data, onFinish }: StudyingProps) {
  const timer = useTimer(true);
  const animal = data.animal ?? "cat";
  const stage = getStage(data.totalSeconds, data.sessions);
  const messages = useMemo(() => getMessages(data.petName), [data.petName]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!timer.isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [messages.length, timer.isRunning]);

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <p>집중 중</p>
        <h1>화면을 벗어나면 타이머가 멈춰요</h1>
        {!timer.isRunning ? <span>앗, 자리를 비웠군요! 다시 시작할까요?</span> : null}
      </header>

      <section className={styles.focusArea} aria-label="공부 타이머">
        <CharacterView
          animal={animal}
          stage={stage}
          pose={timer.isRunning ? "study" : "sad"}
          size={260}
          animate={timer.isRunning ? "bob" : "none"}
        />
        <strong className={styles.digitalTimer}>{formatDigitalTimer(timer.elapsedSeconds)}</strong>
        <p className={styles.message}>{timer.isRunning ? messages[messageIndex] : messages[4]}</p>
      </section>

      <section className={styles.stats}>
        <StatCard label="오늘 공부" value={formatStudyTime(data.todaySeconds + timer.elapsedSeconds)} />
        <StatCard label={`연속 ${data.streak}일`} value="공부 중" />
      </section>

      <div className={`${styles.actions} ${!timer.isRunning ? styles.pausedActions : ""}`}>
        {!timer.isRunning ? (
          <button type="button" className="ghostButton" onClick={timer.start}>
            다시 집중하기
          </button>
        ) : null}
        <button
          type="button"
          className="primaryButton"
          onClick={() => onFinish(timer.elapsedSeconds)}
        >
          {timer.isRunning ? "공부 종료" : "오늘은 여기까지"}
        </button>
      </div>
    </main>
  );
}
