import { useState, useEffect, useRef } from "react";

export function useAnimationState() {
  const [isElizaMode, setIsElizaMode] = useState(false);
  const [transition, setTransition] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const ANIMATION_DURATION = 1500; // ms

  const toggleElizaMode = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startTimeRef.current = Date.now();
    const startingValue = isElizaMode ? 1 : 0;
    const targetValue = isElizaMode ? 0 : 1;

    if (isElizaMode) {
      setIsHovering(false);
    }

    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Cubic easing for smoother transitions
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newTransition =
        startingValue + (targetValue - startingValue) * easedProgress;
      setTransition(newTransition);

      if (!isElizaMode && newTransition > 0.95 && !isHovering) {
        setIsHovering(true);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsElizaMode(!isElizaMode);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    isElizaMode,
    transition,
    toggleElizaMode,
    isSpinning: false,
    isHovering,
    spinPhase: 0,
  };
}
