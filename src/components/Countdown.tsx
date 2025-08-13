import { useState, useEffect } from "react";
import styles from "@/styles/components/countdownTimer.module.css";

export const Countdown = ({ targetTimestamp }: { targetTimestamp: bigint }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = Number(targetTimestamp) * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const renderTime = (value: number, label: string) => (
    <div className={styles.individual}>
      <div className={styles.timeValue}>{String(value).padStart(2, "0")}</div>
      <div className={styles.timeLabel}>{label}</div>
    </div>
  );

  return (
    <div className={styles.countdownTimer}>
      {renderTime(timeLeft.days, "days")}
      <span>:</span>
      {renderTime(timeLeft.hours, "hours")}
      <span>:</span>
      {renderTime(timeLeft.minutes, "minutes")}
      <span>:</span>
      {renderTime(timeLeft.seconds, "seconds")}
    </div>
  );
};
