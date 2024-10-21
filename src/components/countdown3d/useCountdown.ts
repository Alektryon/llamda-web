import { useState, useEffect } from 'react';

const useCountdown = (targetTime: Date) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const laNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const laTarget = new Date(targetTime.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const difference = laTarget.getTime() - laNow.getTime();
    return Math.max(0, Math.floor(difference / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return timeLeft;
};

export default useCountdown;
