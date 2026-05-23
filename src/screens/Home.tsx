import { CharacterView } from "../components/CharacterView";
import { ExpBar } from "../components/ExpBar";
import { StatCard } from "../components/StatCard";
import type { StudyData } from "../types/study";
import { formatHoursDecimal, formatStudyTime } from "../utils/format";
import {
  getExpPercent,
  getSecondsUntilNext,
  getStage,
  getStageName,
} from "../utils/stageCalc";
import styles from "./Home.module.css";

interface HomeProps {
  data: StudyData;
  onStart: () => void;
}

export function Home({ data, onStart }: HomeProps) {
  const animal = data.animal ?? "cat";
  const stage = getStage(data.totalSeconds, data.sessions);
  const expPercent = getExpPercent(data.totalSeconds, stage);
  const secondsUntilNext = getSecondsUntilNext(data.totalSeconds, stage);
  const nextText =
    secondsUntilNext === 0 ? "최고 단계에 도착했어요" : `다음 단계까지 ${formatStudyTime(secondsUntilNext)}`;

  return (
    <main className={styles.screen}>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>StudyPet</p>
          <h1>공부친구</h1>
        </div>
        <span className={styles.streak}>연속 {data.streak}일</span>
      </header>

      <section className={styles.hero} aria-label="캐릭터 성장 상태">
        <CharacterView animal={animal} stage={stage} size={178} animate="float" />
        <span className={styles.stageBadge}>{getStageName(stage)}</span>
      </section>

      <section className={styles.progressPanel}>
        <div className={styles.progressHeader}>
          <strong>{formatHoursDecimal(data.totalSeconds)}</strong>
          <span>{nextText}</span>
        </div>
        <ExpBar percent={expPercent} />
      </section>

      <section className={styles.stats} aria-label="공부 통계">
        <StatCard label="오늘" value={formatStudyTime(data.todaySeconds)} />
        <StatCard label="누적" value={formatStudyTime(data.totalSeconds)} />
        <StatCard label="스트릭" value={`${data.streak}일`} />
      </section>

      <button type="button" className="primaryButton" onClick={onStart}>
        지금 공부 시작
      </button>
    </main>
  );
}
