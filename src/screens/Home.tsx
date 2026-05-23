import { useState } from "react";

import { CharacterView } from "../components/CharacterView";
import { ExpBar } from "../components/ExpBar";
import { GrowthGuideModal } from "../components/GrowthGuideModal";
import { StatCard } from "../components/StatCard";
import { WeeklyGraph } from "../components/WeeklyGraph";
import type { StudyData } from "../types/study";
import { formatHoursDecimal, formatStudyTime } from "../utils/format";
import {
  getExpPercent,
  getNextStageName,
  getSecondsUntilNext,
  getStage,
  getStageName,
} from "../utils/stageCalc";
import { getCurrentWeekSeconds } from "../utils/storage";
import styles from "./Home.module.css";

interface HomeProps {
  data: StudyData;
  onStart: () => void;
}

export function Home({ data, onStart }: HomeProps) {
  const [growthGuideOpen, setGrowthGuideOpen] = useState(false);
  const animal = data.animal ?? "cat";
  const stage = getStage(data.totalSeconds, data.sessions);
  const expPercent = getExpPercent(data.totalSeconds, stage);
  const secondsUntilNext = getSecondsUntilNext(data.totalSeconds, stage);
  const nextStageName = getNextStageName(stage);
  const weekSeconds = getCurrentWeekSeconds(data.weeklySeconds);
  const nextText =
    secondsUntilNext === 0 || nextStageName == null
      ? "최고 단계에 도착했어요 →"
      : `${nextStageName}까지 ${formatStudyTime(secondsUntilNext)} 남았어요 →`;

  return (
    <main className={styles.screen}>
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>내 공부친구</p>
          <h1>공부친구</h1>
        </div>
        <span className={styles.streak}>연속 {data.streak}일</span>
      </header>

      <section className={styles.hero} aria-label="캐릭터 성장 상태">
        <div className={styles.characterWrap}>
          <CharacterView animal={animal} stage={stage} size={240} animate="float" />
          <button
            type="button"
            className={styles.questionButton}
            onClick={() => setGrowthGuideOpen(true)}
            aria-label="캐릭터 성장 가이드 보기"
          >
            ?
          </button>
        </div>
        <span className={styles.stageBadge}>{getStageName(stage)}</span>
      </section>

      <section className={styles.progressPanel}>
        <div className={styles.progressHeader}>
          <strong>{formatHoursDecimal(data.totalSeconds)}</strong>
          <button type="button" className={styles.guideTextButton} onClick={() => setGrowthGuideOpen(true)}>
            {nextText}
          </button>
        </div>
        <ExpBar percent={expPercent} />
      </section>

      <section className={styles.stats} aria-label="공부 통계">
        <StatCard label="오늘" value={formatStudyTime(data.todaySeconds)} />
        <StatCard label="이번 주" value={formatStudyTime(weekSeconds)} />
        <StatCard label={`연속 ${data.streak}일`} value="공부 중" />
      </section>

      <WeeklyGraph weeklySeconds={data.weeklySeconds} />

      <button type="button" className="primaryButton" onClick={onStart}>
        지금 공부 시작
      </button>

      <GrowthGuideModal visible={growthGuideOpen} onClose={() => setGrowthGuideOpen(false)} />
    </main>
  );
}
