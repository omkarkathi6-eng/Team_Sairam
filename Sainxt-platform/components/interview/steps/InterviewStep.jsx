import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Volume2,
  Clock,
  AudioLines,
} from "lucide-react";
import GoogleStyleMic from "@/components/ui/VoiceButton";

export default function InterviewStep({
  currentQuestionIndex,
  questions,
  timeRemaining,
  formattedTime,
  isTimerRunning,
  isRecording,
  isSpeaking,
  isListening,
  isPaused,
  eyeContact,
  audioLevel,
  isLookingAway,
  isMultipleFaces,
  currentAnswer,
  transcript,
  progressPercentage,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onAnswerChange,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitInterview,
  canvasRef,
  videoRef,
  error,
}) {
  const [showHint, setShowHint] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isSpeechFinished, setIsSpeechFinished] = useState(false);
  const [femaleVoice, setFemaleVoice] = useState(null);
  const [displayAnswer, setDisplayAnswer] = useState("");
  const [hasStartedRecording, setHasStartedRecording] = useState(false);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState(""); // Track processed transcript

  const questionTimerRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const transcriptRef = useRef(null);
  const questionIndexRef = useRef(currentQuestionIndex); // Track question index

  const currentQuestion = questions[currentQuestionIndex] || {};
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Auto-scroll transcript to bottom when content changes
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [displayAnswer]);

  // Load voices for text-to-speech - stable effect
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        // Try Google UK English Female
        let preferred = voices.find((v) =>
          v.name.toLowerCase().includes("google uk english female")
        );

        // Try any Google female-sounding voice
        if (!preferred) {
          preferred = voices.find((v) =>
            v.name.toLowerCase().includes("female")
          );
        }

        // Last fallback → first English voice
        if (!preferred) {
          preferred = voices.find((v) => v.lang.startsWith("en"));
        }

        // Absolute fallback → first available
        setFemaleVoice(preferred || voices[0]);
      }
    };

    loadVoices();

    // voices load asynchronously in Chrome
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Format time remaining as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Speak question function - stable callback
  const speakQuestion = useCallback(
    (questionText) => {
      if ("speechSynthesis" in window && questionText) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }

        utterance.onstart = () => {
          console.log("Started speaking question");
          setIsSpeakingQuestion(true);
          setIsSpeechFinished(false);
        };

        utterance.onend = () => {
          console.log("Finished speaking question");
          setIsSpeakingQuestion(false);
          setIsSpeechFinished(true);
        };

        utterance.onerror = () => {
          console.log("Error speaking question");
          setIsSpeakingQuestion(false);
          setIsSpeechFinished(true);
        };

        window.speechSynthesis.speak(utterance);
        speechSynthesisRef.current = utterance;
        return true;
      }
      return false;
    },
    [femaleVoice]
  );

  // Reset state when question changes - FIXED to prevent infinite loop
  useEffect(() => {
    // Only reset if question actually changed
    if (questionIndexRef.current !== currentQuestionIndex) {
      console.log(
        `Question changed from ${questionIndexRef.current} to ${currentQuestionIndex}`
      );

      questionIndexRef.current = currentQuestionIndex;
      setTimeElapsed(0);
      setIsSpeechFinished(false);
      setHasStartedRecording(false);
      setDisplayAnswer("");
      setLastProcessedTranscript(""); // Reset processed transcript tracker

      // Cancel any ongoing speech
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }

      // Clear question timer
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    }
  }, [currentQuestionIndex]);

  // Speak the question when it changes - FIXED dependency array
  useEffect(() => {
    if (questions.length > 0 && currentQuestion.text) {
      const timer = setTimeout(() => {
        console.log("Speaking question:", currentQuestion.text);
        speakQuestion(currentQuestion.text);
      }, 1000);

      return () => {
        clearTimeout(timer);
        if (speechSynthesisRef.current) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [
    currentQuestionIndex, // Trigger when the index changes
    currentQuestion.text, // Also trigger if the text itself changes
    questions.length,
    speakQuestion,
  ]);

  // useEffect(() => {
  //   if (
  //     questions.length > 0 &&
  //     currentQuestion.text &&
  //     !isRecording &&
  //     !hasStartedRecording &&
  //     !isSpeakingQuestion
  //   ) {
  //     const timer = setTimeout(() => {
  //       console.log("Speaking question:", currentQuestion.text);
  //       speakQuestion(currentQuestion.text);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timer);
  //       if (speechSynthesisRef.current) {
  //         window.speechSynthesis.cancel();
  //       }
  //     };
  //   }
  // }, [
  //   currentQuestionIndex, // Only depend on question index change
  //   questions.length,
  //   isRecording,
  //   hasStartedRecording,
  //   isSpeakingQuestion,
  //   speakQuestion,
  // ]);

  // Start recording after question has been spoken - stable effect
  useEffect(() => {
    if (isSpeechFinished && !hasStartedRecording && onStartRecording) {
      console.log("Question finished speaking, starting recording");
      setHasStartedRecording(true);
      onStartRecording();
    }
  }, [isSpeechFinished, hasStartedRecording, onStartRecording]);

  // Update display answer from transcript - FIXED to prevent infinite loop
  useEffect(() => {
    if (
      hasStartedRecording &&
      transcript &&
      transcript !== lastProcessedTranscript // Only process if transcript actually changed
    ) {
      console.log("Updating display answer with new transcript:", transcript);
      setLastProcessedTranscript(transcript);
      setDisplayAnswer(transcript);

      if (onAnswerChange) {
        onAnswerChange(transcript);
      }
    }
  }, [
    transcript,
    hasStartedRecording,
    onAnswerChange,
    lastProcessedTranscript,
  ]);

  // Update display answer from currentAnswer prop (for when switching questions) - stable effect
  useEffect(() => {
    if (
      currentAnswer &&
      !hasStartedRecording &&
      currentAnswer !== displayAnswer
    ) {
      console.log("Setting display answer from currentAnswer:", currentAnswer);
      setDisplayAnswer(currentAnswer);
      setLastProcessedTranscript(currentAnswer);
    }
  }, [currentAnswer, hasStartedRecording, displayAnswer]);

  // Start/stop question timer when recording state changes - stable effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      questionTimerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  // Navigation handlers - stable callbacks
  const handleNext = useCallback(() => {
    console.log("Next button clicked");
    if (isLastQuestion) {
      onSubmitInterview();
    } else {
      // Stop any ongoing speech before proceeding
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      onNextQuestion();
    }
  }, [isLastQuestion, onSubmitInterview, onNextQuestion]);

  const handlePrevious = useCallback(() => {
    console.log("Previous button clicked");
    if (currentQuestionIndex > 0) {
      // Stop any ongoing speech before proceeding
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      onPreviousQuestion();
    }
  }, [currentQuestionIndex, onPreviousQuestion]);

  return (
    <div className="space-y-6">
      {/* Header with progress and timer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-mono font-medium">
              {formattedTime || formatTime(timeRemaining)}
            </span>
            {isTimerRunning && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          <Badge
            variant={isLookingAway ? "destructive" : "outline"}
            className="gap-1"
          >
            {isLookingAway ? (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>Look at the camera</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>Good eye contact</span>
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Video Feed */}
        <div className="md:col-span-2 space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {/* Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Canvas for face detection */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Audio activity indicator - bottom left corner */}
            <div className="absolute bottom-4 left-4 p-2 bg-black/50 rounded-full">
              <div className="relative h-6 w-6 flex items-center justify-center">
                {/* Waveform animation */}
                <div
                  className={`absolute flex items-end h-full gap-0.5 ${
                    isSpeaking ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1 bg-white rounded-full"
                      style={{
                        height: isSpeaking
                          ? `${20 + Math.sin(Date.now() / 200 + i) * 15}%`
                          : "40%",
                        transition: "height 0.15s ease-out",
                        minHeight: "2px",
                      }}
                    />
                  ))}
                </div>

                {/* Fallback icon */}
                <GoogleStyleMic />
                {/* <AudioLines
                  className={`h-5 w-5 text-white ${
                    isSpeaking ? "opacity-0" : "opacity-100"
                  }`}
                /> */}
              </div>
            </div>

            {/* Status indicators */}
            <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
              {isRecording && (
                <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
              )}
              {isSpeaking && (
                <div className="flex items-center gap-1.5 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  <Volume2 className="h-3 w-3" />
                  <span>SPEAKING</span>
                </div>
              )}
              {isListening && (
                <div className="flex items-center gap-1.5 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  <Mic className="h-3 w-3" />
                  <span>LISTENING</span>
                </div>
              )}
              {isSpeakingQuestion && (
                <div className="flex items-center gap-1.5 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  <Volume2 className="h-3 w-3" />
                  <span>QUESTION</span>
                </div>
              )}
            </div>
          </div>

          {/* Recording controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-x-2">
              {isRecording && (
                <>
                  <Button
                    variant="destructive"
                    onClick={onStopRecording}
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                  <Button
                    variant="outline"
                    onClick={isPaused ? onResumeRecording : onPauseRecording}
                    className="gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Question timer */}
            {hasStartedRecording && (
              <div className="text-sm text-gray-600">
                Question time: {formatTime(timeElapsed)}
              </div>
            )}
          </div>
        </div>

        {/* Question and Notes */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Question</span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <Lightbulb className="h-4 w-4" />
                  {showHint ? "Hide hint" : "Show hint"}
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm">
                <p className="font-medium">{currentQuestion.text}</p>
                {showHint && currentQuestion.hint && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm">
                    <p className="font-medium text-blue-700 mb-1">Hint:</p>
                    <p className="text-blue-600">{currentQuestion.hint}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 rounded-md text-sm text-red-600 mb-4">
              {error}
            </div>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Live Transcription</span>
                <div className="flex items-center gap-1">
                  {isSpeakingQuestion ? (
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                      <span>Reading Question</span>
                    </div>
                  ) : isListening ? (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Listening</span>
                    </div>
                  ) : isSpeaking ? (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span>Speaking</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">Ready</div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={transcriptRef}
                className="min-h-32 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-200 whitespace-pre-wrap"
              >
                {displayAnswer || (
                  <p className="text-gray-400">
                    {isSpeakingQuestion
                      ? "Please listen to the question..."
                      : isListening
                      ? "Listening... Speak clearly into your microphone."
                      : isSpeaking
                      ? "Processing speech..."
                      : !hasStartedRecording && !isSpeechFinished
                      ? "The system will read the question to you shortly..."
                      : "Your speech will appear here as you talk."}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="space-x-2">
          {/* <Button
            variant="outline"
            onClick={() => {
              // Save for later functionality
              console.log("Save for later clicked");
            }}
          >
            Save for Later
          </Button> */}
          <Button
            onClick={handleNext}
            disabled={!displayAnswer && !isRecording}
          >
            {isLastQuestion ? "Submit Interview" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
