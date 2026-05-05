"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { toast } from "react-toastify";
import {
  TrendingUp,
  BrainCircuit,
  GraduationCap,
  User,
  Briefcase,
  BookOpen,
  Target,
  Award,
  Video,
  Check,
  X,
  Trophy,
  Star,
  Shield,
  Brain,
} from "lucide-react";
import { TrainingVideo } from "@/components/training/TrainingVideo";
import { SuccessAnimation } from "@/components/training/SuccessAnimation";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  {
    title: "Assessments",
    href: "/individual/assessments",
    icon: BookOpen,
  },
  {
    title: "AI101",
    href: "/individual/introductory-training",
    icon: BookOpen,
  },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: Brain,
  },
  { title: "View Jobs", href: "/individual/jobs", icon: Briefcase },
];

const videoLessons = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Understanding the basics of Artificial Intelligence",
    // duration: "5:30",
    thumbnail: "/ai-thumbnails/intro.jpg",
    videoUrl: "/videos/ai-training/ai-intro.mp4",
    category: "ai",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Core concepts of machine learning",
    // duration: "7:45",
    thumbnail: "/ai-thumbnails/ml-fundamentals.jpg",
    videoUrl: "/videos/ai-training/ml-fundamentals.mp4",
    category: "ml",
  },
];

{
  videoLessons.map((video, index) => (
    <video
      key={video.id}
      src={video.videoUrl}
      onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
      style={{ display: "none" }} // hide it from UI
    />
  ));
}

