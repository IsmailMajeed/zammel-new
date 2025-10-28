import { useEffect, useState } from "react";

/**
 * Custom hook for animating numeric values from 0 to target value
 * @param targetValue - The final value to animate to
 * @param duration - Animation duration in milliseconds (default: 2000)
 * @param delay - Delay before animation starts in milliseconds (default: 0)
 * @returns The current animated value
 */
const useAnimatedCounter = (
  targetValue: number,
  duration: number = 2000,
  delay: number = 0
): number => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    if (hasAnimated || targetValue === 0) return;

    const timer = setTimeout(() => {
      let startTime: number | undefined;
      let animationFrame: number;

      const animate = (timestamp: number): void => {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);

        // Easing function (ease-out effect)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentAnimatedValue = Math.floor(targetValue * easeOutQuart);
        setCurrentValue(currentAnimatedValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCurrentValue(targetValue);
          setHasAnimated(true);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, duration, delay, hasAnimated]);

  return currentValue;
};

export default useAnimatedCounter;
