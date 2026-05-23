import { useEffect, useState } from "react";

import type { Animal, CharacterAnimation, CharacterPose, Stage } from "../types/study";
import styles from "./CharacterView.module.css";

interface CharacterViewProps {
  animal: Animal;
  stage: Stage;
  pose?: CharacterPose;
  size?: number;
  animate?: CharacterAnimation;
}

const animalLabel: Record<Animal, string> = {
  cat: "고양이",
  dog: "강아지",
  rabbit: "토끼",
  hamster: "햄스터",
};

export function CharacterView({
  animal,
  stage,
  pose = "default",
  size = 140,
  animate = "none",
}: CharacterViewProps) {
  const [assetMissing, setAssetMissing] = useState(false);
  const src = `${import.meta.env.BASE_URL}assets/characters/${animal}_stage${stage}_${pose}.png`;
  const animationClass =
    animate === "float" ? styles.animFloat : animate === "bob" ? styles.animBob : "";
  const stageClass = styles[`stage${stage}`];
  const poseClass = pose === "study" ? styles.studyPose : "";

  useEffect(() => {
    setAssetMissing(false);
  }, [animal, stage, pose]);

  if (!assetMissing) {
    return (
      <img
        src={src}
        alt={`${animalLabel[animal]} ${stage}단계`}
        width={size}
        height={size}
        className={`${styles.characterImage} ${animationClass}`}
        onError={() => setAssetMissing(true)}
      />
    );
  }

  return (
    <div
      aria-label={`${animalLabel[animal]} ${stage}단계`}
      className={`${styles.placeholder} ${styles[animal]} ${animationClass}`}
      style={{ width: size, height: size }}
      role="img"
    >
      <div className={styles.glow} />
      <div className={styles.shadow} />
      <div className={`${styles.character} ${stageClass} ${poseClass}`}>
        {stage === 0 ? <span className={styles.eggShine} /> : null}
        <div className={styles.ears}>
          <span />
          <span />
        </div>
        <div className={styles.tail} />
        <div className={styles.body}>
          <span className={styles.belly} />
          <span className={styles.armLeft} />
          <span className={styles.armRight} />
          <span className={styles.footLeft} />
          <span className={styles.footRight} />
        </div>
        <div className={styles.face}>
          <span className={styles.eye} />
          <span className={styles.eye} />
          <span className={styles.muzzle}>
            <span className={styles.nose} />
            <span className={styles.mouth} />
          </span>
        </div>
        {pose === "study" ? <span className={styles.book} /> : null}
        {pose === "study" ? (
          <div className={styles.studyDesk} aria-hidden="true">
            <span className={styles.deskTop} />
            <span className={styles.deskLegLeft} />
            <span className={styles.deskLegRight} />
            <span className={styles.lamp} />
            <span className={styles.pencil} />
          </div>
        ) : null}
        {stage >= 2 ? <span className={styles.bag} /> : null}
        {stage >= 3 ? <span className={styles.glasses} /> : null}
        {stage >= 4 ? <span className={styles.uniform} /> : null}
        {stage >= 5 ? <span className={styles.cap} /> : null}
      </div>
    </div>
  );
}