export default function AITrainingSessionPage() {
  // const { data: session } = useSession();
  const auth = useAuth();
  const router = useRouter();
  // const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [completedVideos, setCompletedVideos] = useState(new Set());
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [showMCQ, setShowMCQ] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [durations, setDurations] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("jobraze-user");

      // If not authenticated, redirect to login
      if (!token || !user) {
        router.replace("/auth/login");
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Only run on client side
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No authentication token found");
          setIsLoading(false);
          router.push("/auth/login");
          return;
        }

        console.log("Attempting to fetch user profile...");

        try {
          const response = await fetch(
            "https://www.jobraze.in/api/user/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          console.log("Profile response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Successfully fetched user profile:", data);
          setUserProfile(data);

          if (data.profile_photo_url) {
            setProfilePhotoPreview(data.profile_photo_url);
          }

          // Update the auth context with the full user data
          if (auth.setUser) {
            auth.setUser((prev) => ({
              ...prev,
              ...data,
              first_name: data.first_name || prev?.first_name,
            }));
          }
        } catch (error) {
          console.error("Error in fetchUserProfile:", error);
          if (error.message.includes("Failed to fetch")) {
            console.error(
              "Backend server might be down or unreachable at https://www.jobraze.in"
            );
            // Show user-friendly error message
            alert(
              "Unable to connect to the server. Please check your internet connection or try again later."
            );
          } else if (
            error.message.includes("401") ||
            error.message.includes("403")
          ) {
            console.error("Authentication error, redirecting to login");
            router.push("/auth/login");
          }
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://www.jobraze.in/api/user/training-progress/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.completedVideos) {
          setCompletedVideos(new Set(data.completedVideos));
        }
        if (data.watchedVideos) {
          setWatchedVideos(new Set(data.watchedVideos));
        }

        if (data.certificateIssued) {
          setCurrentVideoIndex(videoLessons.length - 1);
          // Don't call setShowSuccess here to prevent popup
        } else if (data.completedVideos?.length > 0) {
          const lastCompleted = Math.max(...data.completedVideos);
          setCurrentVideoIndex(
            lastCompleted + 1 < videoLessons.length
              ? lastCompleted + 1
              : lastCompleted
          );
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    // fetchUserProfile().then(fetchProgress);
    fetchUserProfile();
    fetchProgress();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-neon-coral" />
      </div>
    );
  }

  const userName =
    userProfile?.first_name ||
    auth?.user?.first_name ||
    auth?.user?.name ||
    "User";
  const userEmail = userProfile?.email || auth?.user?.email || "";

  const currentVideo = videoLessons[currentVideoIndex];
  const allVideosCompleted = completedVideos.size === videoLessons.length;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isVideoWatched = watchedVideos.has(currentVideoIndex);

  const saveProgressToServer = async ({
    completedVideos,
    watchedVideos,
    certificateIssued,
  }) => {
    try {
      const token = localStorage.getItem("token");

      await fetch("https://www.jobraze.in/api/user/training-progress/save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completedVideos,
          watchedVideos,
          certificateIssued,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleLoadedMetadata = (index, event) => {
    const videoDuration = event.target.duration; // in seconds
    const minutes = Math.floor(videoDuration / 60);
    const seconds = Math.floor(videoDuration % 60)
      .toString()
      .padStart(2, "0");

    setDurations((prev) => ({
      ...prev,
      [index]: `${minutes}:${seconds}`,
    }));
  };

  const getTotalDuration = () => {
    const allDurations = Object.values(durations);

    if (allDurations.length === 0) return "0 min";

    let totalSeconds = 0;
    allDurations.forEach((time) => {
      const [min, sec] = time.split(":").map(Number);
      totalSeconds += min * 60 + sec;
    });

    const totalMinutes = Math.ceil(totalSeconds / 60);
    return `${totalMinutes} min`;
  };

  const handleVideoComplete = () => {
    // Mark video as watched
    const newWatchedVideos = new Set(watchedVideos);
    newWatchedVideos.add(currentVideoIndex);
    setWatchedVideos(newWatchedVideos);
  };

  const handleVideoSelect = (index) => {
    const isUnlocked = index === 0 || completedVideos.has(index - 1);
    if (!isUnlocked) {
      toast.error("Please complete the previous lesson first");
      return;
    }

    // Pause current video if playing
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setCurrentVideoIndex(index);
    if (videoContainerRef.current) {
      videoContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const startMCQ = async () => {
    try {
      // Get the current video's category (default to 'ai' for the first video)
      const category = currentVideo?.category || "ai";

      const response = await fetch(
        `https://www.jobraze.in/api/mcqs/start-assignment?category=${category}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setQuestions(data.questions || []);
      setShowMCQ(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setScore(null);

      // Pause the video when starting the assignment
      if (videoRef.current && videoRef.current.pause) {
        videoRef.current.pause();
      } else if (
        videoRef.current &&
        videoRef.current.videoRef &&
        videoRef.current.videoRef.current
      ) {
        // If using a forwarded ref to the TrainingVideo component
        videoRef.current.videoRef.current.pause();
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert(`Failed to load questions: ${error.message}`);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://www.jobraze.in/api/mcqs/submit-assignment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: userName, // Send user's name from session
            email: userEmail,
            answers: questions.map((q, index) => ({
              question: q.question,
              answer: selectedAnswers[index] || "",
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit answers");
      }

      const result = await response.json();
      setScore(result);

      // If score is perfect (10/10), show success animation
      if (result.score === result.total) {
        const newCompletedVideos = new Set(completedVideos);
        // newCompletedVideos.add(0); // Mark first video as completed
        newCompletedVideos.add(currentVideoIndex); // ✅ dynamic
        setCompletedVideos(newCompletedVideos);
        setShowSuccess(true);
        saveProgressToServer({
          completedVideos: Array.from(newCompletedVideos),
          watchedVideos: Array.from(watchedVideos),
          certificateIssued: newCompletedVideos.size === videoLessons.length,
        });
      }
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert(`Failed to submit answers: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakeTest = () => {
    setShowMCQ(false);
    setScore(null);

    // Reset the video to the beginning
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .catch((e) => console.error("Error replaying video:", e));
    }
  };

  const handleContinueToNextVideo = () => {
    // Mark current video as completed
    const newCompletedVideos = new Set(completedVideos);
    newCompletedVideos.add(currentVideoIndex);
    setCompletedVideos(newCompletedVideos);

    const isFinalVideo = currentVideoIndex === videoLessons.length - 1;

    // If this is the final video, show certificate options
    if (isFinalVideo) {
      // Show success message with certificate option
      setShowSuccess(true);
      return;
    }

    // Move to next video if available
    if (currentVideoIndex < videoLessons.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      if (videoRef.current) {
        videoRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Reset assignment state
    setShowSuccess(false);
    setShowMCQ(false);
    setScore(null);
    setQuestions([]);
    setSelectedAnswers({});
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {showSuccess && (
        <SuccessAnimation
          onContinue={() => {
            // Redirect to certificate page when continuing from final video
            if (currentVideoIndex === videoLessons.length - 1) {
              window.location.href =
                "/individual/certificates/ai-training-certificate";
            } else {
              handleContinueToNextVideo();
            }
          }}
          isFinalVideo={currentVideoIndex === videoLessons.length - 1}
          userName={userName}
          userEmail={userEmail}
        />
      )}
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
        userName={userName}
        userEmail={userEmail}
        profilePhotoPreview={profilePhotoPreview}
        setProfilePhotoPreview={setProfilePhotoPreview}
        // userEmail={session?.user?.email || ""}
        className="!p-0"
      >
        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                AI Training Session
              </h2>
              {/* <p className="text-sm text-gray-500 mt-1">
                5 lessons • 37 minutes • Interactive Learning
              </p> */}
              <p className="text-sm text-gray-500 mt-1">
                {videoLessons.length} lessons • {getTotalDuration()} •
                Interactive Learning
              </p>
            </div>
            <div className="p-2">
              {videoLessons.map((video, index) => {
                const isCompleted = completedVideos.has(index);
                const isUnlocked =
                  index === 0 || completedVideos.has(index - 1);
                const isCurrent = currentVideoIndex === index;

                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      // Show toast for the clicked video
                      if (isUnlocked) {
                        toast({
                          title: `🎬 ${video.title}`,
                          description: `Loading video: ${video.description}`,
                        });
                        handleVideoSelect(index);
                      } else {
                        toast({
                          title: "🔒 Video Locked",
                          description: `"${video.title}" is locked. Please complete the previous video first.`,
                          variant: "destructive",
                        });
                      }
                    }}
                    className={`p-3 rounded-lg mb-2 transition-colors ${
                      isCurrent ? "bg-blue-50 border border-blue-200" : ""
                    } ${
                      isUnlocked
                        ? "cursor-pointer hover:bg-gray-50"
                        : "cursor-not-allowed bg-gray-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative w-16 h-10 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isCompleted ? (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          ) : isUnlocked ? (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-500">
                                {index + 1}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center bg-yellow-100 text-yellow-800 text-2xl font-bold rounded-full px-3 py-1 shadow">
                              🔒
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isUnlocked ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {video.title}
                        </p>
                        <div className="flex items-center mt-0.5">
                          {/* <span className="text-xs text-gray-500">
                            {video.duration}
                          </span> */}
                          <span className="text-xs text-gray-500">
                            {durations[index] || "Loading..."}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hidden videos for preloading metadata */}
          {videoLessons.map((video, index) => (
            <video
              key={video.id}
              src={video.videoUrl}
              onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
              style={{ display: "none" }}
            />
          ))}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentVideo.title}
                </h1>
                <p className="text-gray-600">{currentVideo.description}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span>
                    Lesson {currentVideoIndex + 1} of {videoLessons.length}
                  </span>
                  <span className="mx-2">•</span>
                  {/* <span>{currentVideo.duration} min</span> */}
                  <span>
                    {durations[currentVideoIndex] || "Loading..."} min
                  </span>
                </div>
              </div>

              {!showMCQ ? (
                <div
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                  ref={videoContainerRef}
                >
                  <TrainingVideo
                    ref={videoRef}
                    videoSrc={currentVideo.videoUrl}
                    onVideoComplete={handleVideoComplete}
                    className="w-full aspect-video"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  {score ? (
                    <div className="text-center py-8">
                      <div
                        className={`text-4xl font-bold mb-4 ${
                          score.score === score.total
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {score.score} / {score.total}
                      </div>
                      <p className="text-lg mb-6">
                        {score.score === score.total
                          ? "Congratulations! You passed the assessment."
                          : "You need to score 10/10 to proceed. Please watch the video again and retake the test."}
                      </p>

                      <div className="mt-6 space-y-4 text-left max-w-2xl mx-auto">
                        {score.result.map((item, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg ${
                              item.is_correct ? "bg-green-50" : "bg-red-50"
                            }`}
                          >
                            <div className="font-medium">
                              Q: {item.question}
                            </div>
                            <div className="mt-1 text-sm">
                              <span className="font-medium">Your answer:</span>{" "}
                              {item.your_answer}
                              {!item.is_correct && (
                                <span className="ml-2">
                                  <span className="font-medium">
                                    (Correct answer: {item.correct_answer})
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        {score.score === score.total ? (
                          <Button
                            onClick={handleContinueToNextVideo}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Continue to Next Lesson
                          </Button>
                        ) : (
                          <Button
                            onClick={retakeTest}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Watch Video Again & Retake Test
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Question {currentQuestionIndex + 1} of{" "}
                            {questions.length}
                          </span>
                          <span className="text-sm text-gray-500">
                            {Object.keys(selectedAnswers).length} of{" "}
                            {questions.length} answered
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                ((currentQuestionIndex + 1) /
                                  questions.length) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-6">
                          {currentQuestion?.question}
                        </h3>

                        <div className="space-y-3">
                          {currentQuestion?.options?.map((option, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleAnswerSelect(option)}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedAnswers[currentQuestionIndex] === option
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4 border-t">
                        <Button
                          onClick={handlePreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                          variant="outline"
                        >
                          Previous
                        </Button>

                        {isLastQuestion ? (
                          <Button
                            onClick={handleSubmit}
                            disabled={
                              !selectedAnswers[currentQuestionIndex] ||
                              isSubmitting
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNextQuestion}
                            disabled={!selectedAnswers[currentQuestionIndex]}
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Lesson {currentVideoIndex + 1} of {videoLessons.length}
                </div>

                <div className="flex space-x-3">
                  {currentVideoIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => handleVideoSelect(currentVideoIndex - 1)}
                    >
                      Previous Lesson
                    </Button>
                  )}

                  {isVideoWatched &&
                  !completedVideos.has(currentVideoIndex) &&
                  !showMCQ ? (
                    <Button
                      onClick={startMCQ}
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Take Assignment
                    </Button>
                  ) : currentVideoIndex < videoLessons.length - 1 &&
                    !showMCQ ? (
                    <Button
                      onClick={() => handleVideoSelect(currentVideoIndex + 1)}
                      variant="default"
                    >
                      Next Lesson
                    </Button>
                  ) : allVideosCompleted ? (
                    <Button
                      onClick={() => {
                        // Handle final assessment start
                        window.location.href =
                          "/individual/assessments/ai-training-assessment";
                      }}
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start Assessment
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  About This Lesson
                </h2>
                <p className="text-gray-700">
                  {currentVideo.description} This lesson is part of our
                  comprehensive AI Training Series designed to give you a solid
                  foundation in artificial intelligence concepts and
                  applications.
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Lesson Content
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
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
                      <span>Introduction to key concepts</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
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
                      <span>Real-world examples and applications</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
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
                      <span>Practical demonstrations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
