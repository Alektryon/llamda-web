import { useState, useEffect } from 'react';

const useCountdown = (targetTime: Date) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const pstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const pstTarget = new Date(targetTime.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    return Math.max(0, Math.floor((pstTarget.getTime() - pstNow.getTime()) / 1000));
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        const now = new Date();
        const pstNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
        const pstTarget = new Date(targetTime.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
        return Math.max(0, Math.floor((pstTarget.getTime() - pstNow.getTime()) / 1000));
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  return timeLeft;
}

export default useCountdown;
