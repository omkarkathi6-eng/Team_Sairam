import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for managing speech recognition.
 * @returns {{
 * isListening: boolean,
 * isSpeaking: boolean,
 * transcript: string,
 * error: string|null,
 * startListening: () => void,
 * stopListening: () => void,
 * resetTranscript: () => void
 * }}
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  // Use a ref to hold the accumulated final transcript to avoid stale closures
  const finalTranscriptRef = useRef("");

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // A ref to track if we should be actively listening, used for onend restart logic
  const shouldListenRef = useRef(false);

  // Function to reset all transcript-related state
  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = "";
    setInterimTranscript("");
    setTranscript("");
  }, []);

  // Initialize and configure speech recognition API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Try Chrome for best results."
      );
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
      console.log("Speech recognition started.");
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      console.log("Speech recognition ended.");
      // Auto-restart if we are still supposed to be listening
      if (shouldListenRef.current) {
        setTimeout(() => {
          recognitionRef.current.start();
        }, 500); // Small delay to avoid rapid restarts
      }
    };

    recognitionRef.current.onresult = (event) => {
      // Reset silence timer on new speech results
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Start a new timer to detect silence (no speech for 2 seconds)
      silenceTimerRef.current = setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);

      setIsSpeaking(true);
      let interim = "";
      let currentFinalChunk = "";

      // Loop through the results to distinguish final and interim transcripts
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinalChunk += transcriptChunk + " ";
        } else {
          interim += transcriptChunk; // collect interim words
        }
      }

      // Add any final chunks to the accumulated transcript
      if (currentFinalChunk) {
        finalTranscriptRef.current += currentFinalChunk;
      }

      const liveTranscript = (
        finalTranscriptRef.current +
        " " +
        interim
      ).trim();

      // Update the interim transcript state
      setInterimTranscript(interim);
      setTranscript(liveTranscript);

      // Combine final and interim transcripts for the full transcript
      const fullTranscript =
        (finalTranscriptRef.current + interim).trim() || "";
      setTranscript(fullTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
      shouldListenRef.current = false; // Stop listening on error
      console.warn("Speech recognition error:", event.error);
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // Public functions to start and stop listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      shouldListenRef.current = true;
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      shouldListenRef.current = false;
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
