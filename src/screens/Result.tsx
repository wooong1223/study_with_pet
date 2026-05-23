import { CharacterView } from "../components/CharacterView";
import { ExpBar } from "../components/ExpBar";
import { StatCard } from "../components/StatCard";
import type { Animal, StudyResult } from "../types/study";
import { formatStudyTime } from "../utils/format";
import { getExpPercent, getStageName } from "../utils/stageCalc";
import styles from "./Result.module.css";

interface ResultProps {
  animal: Animal;
  result: StudyResult;
  onShare: () => void;
  onHome: () => void;
}

export function Result({ animal, result, onShare, onHome }: ResultProps) {
  const leveledUp = result.stage > result.previousStage;

  return (
    <main className={styles.screen}>
      <section className={styles.hero}>
        <CharacterView animal={animal} stage={result.stage} size={142} animate="float" />
        <h1>오늘도 잘했어!</h1>
        <p>
          {leveledUp
            ? `${getStageName(result.stage)} 단계로 성장했어요.`
            : "조금씩 쌓인 시간이 친구를 성장시켜요."}
        </p>
      </section>

      <section className={styles.cards}>
        <StatCard label="이번 세션" value={formatStudyTime(result.sessionSeconds)} />
        <StatCard label="누적 시간" value={formatStudyTime(result.totalSeconds)} />
      </section>

      <section className={styles.exp}>
        <div className={styles.expText}>
          <strong>경험치 획득</strong>
          <span>{Math.round(getExpPercent(result.totalSeconds, result.stage))}%</span>
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
