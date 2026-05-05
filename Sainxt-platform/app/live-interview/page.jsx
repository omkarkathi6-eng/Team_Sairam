"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Settings,
  CreditCard,
  UserPlus,
} from "lucide-react";

const LiveInterview = ({ username: propUsername }) => {
  const router = useRouter();
  const [username, setUsername] = useState(propUsername || "");
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [userSpeech, setUserSpeech] = useState("Waiting for your answer...");
  const [status, setStatus] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [userResponses, setUserResponses] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [isAssignedInterview, setIsAssignedInterview] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Ensure we're in the browser before accessing sessionStorage
    if (typeof window !== "undefined") {
      const interViewData = JSON.parse(
        sessionStorage.getItem("interviewData") || "null"
      );

      if (interViewData?.interview_id) {
        setSelectedJdId(interViewData.interview_id);
      }
    }
  }, []);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Use useRef for Web Speech API instances
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const selectedVoiceRef = useRef(null);

  const silenceTimerRef = useRef(null);
  const thinkingTimerRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const finalTranscriptAccumulatedRef = useRef("");

  // Set up default voice
  const setDefaultVoice = useCallback(() => {
    const synth = speechSynthRef.current;
    if (!synth) return;

    const voices = synth.getVoices();
    const defaultVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("zira") ||
            v.name.toLowerCase().includes("alena") ||
            (v.name.toLowerCase().includes("google us english") &&
              v.name.toLowerCase().includes("female")))
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    selectedVoiceRef.current = defaultVoice;
    console.log("Selected default voice:", defaultVoice?.name);
  }, []);

  // Function to stop speech recognition
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
      isRecognizingRef.current = false;
      clearTimeout(silenceTimerRef.current);
      clearTimeout(thinkingTimerRef.current);
      console.log("Recognition stopped.");
      setStatus("Stopped listening.");
    }
  }, []);

  // Function to start speech recognition
  const startRecognition = useCallback(() => {
    const synth = window.speechSynthesis;

    if (synth.speaking || synth.pending) {
      console.log("🔇 Blocking recognition — speechSynthesis still active.");
      return;
    }

    if (recognitionRef.current && !isRecognizingRef.current) {
      try {
        finalTranscriptAccumulatedRef.current = "";
        setUserSpeech("Listening...");
        recognitionRef.current.start();
        isRecognizingRef.current = true;
        setStatus("🎙 Listening...");
        console.log("✅ Speech recognition started.");
      } catch (e) {
        console.error("Recognition error:", e);
        setStatus(`⚠ Error starting recognition: ${e.message}`);
      }
    } else {
      console.log("🛑 Recognition already running or uninitialized.");
    }
  }, []);

  // Reset silence timer
  const resetSilenceTimer = useCallback(() => {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      if (isRecognizingRef.current) {
        console.log("5 seconds of silence detected, stopping recognition.");
        setStatus("Silence detected. Processing...");
        stopRecognition();
      }
    }, 5000);
  }, [stopRecognition]);

  // Start thinking timer
  const startThinkingTimer = useCallback(() => {
    clearTimeout(thinkingTimerRef.current);
    thinkingTimerRef.current = setTimeout(() => {
      if (
        currentIndex < currentQuestions.length &&
        !isRecognizingRef.current &&
        isInterviewStarted
      ) {
        console.log("2 seconds thinking time passed, restarting recognition.");
      } else if (currentIndex >= currentQuestions.length) {
        setStatus("Interview completed. Awaiting submission.");
      } else if (!isInterviewStarted) {
        setStatus("Interview not active. Recognition will not restart.");
      }
    }, 2000);
  }, [currentIndex, currentQuestions.length, isInterviewStarted]);

  // Function to speak questions aloud
  const speakQuestion = useCallback(
    (text, callback) => {
      const synth = window.speechSynthesis;

      // ⛔ Stop recognition to avoid overlap
      stopRecognition();

      if (!synth) {
        console.error("Speech synthesis not available.");
        setStatus("Speech synthesis unavailable.");
        callback && callback(); // fallback
        return;
      }

      // 🔁 Safely cancel speech first
      synth.cancel();

      // 💡 Give time for speech engine to flush the cancellation
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();

        const selectedVoice =
          voices.find((v) => v.name === "Google US English") ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.pitch = 1;
        utterance.rate = 0.9;

        utterance.onstart = () => {
          finalTranscriptAccumulatedRef.current = "";
          setUserSpeech("Waiting for response...");
          setStatus("🗣️ Speaking question...");
          setIsSpeaking(true); // <-- Track speech is happening
          console.log("Speech started.");
        };

        utterance.onend = () => {
          setStatus("Finished speaking. Ready to listen.");
          setIsSpeaking(false); // <-- Speech ended
          setTimeout(() => {
            startRecognition();
          }, 500);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error);
          setStatus(`Speech Error: ${event.error}`);
          callback?.(); // fail-safe
        };

        synth.speak(utterance);
      }, 100); // ✅ Small buffer after `cancel()`
    },
    [setStatus, stopRecognition]
  );

  // Timer effect
  useEffect(() => {
    if (isInterviewStarted && isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            setStatus("Time is up! Please submit your interview.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isInterviewStarted, isTimerRunning]);

  // Core useEffect for Web Speech API Initialization
  useEffect(() => {
    speechSynthRef.current = window.speechSynthesis;

    // Speech Recognition Setup
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        isRecognizingRef.current = true;
        setStatus("🎙 Listening...");
        clearTimeout(thinkingTimerRef.current);
        console.log("Speech Recognition: Started.");
      };

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let currentFinalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentFinalChunk += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        finalTranscriptAccumulatedRef.current += currentFinalChunk;
        setUserSpeech(
          (finalTranscriptAccumulatedRef.current + interimTranscript).trim() ||
            "..."
        );
        resetSilenceTimer();
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error, event);
        isRecognizingRef.current = false;
        clearTimeout(silenceTimerRef.current);
        clearTimeout(thinkingTimerRef.current);

        switch (event.error) {
          case "not-allowed":
            setStatus(
              "🚫 Microphone access denied. Please enable in browser settings and reload the page."
            );
            break;
          case "network":
            setStatus(
              "🌐 Network error with speech recognition service. Check internet connection."
            );
            break;
          case "no-speech":
            setStatus("Silence detected or no clear speech. Trying again...");
            break;
          case "audio-capture":
            setStatus(
              "🎤 No microphone found or in use by another application. Ensure mic is plugged in and not busy."
            );
            break;
          case "aborted":
            setStatus("Operation aborted.");
            break;
          default:
            setStatus(
              `⚠ Speech Recognition Error: ${event.error}. See console for details.`
            );
        }
      };

      recognitionRef.current.onend = () => {
        isRecognizingRef.current = false;
        console.log(
          "Speech Recognition: Ended. Current accumulated:",
          finalTranscriptAccumulatedRef.current
        );
        setUserSpeech(finalTranscriptAccumulatedRef.current.trim() || "...");

        if (isInterviewStarted && currentIndex < currentQuestions.length) {
          setStatus("🎙 Restarting listening...");

          // Optional: Short delay to avoid "recognition not allowed" errors in some browsers
          setTimeout(() => {
            if (!isRecognizingRef.current) {
              recognitionRef.current.start();
            }
          }, 250);
        } else if (currentIndex >= currentQuestions.length) {
          setStatus("Interview Completed. Awaiting submission.");
        } else {
          setStatus("Speech recognition ended.");
        }
      };
    } else {
      alert(
        "Speech Recognition is not supported in this browser. Please use Chrome or Edge for full functionality."
      );
      setStatus("Speech Recognition not supported.");
    }

    // Cleanup function
    return () => {
      stopRecognition();
      clearTimeout(silenceTimerRef.current);
      clearTimeout(thinkingTimerRef.current);
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      }
      if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [
    stopRecognition,
    startThinkingTimer,
    resetSilenceTimer,
    currentIndex,
    currentQuestions.length,
    isInterviewStarted,
  ]);

  // Effect for setting up voices
  useEffect(() => {
    const synth = speechSynthRef.current;
    if (!synth) return;

    const handleVoicesChanged = () => {
      setDefaultVoice();
    };

    // Try to get voices immediately
    const initialVoices = synth.getVoices();
    if (initialVoices.length > 0) {
      handleVoicesChanged();
    }

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = handleVoicesChanged;
    } else {
      console.warn(
        "onvoiceschanged event not supported by this browser. Voice selection might be less reliable."
      );
    }
  }, [setDefaultVoice]);

  // Effect for fetching job descriptions
  useEffect(() => {
    const fetchJobDescriptions = async () => {
      try {
        const response = await fetch(
          "https://www.jobraze.in/api/jd/get_job_descriptions"
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setJobDescriptions(data.job_descriptions || []);
        } else {
          console.error("Failed to fetch job descriptions");
        }
      } catch (error) {
        console.error("Error fetching job descriptions:", error);
      }
    };

    if (!isAssignedInterview) {
      fetchJobDescriptions();
    }

    // Handle assigned interview data
    const storedInterviewData = sessionStorage.getItem("interviewData");
    if (storedInterviewData) {
      const parsedData = JSON.parse(storedInterviewData);
      setInterviewData(parsedData);
      setUsername(parsedData.candidate_name || propUsername || "");
      setIsAssignedInterview(true);

      let questions = parsedData.questions || [];
      questions = questions.filter((q) => q && q.trim() !== "");
      const processedQuestions = questions.map((q) =>
        q.replace(/^\d+\.\s*/, "")
      );

      setCurrentQuestions(processedQuestions);
      setStatus(
        `Assigned interview loaded: ${processedQuestions.length} questions.`
      );
    }
  }, [isAssignedInterview, propUsername]);

  // Effect for fetching questions when a job description is selected
  useEffect(() => {
    if (isAssignedInterview || !selectedJdId) return;

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://www.jobraze.in/api/jd/get_questions/${selectedJdId}`
        );
        if (response.ok) {
          const data = await response.json();
          let questions = data.questions || [];

          questions = questions.filter((q) => q && q.trim() !== "");
          const processedQuestions = questions.map((q) =>
            q.replace(/^\d+\.\s*/, "")
          );

          setCurrentQuestions(processedQuestions);
          setCurrentIndex(0);
          setUserResponses([]);
          setStatus(
            `Loaded ${processedQuestions.length} questions. Ready to start interview.`
          );
        } else {
          console.error("Failed to fetch questions");
          setStatus("Failed to load interview questions. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setStatus("Network error. Please check your connection and try again.");
      }
    };

    fetchQuestions();
  }, [selectedJdId, isAssignedInterview]);

  // Interview flow logic
  const nextQuestion = useCallback(() => {
    stopRecognition();

    const currentResponse = finalTranscriptAccumulatedRef.current.trim();
    setUserResponses((prev) => {
      const newResponses = [...prev];
      newResponses[currentIndex] = currentResponse;
      return newResponses;
    });

    finalTranscriptAccumulatedRef.current = "";
    setUserSpeech("Waiting for your answer...");

    const nextIndex = currentIndex + 1;
    if (nextIndex < currentQuestions.length) {
      setCurrentIndex(nextIndex);
      setStatus("Moving to next question...");
      speakQuestion(currentQuestions[nextIndex]);
    } else {
      setStatus("All questions answered. Please submit your interview.");
      setIsInterviewStarted(false);
    }
  }, [currentIndex, currentQuestions, stopRecognition, speakQuestion]);

  const handleSubmitInterview = async () => {
    setSubmissionStatus("submitting");
    stopRecognition();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      setIsTimerRunning(false);
    }

    try {
      const currentResponse = finalTranscriptAccumulatedRef.current.trim();
      const updatedResponses = [...userResponses];

      if (currentIndex === currentQuestions.length - 1 && currentResponse) {
        updatedResponses[currentIndex] = currentResponse;
      }

      // Ensure we have the latest interview data
      const interviewId = interviewData?._id || selectedJdId;
      if (!interviewId) {
        throw new Error("Missing interview ID");
      }

      // Get the job_description_id from interviewData if available
      const jobDescriptionId = interviewData?.job_description_id || interviewId;

      const formattedResponses = currentQuestions.map((question, index) => ({
        question: question,
        answer: updatedResponses[index] || "",
      }));

      // Get the candidate's name from the interview data or use defaults
      const candidateName =
        interviewData?.candidate_name ||
        interviewData?.assigned_to ||
        username ||
        "Interviewee";

      // Get candidate email from interview data (stored in candidate_email) or use the username if it looks like an email
      const candidateEmail =
        interviewData?.candidate_email ||
        (username.includes("@") ? username : "");

      // Get job description from interview data or use a default
      const jobDescription =
        interviewData?.job_description ||
        interviewData?.job_description_text ||
        "Interview";

      // Debug log the request payload
      const requestBody = {
        username: candidateName,
        email: candidateEmail, // Add email to the request
        job_description_id: jobDescriptionId,
        job_description: jobDescription,
        responses: formattedResponses,
      };

      console.log(
        "Submitting interview with data:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(
        "https://www.jobraze.in/api/jd/submit_interview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid response from server");
      }

      console.log("Server response:", response.status, responseData);

      if (response.ok) {
        setSubmissionStatus("success");
        // Show success message for 3 seconds before redirecting
        setTimeout(() => {
          router.push("/thank-you");
        }, 3000);
      } else {
        throw new Error(
          responseData.error ||
            responseData.message ||
            `Server responded with status ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error submitting interview:", error);
      setSubmissionStatus(`error: ${error.message}`);
    }
  };

  const startInterview = useCallback(() => {
    if (!selectedJdId) {
      alert("Please select a job description");
      return;
    }
    if (currentQuestions.length === 0) {
      alert(
        "No questions available for this job description. Please select a different JD."
      );
      return;
    }
    setIsInterviewStarted(true);
    setIsTimerRunning(true);
    setStatus("Interview starting... Get ready!");
    speakQuestion(currentQuestions[0]);
  }, [selectedJdId, currentQuestions, speakQuestion]);

  if (submissionStatus === "Interview submitted successfully!") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">JD Interview Session</h1>
        <p className="text-muted-foreground">
          The JD Interview Session provides a structured, automated interview
          process that aligns directly with the requirements of a specific Job
          Description, ensuring targeted and efficient candidate evaluation.
        </p>
      </div>
      {!isInterviewStarted ? (
        <div className="interview-setup">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page heading */}

            {/* Subscription & Billing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Assigned Interview
                </CardTitle>
                <CardDescription>
                  You have been invited to participate in a structured interview
                  session. Below you will find all the essential information
                  about this interview, including the assigning recruiter, the
                  number of questions, and the relevant job description. Prepare
                  to begin when you are ready.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Plan Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Billing button */}
                  <div className="flex items-end">
                    <Button>
                      <div onClick={startInterview}>Start Test</div>
                    </Button>
                  </div>
                </div>

                {/* Plan Features Info Box */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Interview Details
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>
                      • Assigned By :{" "}
                      {interviewData?.assigned_by || "Recruiter"}
                    </li>
                    <li>• Questions : {currentQuestions?.length}</li>
                    <li>
                      • Job Description :{" "}
                      {interviewData?.job_description ? (
                        <span className="jd-text">
                          {interviewData?.job_description}
                        </span>
                      ) : (
                        <span className="no-jd">
                          No job description provided
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="interview-container">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Question {currentIndex + 1}/{currentQuestions.length}
                </CardTitle>
                <Button variant="outline" size="sm">
                  Time Remaining : {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </Button>
              </div>
              <CardDescription>
                {currentQuestions[currentIndex] || "Loading question..."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Plan Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing button */}
              </div>

              {/* Plan Features Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Your Speech:{" "}
                  <p
                    style={{
                      color: "var(--primary)",
                      fontWeight: "500",
                      backgroundColor: "var(--background-light)",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {status}
                  </p>
                </h4>
                <div className="space-y-1 text-sm text-blue-700">
                  {userSpeech}
                </div>
              </div>
            </CardContent>
            <div className="flex items-center justify-end pr-5 pb-5">
              {currentIndex < currentQuestions.length - 1 ? (
                <Button>
                  <div
                    onClick={nextQuestion}
                    disabled={
                      isSpeaking || // ⛔ Disable if speaking
                      (isRecognizingRef.current &&
                        finalTranscriptAccumulatedRef.current === "")
                    }
                  >
                    Next Question
                  </div>
                </Button>
              ) : currentIndex === currentQuestions.length - 1 ? (
                <Button>
                  <div
                    disabled={submissionStatus.includes("submitting")}
                    onClick={handleSubmitInterview}
                  >
                    {" "}
                    {submissionStatus.includes("submitting")
                      ? "Submitting..."
                      : "Submit Interview"}
                  </div>
                </Button>
              ) : (
                <Button>
                  <div>All Questions Answered</div>
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {submissionStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            {submissionStatus === "submitting" ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Submitting your interview...
                </h3>
                <p className="text-gray-600">
                  Please wait while we save your responses.
                </p>
              </div>
            ) : submissionStatus === "success" ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thank you for participating!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your responses have been successfully submitted.
                </p>
                <p className="text-sm text-gray-500">
                  You'll be redirected shortly...
                </p>
              </div>
            ) : submissionStatus.startsWith("error:") ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Submission Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  {submissionStatus.replace("error:", "").trim()}
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setSubmissionStatus("")}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSubmitInterview}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveInterview;
