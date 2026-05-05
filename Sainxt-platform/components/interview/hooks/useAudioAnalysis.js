import { useState, useEffect, useRef, useCallback } from "react";

export function useAudioAnalysis(stream) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Initialize audio context and analyzer
  const initAudioAnalysis = useCallback(() => {
    if (!stream || !stream.getAudioTracks().length) {
      setError("No audio stream available");
      return false;
    }

    try {
      // Create audio context if it doesn't exist
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      // Create analyzer node
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32; // Lower value for performance

      // Create data array for analysis
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Create audio source from stream
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      return true;
    } catch (err) {
      console.error("Error initializing audio analysis:", err);
      setError("Failed to initialize audio analysis");
      return false;
    }
  }, [stream]);

  // Analyze audio levels
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    try {
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Calculate average volume level (0-100)
      let sum = 0;
      const length = dataArrayRef.current.length;

      for (let i = 0; i < length; i++) {
        sum += dataArrayRef.current[i];
      }

      const average = sum / length;
      const normalizedLevel = Math.min(100, Math.max(0, (average / 255) * 200)); // Scale to 0-100

      setAudioLevel(normalizedLevel);

      // Detect if user is speaking (audio level above threshold)
      const SPEAKING_THRESHOLD = 10; // Adjust based on testing
      if (normalizedLevel > SPEAKING_THRESHOLD) {
        setIsSpeaking(true);

        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Set a timer to detect when speaking stops
        silenceTimerRef.current = setTimeout(() => {
          setIsSpeaking(false);
        }, 1000); // Consider it stopped speaking after 1s of silence
      }

      // Continue the analysis loop
      animationRef.current = requestAnimationFrame(analyzeAudio);
    } catch (err) {
      console.error("Error analyzing audio:", err);
      setError("Error during audio analysis");
    }
  }, []);

  // Start audio analysis
  const startAnalysis = useCallback(() => {
    if (!stream) return;

    const initialized = initAudioAnalysis();
    if (initialized) {
      // Resume audio context if it was suspended
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      // Start the analysis loop
      animationRef.current = requestAnimationFrame(analyzeAudio);
    }
  }, [stream, initAudioAnalysis, analyzeAudio]);

  // Stop audio analysis
  const stopAnalysis = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Suspend audio context to save resources
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.suspend().catch(console.error);
    }

    // Reset states
    setAudioLevel(0);
    setIsSpeaking(false);
  }, []);

  const toggleAnalysis = useCallback(() => {
    if (animationRef.current) {
      stopAnalysis();
    } else {
      startAnalysis();
    }
  }, [startAnalysis, stopAnalysis]);

  // Clean up on unmount or when stream changes
  useEffect(() => {
    return () => {
      stopAnalysis();

      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [stream, stopAnalysis]);

  return {
    audioLevel,
    isSpeaking,
    error,
    startAnalysis,
    stopAnalysis,
    toggleAnalysis,
  };
}
