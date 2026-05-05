"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Users,
  Target,
  BookOpen,
  MessageSquare,
  Award,
} from "lucide-react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

export default function FeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    ratings: {
      easeOfUse: 0,
      clarity: 0,
      engagement: 0,
      usefulness: 0,
    },
    usefulFeatures: [],
    featureEase: {},
    likedMost: "",
    disliked: "",
    suggestions: "",
    skillImpact: "",
    satisfaction: 0,
    recommendation: 0,
    reaction: "",
    helpful: null,
  });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    title: "",
    description: "",
    variant: "default",
  });

  // Load email from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem("jobraze-user");
    console.log("localStorage jobraze-user:", user); // Debug
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("Parsed user:", parsedUser); // Debug
        if (parsedUser?.email) {
          setFormData((prev) => ({ ...prev, email: parsedUser.email }));
          setIsSubmitDisabled(false);
        } else {
          console.warn("No email found in jobraze-user");
          setToastConfig({
            title: "Authentication Required",
            description: "Please log in to submit feedback.",
            variant: "destructive",
          });
          setToastOpen(true);
          setTimeout(() => router.replace("/auth/login"), 2000); // Delay redirect for toast visibility
        }
      } catch (e) {
        console.error("Error parsing jobraze-user from localStorage:", e);
        setToastConfig({
          title: "Error",
          description: "Error loading user data. Please log in again.",
          variant: "destructive",
        });
        setToastOpen(true);
        setTimeout(() => router.replace("/auth/login"), 2000);
      }
    } else {
      console.warn("jobraze-user not found in localStorage");
      setToastConfig({
        title: "Authentication Required",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      setToastOpen(true);
      setTimeout(() => router.replace("/auth/login"), 2000);
    }
  }, [router]);

  const features = [
    { name: "AI 101", icon: "🤖", description: "Learn AI fundamentals" },
    {
      name: "Mock Assessment",
      icon: "📝",
      description: "Practice with simulated tests",
    },
    {
      name: "Skill Validation Assessment",
      icon: "✅",
      description: "Validate your expertise",
    },
    {
      name: "AI Interview Simulation",
      icon: "💼",
      description: "Practice AI-powered interviews",
    },
    {
      name: "Profile Evaluation",
      icon: "👤",
      description: "Get comprehensive profile feedback",
    },
  ];

  const handleSubmit = async () => {
    if (!formData.email) {
      setToastConfig({
        title: "Missing Email",
        description: "Email is required. Please log in.",
        variant: "destructive",
      });
      setToastOpen(true);
      return;
    }
    try {
      const response = await fetch("https://www.jobraze.in/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("token") || "mock-token"
          }`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Clear storage and log out
        localStorage.removeItem("jobraze-user");
        localStorage.removeItem("token");
        sessionStorage.clear();
        console.log("Storage cleared and user logged out");

        // Show success toast
        setToastConfig({
          title: "Feedback Submitted",
          description:
            "Thank you for your feedback! You have been logged out and will be redirected to the login page.",
          variant: "default",
        });
        setToastOpen(true);

        // Redirect to login page after a delay to show toast
        setTimeout(() => router.replace("/auth/login"), 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Failed to submit feedback:", err.message);
      setToastConfig({
        title: "Submission Error",
        description: `Error: ${err.message}. Please try again.`,
        variant: "destructive",
      });
      setToastOpen(true);
    }
  };

  const setRating = (aspect, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [aspect]: value },
    }));
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => {
      const updated = prev.usefulFeatures.includes(feature)
        ? prev.usefulFeatures.filter((f) => f !== feature)
        : [...prev.usefulFeatures, feature];
      return { ...prev, usefulFeatures: updated };
    });
  };

  const StarRating = ({ value, onChange, size = "w-6 h-6" }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className={`${size} transition-colors duration-200 ${
            value >= star
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-300 hover:text-gray-400"
          }`}
        >
          <Star className={`${size} ${value >= star ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );

  const RatingButton = ({ value, current, onClick, color = "bg-blue-600" }) => (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-200 ${
        current === value
          ? `${color} text-white border-transparent shadow-lg transform scale-110`
          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400 hover:scale-105"
      }`}
    >
      {value}
    </button>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              We Value Your Feedback
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Help us improve your learning experience by sharing your thoughts
              about our platform
            </p>
          </div>

          <div className="space-y-8">
            {/* Overall Experience Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    Overall Experience
                  </h2>
                </div>
                <p className="text-blue-100 mt-2">
                  Rate your experience on a scale of 1-5
                </p>
              </div>

              <div className="p-6 space-y-6">
                {[
                  {
                    key: "easeOfUse",
                    label: "Ease of use & navigation",
                    icon: "🧭",
                  },
                  {
                    key: "clarity",
                    label: "Clarity of content & instructions",
                    icon: "📚",
                  },
                  {
                    key: "engagement",
                    label: "Engagement & motivation",
                    icon: "⚡",
                  },
                  {
                    key: "usefulness",
                    label: "Usefulness for skill development",
                    icon: "🎯",
                  },
                ].map((aspect) => (
                  <div
                    key={aspect.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{aspect.icon}</span>
                      <Label className="font-medium text-gray-700 dark:text-gray-200">
                        {aspect.label}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <RatingButton
                          key={num}
                          value={num}
                          current={formData.ratings[aspect.key]}
                          onClick={(value) => setRating(aspect.key, value)}
                          color="bg-gradient-to-r from-blue-600 to-purple-600"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    Feature Feedback
                  </h2>
                </div>
                <p className="text-green-100 mt-2">
                  Which features did you find most valuable?
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <label key={feature.name} className="group cursor-pointer">
                      <div
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.usefulFeatures.includes(feature.name)
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Checkbox
                              checked={formData.usefulFeatures.includes(
                                feature.name
                              )}
                              onCheckedChange={() =>
                                toggleFeature(feature.name)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{feature.icon}</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {feature.name}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Open-ended Questions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    Detailed Feedback
                  </h2>
                </div>
                <p className="text-purple-100 mt-2">
                  Share your thoughts and suggestions
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    💝 What did you like most about the platform?
                  </Label>
                  <Textarea
                    placeholder="Tell us what stood out to you..."
                    value={formData.likedMost}
                    onChange={(e) =>
                      setFormData({ ...formData, likedMost: e.target.value })
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    🤔 What could be improved or was confusing?
                  </Label>
                  <Textarea
                    placeholder="Help us understand what didn't work well..."
                    value={formData.disliked}
                    onChange={(e) =>
                      setFormData({ ...formData, disliked: e.target.value })
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    💡 Any suggestions for new features or improvements?
                  </Label>
                  <Textarea
                    placeholder="Share your ideas with us..."
                    value={formData.suggestions}
                    onChange={(e) =>
                      setFormData({ ...formData, suggestions: e.target.value })
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                    🚀 How has our platform helped your skill development?
                  </Label>
                  <Textarea
                    placeholder="Describe your learning journey..."
                    value={formData.skillImpact}
                    onChange={(e) =>
                      setFormData({ ...formData, skillImpact: e.target.value })
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Satisfaction & Recommendation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    Satisfaction & Recommendation
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 block">
                    ⭐ Overall satisfaction
                  </Label>
                  <div className="flex justify-center">
                    <StarRating
                      value={formData.satisfaction}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          satisfaction: value,
                        }))
                      }
                      size="walbums/feedback/FeedbackPage.jsxw-8 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 block">
                    📢 How likely are you to recommend us? (0-10)
                  </Label>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                      <RatingButton
                        key={num}
                        value={num}
                        current={formData.recommendation}
                        onClick={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            recommendation: value,
                          }))
                        }
                        color="bg-gradient-to-r from-orange-600 to-red-600"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Feedback */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Quick Reactions
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 block">
                    How was your overall experience?
                  </Label>
                  <div className="flex justify-center gap-6">
                    {[
                      { emoji: "😃", label: "Great" },
                      { emoji: "😐", label: "Okay" },
                      { emoji: "😞", label: "Poor" },
                    ].map(({ emoji, label }) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, reaction: emoji }))
                        }
                        className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
                          formData.reaction === emoji
                            ? "bg-teal-100 dark:bg-teal-900/30 transform scale-110"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span className="text-4xl mb-2">{emoji}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 block">
                    Was this feedback form helpful?
                  </Label>
                  <div className="flex justify-center gap-4">
                    {[
                      { value: "Yes", icon: ThumbsUp, color: "text-green-600" },
                      { value: "No", icon: ThumbsDown, color: "text-red-600" },
                    ].map(({ value, icon: Icon, color }) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, helpful: value }))
                        }
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.helpful === value
                            ? "border-transparent bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            formData.helpful === value ? "text-white" : color
                          }`}
                        />
                        <span className="font-medium">{value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="button"
                onClick={handleSubmit}
                size="lg"
                disabled={isSubmitDisabled}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 ${
                  isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Feedback
              </Button>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 max-w-md mx-auto">
                🔒 Your responses are completely anonymous and secure. Thank you
                for helping us create a better learning experience for everyone!
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastViewport />
      <Toast
        open={toastOpen}
        onOpenChange={setToastOpen}
        variant={toastConfig.variant}
      >
        <ToastTitle>{toastConfig.title}</ToastTitle>
        <ToastDescription>{toastConfig.description}</ToastDescription>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// export default function FeedbackPage() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: localStorage.getItem("jobraze-user")
//       ? JSON.parse(localStorage.getItem("jobraze-user")).email
//       : "",
//     ratings: {
//       easeOfUse: 0,
//       clarity: 0,
//       engagement: 0,
//       usefulness: 0,
//     },
//     usefulFeatures: [],
//     featureEase: {},
//     likedMost: "",
//     disliked: "",
//     suggestions: "",
//     skillImpact: "",
//     satisfaction: 0,
//     recommendation: 0,
//     reaction: "",
//     helpful: null,
//   });

//   const features = [
//     "Quizzes",
//     "Interactive exercises",
//     "Progress tracking / dashboards",
//     "Skill recommendations / guidance",
//     "Gamification / rewards",
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await fetch("https://www.jobraze.in/api/feedback", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       // Clear local/session storage
//       localStorage.removeItem("jobraze-user");
//       localStorage.removeItem("token");
//       sessionStorage.clear();

//       router.replace("/auth/login");
//     } catch (err) {
//       console.error("Failed to submit feedback:", err);
//     }
//   };

//   const setRating = (aspect, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       ratings: { ...prev.ratings, [aspect]: value },
//     }));
//   };

//   const toggleFeature = (feature) => {
//     setFormData((prev) => {
//       const updated = prev.usefulFeatures.includes(feature)
//         ? prev.usefulFeatures.filter((f) => f !== feature)
//         : [...prev.usefulFeatures, feature];
//       return { ...prev, usefulFeatures: updated };
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
//       <div className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-8">
//         <h1 className="text-2xl font-bold text-center text-deep-navy dark:text-white">
//           We value your feedback!
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Section 2 - Overall Experience */}
//           <div>
//             <h2 className="font-semibold text-lg mb-2">Overall Experience</h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//               On a scale of 1–5, rate the following:
//             </p>
//             {[
//               { key: "easeOfUse", label: "Ease of use / navigation" },
//               { key: "clarity", label: "Clarity of content / instructions" },
//               { key: "engagement", label: "Engagement / motivation" },
//               { key: "usefulness", label: "Usefulness for skill development" },
//             ].map((aspect) => (
//               <div
//                 key={aspect.key}
//                 className="flex items-center justify-between mb-2"
//               >
//                 <Label className="w-1/2">{aspect.label}</Label>
//                 <div className="flex gap-2">
//                   {[1, 2, 3, 4, 5].map((num) => (
//                     <button
//                       type="button"
//                       key={num}
//                       onClick={() => setRating(aspect.key, num)}
//                       className={`w-8 h-8 rounded-full border flex items-center justify-center ${
//                         formData.ratings[aspect.key] === num
//                           ? "bg-neon-coral text-white"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {num}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Section 3 - Features */}
//           <div>
//             <h2 className="font-semibold text-lg mb-2">
//               Feature-Specific Feedback
//             </h2>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//               Which features did you find most useful? (Check all that apply)
//             </p>
//             <div className="grid grid-cols-2 gap-2">
//               {features.map((feature) => (
//                 <label key={feature} className="flex items-center gap-2">
//                   <Checkbox
//                     checked={formData.usefulFeatures.includes(feature)}
//                     onCheckedChange={() => toggleFeature(feature)}
//                   />
//                   {feature}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Section 4 - Open-ended */}
//           <div className="space-y-3">
//             <h2 className="font-semibold text-lg">Open-Ended Questions</h2>
//             <Textarea
//               placeholder="What did you like most about the app?"
//               value={formData.likedMost}
//               onChange={(e) =>
//                 setFormData({ ...formData, likedMost: e.target.value })
//               }
//             />
//             <Textarea
//               placeholder="What did you dislike or find confusing?"
//               value={formData.disliked}
//               onChange={(e) =>
//                 setFormData({ ...formData, disliked: e.target.value })
//               }
//             />
//             <Textarea
//               placeholder="Any suggestions for improvement?"
//               value={formData.suggestions}
//               onChange={(e) =>
//                 setFormData({ ...formData, suggestions: e.target.value })
//               }
//             />
//             <Textarea
//               placeholder="How has the app helped you in your skill development?"
//               value={formData.skillImpact}
//               onChange={(e) =>
//                 setFormData({ ...formData, skillImpact: e.target.value })
//               }
//             />
//           </div>

//           {/* Section 5 - Satisfaction & Recommendation */}
//           <div>
//             <h2 className="font-semibold text-lg">
//               Satisfaction & Recommendation
//             </h2>
//             <div className="flex items-center gap-2 my-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   type="button"
//                   key={star}
//                   onClick={() =>
//                     setFormData((prev) => ({ ...prev, satisfaction: star }))
//                   }
//                   className={`text-2xl ${
//                     formData.satisfaction >= star
//                       ? "text-yellow-400"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   ⭐
//                 </button>
//               ))}
//             </div>
//             <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//               How likely are you to recommend this app to a friend? (0–10)
//             </p>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {Array.from({ length: 11 }, (_, i) => i).map((num) => (
//                 <button
//                   type="button"
//                   key={num}
//                   onClick={() =>
//                     setFormData((prev) => ({ ...prev, recommendation: num }))
//                   }
//                   className={`w-8 h-8 rounded-full border flex items-center justify-center ${
//                     formData.recommendation === num
//                       ? "bg-aqua-blue text-white"
//                       : "border-gray-300 dark:border-gray-600"
//                   }`}
//                 >
//                   {num}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Section 6 - Quick/Gamified */}
//           <div>
//             <h2 className="font-semibold text-lg">Quick Feedback</h2>
//             <div className="flex gap-4 text-2xl my-2">
//               {["😃", "😐", "😞"].map((emoji) => (
//                 <button
//                   type="button"
//                   key={emoji}
//                   onClick={() =>
//                     setFormData((prev) => ({ ...prev, reaction: emoji }))
//                   }
//                   className={`p-2 rounded-full ${
//                     formData.reaction === emoji
//                       ? "bg-neon-coral/20"
//                       : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   {emoji}
//                 </button>
//               ))}
//             </div>
//             <div className="flex gap-4 mt-2">
//               {["Yes", "No"].map((opt) => (
//                 <button
//                   type="button"
//                   key={opt}
//                   onClick={() =>
//                     setFormData((prev) => ({ ...prev, helpful: opt }))
//                   }
//                   className={`px-4 py-2 rounded-md border ${
//                     formData.helpful === opt
//                       ? "bg-aqua-blue text-white"
//                       : "border-gray-300 dark:border-gray-600"
//                   }`}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-center">
//             <Button type="submit" className="w-full">
//               Submit Feedback
//             </Button>
//           </div>
//           <p className="text-xs text-center text-gray-500 mt-4">
//             Thank you for helping us improve! Your responses are completely
//             anonymous and will help us make your learning experience even
//             better.
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }
