import { CharacterView } from "../components/CharacterView";
import type { Animal, Stage } from "../types/study";
import { getStageName } from "../utils/stageCalc";
import styles from "./EvolveOverlay.module.css";

interface EvolveOverlayProps {
  animal: Animal;
  stage: Stage;
  onConfirm: () => void;
}

export function EvolveOverlay({ animal, stage, onConfirm }: EvolveOverlayProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="진화 완료">
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <CharacterView animal={animal} stage={stage} size={178} animate="float" />
      <h2>{getStageName(stage)} 단계 진화!</h2>
      <p>공부 시간이 쌓여 친구가 새로운 모습으로 성장했어요.</p>
      <button type="button" className="primaryButton" onClick={onConfirm}>
        확인
      </button>
    </div>
  );
}
