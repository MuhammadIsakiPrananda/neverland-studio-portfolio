import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // in ms
  decimals?: number;
  suffix?: string;
  shouldStart?: boolean;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 3000,
  decimals = 0,
  suffix = "",
  shouldStart = true,
}) => {
  const [value, setValue] = useState(0);
  const start = useRef(0);

  useEffect(() => {
    if (!shouldStart) {
      setValue(0);
      return;
    }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start.current + (end - start.current) * progress;
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };
    requestAnimationFrame(step);
    return () => {
      start.current = value;
    };
  }, [end, duration, shouldStart]);

  return (
    <span>
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value)}
      {suffix}
    </span>
  );
};

export default CountUp;
