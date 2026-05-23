import { CharacterView } from "../components/CharacterView";
import { ExpBar } from "../components/ExpBar";
import { StatCard } from "../components/StatCard";
import type { Animal, StudyData, StudyResult } from "../types/study";
import { formatStudyTime } from "../utils/format";
import {
  getExpPercent,
  getNextStageName,
  getSecondsUntilNext,
  getStageName,
} from "../utils/stageCalc";
import { getCurrentWeekSeconds } from "../utils/storage";
import styles from "./Result.module.css";

interface ResultProps {
  animal: Animal;
  data: StudyData;
  result: StudyResult;
  onShare: () => void;
  onHome: () => void;
}

export function Result({ animal, data, result, onShare, onHome }: ResultProps) {
  const leveledUp = result.stage > result.previousStage;
  const nextStageName = getNextStageName(result.stage);
  const secondsUntilNext = getSecondsUntilNext(result.totalSeconds, result.stage);
  const sessionGainText = `+${formatStudyTime(result.sessionSeconds)} 획득`;
  const nextText =
    nextStageName == null ? "최고 단계에 도착했어요" : `${nextStageName}까지 ${formatStudyTime(secondsUntilNext)} 남음`;
  const weekSeconds = getCurrentWeekSeconds(data.weeklySeconds);

  return (
    <main className={styles.screen}>
      <section className={styles.hero}>
        <CharacterView animal={animal} stage={result.stage} size={220} animate="float" />
        <h1>{formatStudyTime(result.sessionSeconds)} 집중 완료!</h1>
        <p>
          {leveledUp
            ? `${getStageName(result.stage)} 단계로 성장했어요.`
            : "오늘도 한 걸음 성장했어요 🐾"}
        </p>
      </section>

      <section className={styles.cards}>
        <StatCard label="방금 공부" value={formatStudyTime(result.sessionSeconds)} />
        <StatCard label="오늘 총" value={formatStudyTime(result.todaySeconds)} />
        <StatCard label="이번 주" value={formatStudyTime(weekSeconds)} />
      </section>

      <div className={styles.streakBadge}>🔥 {result.streak}일 연속 공부 중</div>

      <section className={styles.exp}>
        <div className={styles.expText}>
          <strong>{sessionGainText}</strong>
          <span>{nextText}</span>
        </div>
        <ExpBar percent={getExpPercent(result.totalSeconds, result.stage)} />
      </section>

      <div className={styles.actions}>
        <button type="button" className="ghostButton" onClick={onShare}>
          친구에게 공유하기
        </button>
        <button type="button" className="primaryButton" onClick={onHome}>
          홈으로
        </button>
      </div>
    </main>
  );
}
