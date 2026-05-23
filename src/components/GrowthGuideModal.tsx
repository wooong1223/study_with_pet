import { useEffect } from "react";

import styles from "./GrowthGuideModal.module.css";

interface GrowthGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

export function GrowthGuideModal({ visible, onClose }: GrowthGuideModalProps) {
  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.layer} role="dialog" aria-modal="true" aria-label="캐릭터 성장 가이드">
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="닫기" />
      <section className={styles.modal}>
        <h2>캐릭터 성장 가이드</h2>
        <ul>
          <li>
            <span>첫 공부를 시작하면</span>
            <strong>아기</strong>
          </li>
          <li>
            <span>10시간 이상</span>
            <strong>초딩 (책가방 착용)</strong>
          </li>
          <li>
            <span>50시간 이상</span>
            <strong>중딩 (안경 착용)</strong>
          </li>
          <li>
            <span>150시간 이상</span>
            <strong>고딩 (교복 착용)</strong>
          </li>
          <li>
            <span>350시간 이상</span>
            <strong>대학생 🎓 (학사모 착용)</strong>
          </li>
        </ul>
        <button type="button" className="primaryButton" onClick={onClose}>
          확인
        </button>
      </section>
    </div>
  );
}
