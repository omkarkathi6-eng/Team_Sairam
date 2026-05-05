import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialTime, onComplete) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const totalPausedTimeRef = useRef(0);

  // Format time in milliseconds to MM:SS format
  const formatTime = useCallback((milliseconds) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  // Start the timer
  const start = useCallback(() => {
    if (isRunning) return;

    const now = Date.now();

    // If resuming from pause, adjust the start time to account for paused duration
    if (isPaused && pauseTimeRef.current > 0) {
      totalPausedTimeRef.current += now - pauseTimeRef.current;
      pauseTimeRef.current = 0;
    } else {
      // Starting fresh
      startTimeRef.current = now;
      totalPausedTimeRef.current = 0;
    }

    setIsRunning(true);
    setIsPaused(false);

    // Start the timer loop
    timerRef.current = setInterval(() => {
      const elapsed =
        Date.now() - startTimeRef.current - totalPausedTimeRef.current;
      const remaining = Math.max(0, initialTime - elapsed);

      setTimeRemaining(remaining);

      // Check if timer has completed
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        if (onComplete) onComplete();
      }
    }, 100); // Update every 100ms for smoother countdown
  }, [initialTime, isPaused, isRunning, onComplete]);

  // Pause the timer
  const pause = useCallback(() => {
    if (!isRunning || isPaused) return;

    clearInterval(timerRef.current);
    pauseTimeRef.current = Date.now();
    setIsRunning(false);
    setIsPaused(true);
  }, [isRunning, isPaused]);

  // Resume the timer
  const resume = useCallback(() => {
    if (!isPaused) return;
    start();
  }, [isPaused, start]);

  // Reset the timer
  const reset = useCallback(
    (newTime = null) => {
      clearInterval(timerRef.current);
      const newInitialTime = newTime !== null ? newTime : initialTime;
      setTimeRemaining(newInitialTime);
      setIsRunning(false);
      setIsPaused(false);
      startTimeRef.current = 0;
      pauseTimeRef.current = 0;
      totalPausedTimeRef.current = 0;
    },
    [initialTime]
  );

  // Toggle between play/pause
  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  }, [isRunning, isPaused, pause, resume, start]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format the remaining time as MM:SS
  const formattedTime = formatTime(timeRemaining);

  // Calculate progress percentage (0-100)
  const progressPercentage = Math.max(
    0,
    Math.min(100, ((initialTime - timeRemaining) / initialTime) * 100)
  );

  return {
    timeRemaining,
    formattedTime,
    isRunning,
    isPaused,
    progressPercentage,
    start,
    pause,
    resume,
    reset,
    toggle,
  };
}
