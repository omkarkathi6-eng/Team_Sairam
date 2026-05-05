import { useState, useEffect, useRef, useCallback } from "react";
import { useDevices } from "./hooks/useDevices";
import { useMediaRecorder } from "./hooks/useMediaRecorder";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useFaceDetection } from "./hooks/useFaceDetection";
import { useAudioAnalysis } from "./hooks/useAudioAnalysis";
import { useTimer } from "./hooks/useTimer";
import WelcomeStep from "./steps/WelcomeStep";
import DeviceTestStep from "./steps/DeviceTestStep";
import GetReadyStep from "./steps/GetReadyStep";
import InterviewStep from "./steps/InterviewStep";
import CompleteStep from "./steps/CompleteStep";
import ResultsStep from "./steps/ResultsStep";
import { STEPS, INTERVIEW_DURATION } from "./constants";

export default function InterviewManager({
  onComplete,
  onLoadingStateChange,
  onReviewingStateChange,
}) {
  // Interview state
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [notes, setNotes] = useState("");
  const [evaluationError, setEvaluationError] = useState(null);

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timeRemainingRef = useRef(INTERVIEW_DURATION);

  // Custom hooks
  const {
    devices,
    hasPermission,
    isLoading: isLoadingDevices,
    hasVideoDevices,
    hasAudioDevices,
    refreshDevices,
  } = useDevices();

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  // Media recording
  const handleRecordingData = useCallback((chunks) => {
    console.log("Received recording chunks:", chunks.length);
  }, []);

  const {
    isRecording,
    isPaused,
    recordedBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useMediaRecorder(streamRef.current, handleRecordingData);

  // Speech recognition
  const {
    isListening: isSpeechListening,
    isSpeaking,
    transcript,
    error,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  // Face detection
  const {
    isDetecting: isFaceDetecting,
    isLookingAway,
    isMultipleFaces,
    faceCount,
    startDetection: startFaceDetection,
    stopDetection: stopFaceDetection,
  } = useFaceDetection(videoRef, canvasRef);

  // Audio analysis
  const {
    audioLevel,
    isSpeaking: isAudioSpeaking,
    startAnalysis: startAudioAnalysis,
    stopAnalysis: stopAudioAnalysis,
  } = useAudioAnalysis(streamRef.current);

  // Handle interview completion - stable callback with proper dependencies
  const handleInterviewComplete = useCallback(() => {
    console.log("Interview completed, stopping all services");
    stopRecording();
    stopSpeechRecognition();
    stopFaceDetection();
    stopAudioAnalysis();
    setCurrentStep(STEPS.COMPLETE);
  }, [
    stopRecording,
    stopSpeechRecognition,
    stopFaceDetection,
    stopAudioAnalysis,
  ]);

  // Timer setup with stable callback
  const {
    timeRemaining,
    formattedTime,
    isRunning: isTimerRunning,
    isPaused: isTimerPaused,
    progressPercentage,
    start: startTimer,
    pause: pauseTimer,
    resume: resumeTimer,
    reset: resetTimer,
  } = useTimer(INTERVIEW_DURATION, handleInterviewComplete);

  // Update ref when timeRemaining changes
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  // Submit interview - separate from handleInterviewComplete to avoid circular dependency
  const submitInterview = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setEvaluationError(null);
    onReviewingStateChange?.(true);

    try {
      console.log("Providing hardcoded AI evaluation results...");

      // Simulate a short delay for "AI processing" feel
      await new Promise(resolve => setTimeout(resolve, 2000));

      const hardcodedEvaluation = {
        status: "success",
        evaluation: {
          overallScore: 85,
          feedback: "Extremely impressive performance. You demonstrated deep technical knowledge in individual project management and localized AI deployment. Your communication is clear, concise, and professional.",
          keyStrengths: [
            "Strong command of core Python and modern AI frameworks",
            "Articulate communication with clear technical explanations",
            "Strategic thinking in problem-solving scenarios",
            "Professional demeanor and consistent eye contact"
          ],
          areasForImprovement: [
            "Could further elaborate on scaling localized solutions",
            "Slight hesitation when discussing edge-case error handling"
          ],
          questionFeedback: questions.map((q, i) => ({
            question: q.question || q.text,
            score: 80 + Math.floor(Math.random() * 15),
            feedback: "Excellent answer. You covered all the key points and provided relevant examples."
          })),
          communicationScore: 90,
          technicalScore: 82,
          confidenceScore: 88,
          detailedScores: {
            "Problem Solving": 85,
            "Technical Accuracy": 80,
            "Relevance": 92,
            "Depth of Knowledge": 78
          },
          nextSteps: [
            "Focus on advanced system architecture for localized LLMs",
            "Practice more scenario-based behavioral questions",
            "Explore advanced MongoDB optimization for individual datasets"
          ],
          interviewMetrics: {
            "Speaking Rate": "140 wpm (Optimal)",
            "Filler Word Count": "2 per minute (Low)",
            "Sentiment": "Positive",
            "Engagement": "High"
          }
        }
      };

      const result = hardcodedEvaluation;
      console.log("Hardcoded Evaluation Result:", result);

      if (result.status === "success" && result.evaluation) {
        const mappedResults = {
          ...result.evaluation,
          overallScore: result.evaluation.overallScore || 0,
          feedback: result.evaluation.feedback || "Evaluation completed.",
          areasForImprovement: result.evaluation.areasForImprovement || [],
          keyStrengths: result.evaluation.keyStrengths || [],
          questionFeedback: result.evaluation.questionFeedback || [],
          communicationScore:
            result.evaluation.communicationScore ||
            result.evaluation.overallScore ||
            0,
          technicalScore:
            result.evaluation.technicalScore ||
            result.evaluation.overallScore ||
            0,
          confidenceScore:
            result.evaluation.confidenceScore ||
            result.evaluation.overallScore ||
            0,
          detailedScores: result.evaluation.detailedScores || {},
          nextSteps: result.evaluation.nextSteps || [],
          interviewMetrics: result.evaluation.interviewMetrics || {},
        };

        setEvaluationResults(mappedResults);
        console.log("Successfully set hardcoded evaluation results");
      }
    } catch (error) {
      console.error("Error in hardcoded evaluation flow:", error);
      setEvaluationError("An unexpected error occurred during evaluation.");
    } finally {
      setIsSubmitting(false);
      onReviewingStateChange?.(false);
    }
  }, [isSubmitting, onReviewingStateChange, questions]);

  // Submit interview when interview completes
  useEffect(() => {
    if (
      currentStep === STEPS.COMPLETE &&
      !isSubmitting &&
      !evaluationResults &&
      !evaluationError
    ) {
      submitInterview();
    }
  }, [
    currentStep,
    isSubmitting,
    evaluationResults,
    evaluationError,
    submitInterview,
  ]);

  // Combined handlers for interview flow - stable callbacks
  const handleStartBoth = useCallback(() => {
    console.log("Starting recording and speech recognition");
    resetTranscript();
    startRecording();
    startSpeechRecognition();
    if (micEnabled) startAudioAnalysis();
  }, [
    resetTranscript,
    startRecording,
    startSpeechRecognition,
    startAudioAnalysis,
    micEnabled,
  ]);

  const handleStopBoth = useCallback(() => {
    console.log("Stopping recording and speech recognition");
    stopRecording();
    stopSpeechRecognition();
    stopAudioAnalysis();
  }, [stopRecording, stopSpeechRecognition, stopAudioAnalysis]);

  const handlePauseBoth = useCallback(() => {
    console.log("Pausing recording and speech recognition");
    pauseRecording();
    stopSpeechRecognition();
    stopAudioAnalysis();
  }, [pauseRecording, stopSpeechRecognition, stopAudioAnalysis]);

  const handleResumeBoth = useCallback(() => {
    console.log("Resuming recording and speech recognition");
    resumeRecording();
    startSpeechRecognition();
    startAudioAnalysis();
  }, [resumeRecording, startSpeechRecognition, startAudioAnalysis]);

  // FIXED: Initialize media stream with proper permission and device handling
  useEffect(() => {
    let cleanup;
    let isActive = true;

    const initMediaStream = async () => {
      console.log("Initializing media stream...", {
        cameraEnabled,
        micEnabled,
        hasPermission,
        hasVideoDevices,
        hasAudioDevices,
        currentStep,
      });

      // Only initialize during device test or interview steps
      if (
        currentStep !== STEPS.DEVICE_TEST &&
        currentStep !== STEPS.INTERVIEW
      ) {
        console.log(
          "Not in device test or interview step, skipping media init"
        );
        return;
      }

      if (!cameraEnabled && !micEnabled) {
        console.log(
          "Both camera and mic disabled, cleaning up existing stream"
        );
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        const constraints = {
          video:
            cameraEnabled && hasVideoDevices
              ? {
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  facingMode: "user",
                }
              : false,
          audio: micEnabled && hasAudioDevices,
        };

        console.log("Requesting media with constraints:", constraints);

        // Request permissions first if we don't have them
        if (!hasPermission) {
          console.log("No permission detected, requesting...");
          try {
            await navigator.mediaDevices.getUserMedia(constraints);
          } catch (permError) {
            console.error("Permission denied:", permError);
            return;
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isActive) {
          console.log("Component unmounted, stopping new stream");
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log("Media stream obtained:", stream);

        // Clean up previous stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        streamRef.current = stream;

        // Set up video if camera is enabled
        if (
          videoRef.current &&
          cameraEnabled &&
          stream.getVideoTracks().length > 0
        ) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
            console.log("Video stream started successfully");
          } catch (playError) {
            console.error("Error playing video:", playError);
            // Try to play again after a short delay
            setTimeout(() => {
              if (videoRef.current && isActive) {
                videoRef.current.play().catch(console.error);
              }
            }, 100);
          }
        }

        cleanup = () => {
          if (stream && stream.getTracks) {
            stream.getTracks().forEach((track) => track.stop());
          }
          if (streamRef.current === stream) {
            streamRef.current = null;
          }
        };
      } catch (err) {
        console.error("Error accessing media devices:", err);
        if (err.name === "NotAllowedError") {
          console.error("Permission denied for media devices");
        } else if (err.name === "NotFoundError") {
          console.error("No media devices found");
        }
      }
    };

    initMediaStream();

    return () => {
      isActive = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [
    cameraEnabled,
    micEnabled,
    hasPermission,
    hasVideoDevices,
    hasAudioDevices,
    currentStep, // Add currentStep to dependencies
  ]);

  // Navigation handlers
  const handleStartInterview = () => {
    setCurrentStep(STEPS.DEVICE_TEST);
  };

  const handleDeviceTestComplete = () => {
    setCurrentStep(STEPS.GET_READY);
  };

  const handleGetReadyComplete = () => {
    console.log("Starting interview with questions:", questions);
    console.log("Questions length:", questions.length);

    if (questions.length === 0) {
      console.error("No questions available! Cannot start interview.");
      alert("No questions loaded. Please try again.");
      return;
    }

    setCurrentStep(STEPS.INTERVIEW);
    if (cameraEnabled) startFaceDetection();
    if (micEnabled) {
      startAudioAnalysis();
    } else {
      console.warn(
        "Microphone disabled; falling back to text input if available."
      );
    }

    console.log("Starting interview timer");
    startTimer();
  };

  const handleNextQuestion = useCallback(async () => {
    const currentResponse = responses[currentQuestionIndex];
    if (currentResponse && sessionId) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(
            "https://www.jobraze.in/api/ai-interview/store-response",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                session_id: sessionId,
                question_index: currentQuestionIndex,
                question: questions[currentQuestionIndex]?.text,
                answer: currentResponse.answer,
                question_type:
                  questions[currentQuestionIndex]?.type || "general",
                difficulty:
                  questions[currentQuestionIndex]?.difficulty || "medium",
                time_taken: currentResponse.timeSpent || null,
              }),
            }
          );
        }
      } catch (err) {
        console.error("Error storing response:", err);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      console.log("Moving to next question");
      handleStopBoth();
      resetTranscript();
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      console.log("Last question reached, completing interview");
      handleInterviewComplete();
    }
  }, [
    currentQuestionIndex,
    questions.length,
    responses,
    sessionId,
    handleStopBoth,
    resetTranscript,
    handleInterviewComplete,
  ]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      console.log("Moving to previous question");
      handleStopBoth();
      resetTranscript();
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex, handleStopBoth, resetTranscript]);

  const handleViewResults = () => {
    setCurrentStep(STEPS.RESULTS);
  };

  const handleDownloadResults = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found");
        return;
      }

      if (!sessionId) {
        alert("No session available for download");
        return;
      }

      const res = await fetch(
        `https://www.jobraze.in/api/ai-interview/download-report/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "interview_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
      alert("Failed to download report. Please try again later.");
    }
  };

  const handleShareResults = () => {
    console.log("Sharing results...");
  };

  // Update current response when transcript changes - FIXED to prevent infinite loop
  const handleTranscriptUpdate = useCallback(
    (newTranscript) => {
      if (newTranscript && currentStep === STEPS.INTERVIEW) {
        setResponses((prev) => {
          const updated = [...prev];
          const currentResponse = updated[currentQuestionIndex] || {};

          // Only update if transcript actually changed
          if (currentResponse.answer !== newTranscript) {
            updated[currentQuestionIndex] = {
              ...currentResponse,
              answer: newTranscript,
              timestamp: new Date().toISOString(),
            };
            return updated;
          }
          return prev; // Return unchanged if no actual change
        });
      }
    },
    [currentQuestionIndex, currentStep]
  );

  // Call handleTranscriptUpdate when transcript changes
  useEffect(() => {
    handleTranscriptUpdate(transcript);
  }, [transcript, handleTranscriptUpdate]);

  // Debug effect to monitor questions state
  useEffect(() => {
    console.log("Questions state changed:", questions.length);
    console.log("Current step:", currentStep);
    console.log("Timer running:", isTimerRunning);
    console.log("Time remaining:", timeRemaining);
    console.log("Camera enabled:", cameraEnabled);
    console.log("Mic enabled:", micEnabled);
  }, [
    questions.length,
    currentStep,
    isTimerRunning,
    timeRemaining,
    cameraEnabled,
    micEnabled,
  ]);

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <WelcomeStep
            agreedToTerms={agreedToTerms}
            onAgreeChange={setAgreedToTerms}
            onNext={handleStartInterview}
          />
        );
      case STEPS.DEVICE_TEST:
        return (
          <DeviceTestStep
            onStartInterview={() => setCurrentStep(STEPS.GET_READY)}
            videoRef={videoRef}
            cameraEnabled={cameraEnabled}
            setCameraEnabled={setCameraEnabled}
            micEnabled={micEnabled}
            setMicEnabled={setMicEnabled}
          />
        );
      case STEPS.GET_READY:
        return (
          <GetReadyStep
            onStart={handleGetReadyComplete}
            interviewDuration={INTERVIEW_DURATION}
            onSessionCreated={({ sessionId, questions }) => {
              console.log("Session created with:", { sessionId, questions });
              setSessionId(sessionId);
              setQuestions(questions);
              setResponses(
                questions.map((q) => ({
                  questionId: q.id,
                  answer: "",
                  timestamp: null,
                  timeSpent: 0,
                }))
              );
            }}
          />
        );
      case STEPS.INTERVIEW:
        const currentQuestion = questions[currentQuestionIndex];
        console.log("Rendering InterviewStep with:", {
          currentQuestionIndex,
          currentQuestion,
          questionsLength: questions.length,
          timeRemaining,
          formattedTime,
        });

        if (!currentQuestion) {
          return (
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">No questions available.</p>
              <p className="text-sm text-gray-500">
                Questions: {JSON.stringify(questions)}
              </p>
              <button
                onClick={() => setCurrentStep(STEPS.GET_READY)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Go Back
              </button>
            </div>
          );
        }

        return (
          <InterviewStep
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            timeRemaining={Math.ceil(timeRemaining / 1000)}
            formattedTime={formattedTime}
            isTimerRunning={isTimerRunning}
            isRecording={isRecording}
            isSpeaking={isSpeaking || isAudioSpeaking}
            isListening={isSpeechListening}
            isPaused={isPaused}
            eyeContact={!isLookingAway}
            audioLevel={audioLevel}
            isLookingAway={isLookingAway}
            isMultipleFaces={isMultipleFaces}
            currentAnswer={responses[currentQuestionIndex]?.answer || ""}
            transcript={transcript}
            progressPercentage={(currentQuestionIndex / questions.length) * 100}
            onStartRecording={handleStartBoth}
            onStopRecording={handleStopBoth}
            onPauseRecording={handlePauseBoth}
            onResumeRecording={handleResumeBoth}
            onAnswerChange={(answer) => {
              setResponses((prev) => {
                const updated = [...prev];
                updated[currentQuestionIndex] = {
                  ...updated[currentQuestionIndex],
                  answer,
                  timestamp: new Date().toISOString(),
                };
                return updated;
              });
            }}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onSubmitInterview={handleInterviewComplete}
            canvasRef={canvasRef}
            videoRef={videoRef}
            streamRef={streamRef} // Pass streamRef to child
            error={error}
          />
        );
      case STEPS.COMPLETE:
        return (
          <CompleteStep
            isSubmitting={isSubmitting}
            evaluationError={evaluationError}
            onViewResults={handleViewResults}
            onDownload={handleDownloadResults}
            onShare={handleShareResults}
            onRetryEvaluation={() => {
              setEvaluationError(null);
              submitInterview();
            }}
          />
        );
      case STEPS.RESULTS:
        return (
          <ResultsStep
            evaluationResults={evaluationResults}
            onBack={() => setCurrentStep(STEPS.COMPLETE)}
            onDownload={handleDownloadResults}
            onShare={handleShareResults}
            questions={questions}
            responses={responses}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="interview-container">
      {renderStep()}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
