import { CharacterView } from "../components/CharacterView";
import type { Animal, Stage } from "../types/study";
import { formatStudyTime } from "../utils/format";
import { withSubjectParticle } from "../utils/korean";
import { getNextStageName, getSecondsUntilNext, getStageName } from "../utils/stageCalc";
import styles from "./EvolveOverlay.module.css";

interface EvolveOverlayProps {
  animal: Animal;
  petName: string;
  stage: Stage;
  totalSeconds: number;
  onConfirm: () => void;
}

export function EvolveOverlay({ animal, petName, stage, totalSeconds, onConfirm }: EvolveOverlayProps) {
  const nextStageName = getNextStageName(stage);
  const petNameWithParticle = withSubjectParticle(petName || "친구");
  const secondsUntilNext = getSecondsUntilNext(totalSeconds, stage);
  const hint =
    nextStageName == null
      ? "최고 단계까지 성장했어요!"
      : `${nextStageName}까지 ${formatStudyTime(secondsUntilNext)} 더 공부하면 또 성장해요!`;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="진화 완료">
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <CharacterView animal={animal} stage={stage} size={310} animate="float" />
      <h2>{petNameWithParticle} 성장했어요!</h2>
      <p>열심히 공부한 덕분에 {getStageName(stage)} 단계가 됐어요 🎉</p>
      <strong className={styles.hint}>{hint}</strong>
      <button type="button" className="primaryButton" onClick={onConfirm}>
        확인
      </button>
    </div>
  );
}
