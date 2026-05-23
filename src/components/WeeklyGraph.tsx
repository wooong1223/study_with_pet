import { getCurrentWeekDates, getTodayKey } from "../utils/storage";
import styles from "./WeeklyGraph.module.css";

interface WeeklyGraphProps {
  weeklySeconds: Record<string, number>;
}

const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];

function formatBarLabel(seconds: number) {
  if (seconds <= 0) {
    return "-";
  }

  if (seconds < 3600) {
    return `${Math.max(1, Math.floor(seconds / 60))}분`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return minutes === 0 ? `${hours}시간` : `${hours}h ${minutes}m`;
}

export function WeeklyGraph({ weeklySeconds }: WeeklyGraphProps) {
  const dates = getCurrentWeekDates();
  const today = getTodayKey();
  const maxSeconds = Math.max(1, ...dates.map((date) => weeklySeconds[date] ?? 0));

  return (
    <section className={styles.panel} aria-label="주간 학습 그래프">
      <header>
        <strong>이번 주 학습</strong>
      </header>
      <div className={styles.chart}>
        {dates.map((date, index) => {
          const seconds = weeklySeconds[date] ?? 0;
          const height = Math.max(10, Math.round((seconds / maxSeconds) * 76));
          const isToday = date === today;

          return (
            <div className={styles.day} key={date}>
              <span className={`${styles.value} ${isToday ? styles.todayLabel : ""}`}>
                {formatBarLabel(seconds)}
              </span>
              <span
                className={`${styles.bar} ${isToday ? styles.today : ""}`}
                style={{ height }}
                title={`${dayLabels[index]} ${Math.floor(seconds / 60)}분`}
              />
              <span className={isToday ? styles.todayLabel : ""}>{dayLabels[index]}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
