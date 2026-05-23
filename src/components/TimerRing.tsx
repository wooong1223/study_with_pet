import { formatTimer } from "../utils/format";
import styles from "./TimerRing.module.css";

interface TimerRingProps {
  elapsedSeconds: number;
  targetSeconds: number;
}

export function TimerRing({ elapsedSeconds, targetSeconds }: TimerRingProps) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, elapsedSeconds / targetSeconds);
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={styles.ring} aria-label="공부 타이머">
      <svg viewBox="0 0 190 190" className={styles.svg}>
        <defs>
          <linearGradient id="timer-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c6fff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle className={styles.track} cx="95" cy="95" r={radius} />
        <circle
          className={styles.progress}
          cx="95"
          cy="95"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className={styles.content}>
        <span className={styles.time}>{formatTimer(elapsedSeconds)}</span>
        <span className={styles.caption}>이번 세션</span>
      </div>
    </div>
  );
}
