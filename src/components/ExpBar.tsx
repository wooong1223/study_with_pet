import styles from "./ExpBar.module.css";

interface ExpBarProps {
  percent: number;
}

export function ExpBar({ percent }: ExpBarProps) {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className={styles.track} aria-label={`경험치 ${Math.round(safePercent)}%`}>
      <div className={styles.fill} style={{ width: `${safePercent}%` }} />
    </div>
  );
}
