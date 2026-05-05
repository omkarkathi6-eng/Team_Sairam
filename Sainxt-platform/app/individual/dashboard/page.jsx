"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getToken,
  isTokenExpired,
  refreshToken,
  clearAuthTokens,
} from "@/lib/auth";
import { customFetch } from "@/lib/auth-interceptor";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  User,
  BookOpen,
  Award,
  Video,
  Briefcase,
  Target,
  TrendingUp,
  Download,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  Brain,
  Shield,
  Trophy,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  {
    title: "AI101",
    href: "/individual/introductory-training",
    icon: BookOpen,
  },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: BookOpen,
  },
  { title: "View Jobs", href: "/individual/jobs", icon: Briefcase },
];

// const activityTypeMap = {
//   assessment: {
//     icon: CheckCircle,
//     color: "text-aqua-blue",
//     bgColor: "bg-aqua-blue/10",
//   },
//   training: {
//     icon: Star,
//     color: "text-electric-orange",
//     bgColor: "bg-electric-orange/10",
//   },
//   application: {
//     icon: Briefcase,
//     color: "text-neon-coral",
//     bgColor: "bg-neon-coral/10",
//   },
//   certificate: {
//     icon: Award,
//     color: "text-aqua-blue",
//     bgColor: "bg-aqua-blue/10",
//   },
// };

const activityTypeMap = {
  profile: {
    icon: Target,
    color: "text-neon-coral",
    bgColor: "bg-neon-coral/10",
  },
  certificate: {
    icon: Award,
    color: "text-aqua-blue",
    bgColor: "bg-aqua-blue/10",
  },
  training: {
    icon: Star,
    color: "text-electric-orange",
    bgColor: "bg-electric-orange/10",
  },
  assessment: {
    icon: CheckCircle,
    color: "text-aqua-blue",
    bgColor: "bg-aqua-blue/10",
  },
  self_evaluation: {
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  detailed_evaluation: {
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
  },
  actual_evaluation: {
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  interview_analysis: {
    icon: Video,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
};

const skillsData = [
  // { name: "Machine Learning", level: 85, category: "Technical", trend: "up" },
  // { name: "Python Programming", level: 92, category: "Technical", trend: "up" },
  // { name: "Data Analysis", level: 78, category: "Technical", trend: "stable" },
  // { name: "Communication", level: 88, category: "Soft Skills", trend: "up" },
  // { name: "Problem Solving", level: 90, category: "Soft Skills", trend: "up" },
];

const recentActivities = [
  // {
  //   id: 1,
  //   type: "assessment",
  //   title: "Completed Python Assessment",
  //   description: "Scored 85% - Great job!",
  //   timestamp: "2 hours ago",
  //   icon: CheckCircle,
  //   color: "text-aqua-blue",
  //   bgColor: "bg-aqua-blue/10",
  // },
  // {
  //   id: 2,
  //   type: "training",
  //   title: "Nominated for AI 101 Training",
  //   description: "Training starts next week",
  //   timestamp: "1 day ago",
  //   icon: Star,
  //   color: "text-electric-orange",
  //   bgColor: "bg-electric-orange/10",
  // },
  // {
  //   id: 3,
  //   type: "application",
  //   title: "Applied for Data Science Internship",
  //   description: "Application under review",
  //   timestamp: "3 days ago",
  //   icon: Briefcase,
  //   color: "text-neon-coral",
  //   bgColor: "bg-neon-coral/10",
  // },
  // {
  //   id: 4,
  //   type: "certificate",
  //   title: "Earned Data Analysis Certificate",
  //   description: "Certificate is ready for download",
  //   timestamp: "1 week ago",
  //   icon: Award,
  //   color: "text-aqua-blue",
  //   bgColor: "bg-aqua-blue/10",
  // },
];

const upcomingEvents = [
  {
    id: 1,
    title: "AI 101 Training Session",
    date: "Tomorrow",
    time: "2:00 PM",
    type: "Training",
    color: "bg-aqua-blue",
  },
  {
    id: 2,
    title: "Mock Interview Practice",
    date: "Friday",
    time: "10:00 AM",
    type: "Assessment",
    color: "bg-neon-coral",
  },
  {
    id: 3,
    title: "Career Guidance Session",
    date: "Next Monday",
    time: "3:00 PM",
    type: "Mentoring",
    color: "bg-electric-orange",
  },
];

export default function IndividualDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const auth = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trainingProgress, setTrainingProgress] = useState(null);
  const [profileScore, setProfileScore] = useState(null); // null = not loaded, false = no profile
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [aiResults, setAiResults] = useState(null);

  // Handle unauthorized events (e.g., when token refresh fails)
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Unauthorized access detected, redirecting to login");
      router.push("/auth/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (typeof window === "undefined") {
          setIsProfileLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No authentication token found");
          router.push("/auth/login");
          setIsProfileLoading(false);
          return;
        }

        // ✅ Hardcoded Mock Profile Bypass
        if (token.startsWith("mock_jwt_token")) {
          console.log("Mock token detected, using mock profile data");
          setUserProfile({
            id: "mock-admin-id",
            email: "admin@gmail.com",
            first_name: "Admin",
            name: "Admin User",
            userType: "individual",
            evaluation: {
              recommendations: ["Learn Advanced React", "Practice System Design"]
            }
          });
          setIsProfileLoading(false);
          return;
        }

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

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          router.push("/auth/login");
          return;
        }

        const data = await response.json();
        console.log("Fetched user profile:", data);
        setUserProfile(data);
        if (data.profile_photo_url) {
          setProfilePhotoPreview(data.profile_photo_url);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/auth/login");
      } finally {
        setIsProfileLoading(false);
      }
    };

    const fetchTrainingProgress = async () => {
      try {
        const token = getToken();
        if (!token || isTokenExpired()) {
          return;
        }

        if (token.startsWith("mock_jwt_token")) {
           setTrainingProgress({ status: "In Progress" });
           return;
        }

        const res = await fetch(
          "https://www.jobraze.in/api/user/training-progress/get",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("Training Progress:", data);
          setTrainingProgress(data);
        }
      } catch (err) {
        console.error("Failed to fetch training progress", err);
      }
    };

    fetchUserProfile();
    fetchTrainingProgress();
  }, [router]);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (token.startsWith("mock_jwt_token")) {
           setRecentActivities([
             { id: 1, title: "Mock Login", description: "Successfully logged in via mock auth", type: "assessment", timestamp: new Date().toISOString() }
           ]);
           return;
        }

        const res = await fetch("https://www.jobraze.in/api/user/activities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched activities:", data);
          setRecentActivities(data);
        } else {
          console.error("Failed to fetch activities:", await res.text());
        }
      } catch (err) {
        console.error("Failed to fetch activities", err);
      }
    }
    fetchActivities();
  }, []);

  // Check for auth and token only on client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchScore() {
      const email = auth?.user?.email || userProfile?.email;
      if (!email) return;

      // ✅ Hardcoded Mock Score Bypass
      if (email === "admin@gmail.com") {
         setProfileScore(85);
         setScoreLoading(false);
         return;
      }

      try {
        const res = await fetch(
          `https://www.jobraze.in/api/score?email=${encodeURIComponent(email)}`
        );

        const data = await res.json();

        if (data.exists) {
          setProfileScore(data.percentage);
        } else {
          setProfileScore(false); // No profile
        }
      } catch (err) {
        console.error("Failed to fetch profile score:", err);
      } finally {
        setScoreLoading(false);
      }
    }

    fetchScore();
  }, [auth?.user?.email, userProfile]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-coral"></div>
      </div>
    );
  }

  if (!auth || !localStorage.getItem("token")) {
    // Show loading state while redirecting
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-coral"></div>
        <p className="text-center text-lg text-gray-600">
          Redirecting to login...
        </p>
      </div>
    );
  }

  // Get display name with priority: userProfile > auth.user > localStorage
  const getDisplayName = () => {
    // First check the fetched user profile
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.name) return userProfile.name.split(" ")[0];

    // Then check the auth context
    if (auth.user?.first_name) return auth.user.first_name;
    if (auth.user?.name) return auth.user.name.split(" ")[0];
    if (auth.user?.email) return auth.user.email.split("@")[0];

    // Finally check parsed storedUser state (null initially, like server)
    if (storedUser?.first_name) return storedUser.first_name;
    if (storedUser?.name) return storedUser.name.split(" ")[0];
    if (storedUser?.email) return storedUser.email.split("@")[0];

    return "Individual User";
  };

  const userName = getDisplayName();
  const userEmail = userProfile?.email || user?.email || "username";

  if (isProfileLoading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user data...
      </div>
    );
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      // userName="John Doe"
      // userEmail="john@example.com"
      userName={userName}
      userEmail={userEmail}
      profilePhotoPreview={profilePhotoPreview} // Pass the profile photo preview
      setProfilePhotoPreview={setProfilePhotoPreview} // Pass the setter function
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/individual"
                className="text-text-gray hover:text-neon-coral"
              >
                Individual
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-deep-navy">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {userName}
            </h1>
            <p className="text-muted-foreground">
              Continue building your AI-powered career profile and unlock new
              opportunities with momentum
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Profile
            </Button> */}
            <Button
              size="sm"
              className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
              onClick={() => router.push("/individual/profile")}
            >
              <Target className="mr-2 h-4 w-4" />
              Complete Profile
            </Button>
          </div>
        </div>

        {/* Profile Completion Card */}
        <Card className="border-l-4 border-l-neon-coral card-ai-enhanced">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Target className="text-3xl font-bold tracking-tight text-foreground" />
                  Profile Completion Score
                </CardTitle>
                <CardDescription className="text-text-gray">
                  {scoreLoading
                    ? "Loading profile status..."
                    : profileScore === false
                    ? "Please build your profile for analysis"
                    : "Complete your profile to unlock more opportunities and build momentum"}
                </CardDescription>
              </div>

              {!scoreLoading && typeof profileScore === "number" && (
                <div className="text-right">
                  <div className="text-3xl font-bold text-neon-coral">
                    {`${profileScore}%`}
                  </div>
                  <Badge className="bg-electric-orange/10 text-electric-orange border-electric-orange/20">
                    {profileScore >= 80
                      ? "Excellent"
                      : profileScore >= 60
                      ? "Good Progress"
                      : "Needs Improvement"}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {!scoreLoading && profileScore === false ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Please complete your profile to begin analysis.
                  </p>
                  <Button
                    className="w-full bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
                    onClick={() => router.push("/individual/profile")}
                  >
                    Go to Profile Builder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                !scoreLoading &&
                typeof profileScore === "number" && (
                  <>
                    <Progress
                      value={profileScore}
                      className="h-3 bg-surface-tertiary"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-aqua-blue" />
                        <span className="text-deep-navy">Basic Info</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-aqua-blue" />
                        <span className="text-deep-navy">Skills</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-electric-orange" />
                        <span className="text-deep-navy">Experience</span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-electric-orange" />
                        <span className="text-deep-navy">Certifications</span>
                      </div> */}
                    </div>
                    <Button
                      className="w-full bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
                      onClick={() => router.push("/individual/profile")}
                    >
                      Complete Missing Sections
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-surface-tertiary">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-gray-800 dark:data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-gray-800 dark:data-[state=active]:text-white"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-gray-800 dark:data-[state=active]:text-white"
            >
              Activities
            </TabsTrigger>
            {/* <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-surface-primary data-[state=active]:text-gray-800 dark:data-[state=active]:text-white"
            >
              Schedule
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Skills Assessment Card Removed */}

              {/* Training Programs */}
              <Card className="hover:shadow-xl transition-shadow card-individual">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-aqua-blue" />
                    Training Programs
                  </CardTitle>
                  <CardDescription className="text-text-gray">
                    Enhance your skills with AI-powered training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Link href="/individual/introductory-training" passHref>
                      <div className="flex items-center justify-between p-3 border border-aqua-blue/20 rounded-lg bg-aqua-blue/5 cursor-pointer hover:bg-aqua-blue/10 transition">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            AI 101 Fundamentals
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Beginner Level
                          </p>
                        </div>
                        <Badge className="bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20">
                          start training
                        </Badge>
                      </div>
                    </Link>
                    {/* <div className="flex items-center justify-between p-3 border border-aqua-blue/20 rounded-lg bg-aqua-blue/5">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          AI 101 Fundamentals
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Beginner Level
                        </p>
                      </div>
                      <Badge className="bg-aqua-blue/10 text-aqua-blue border-aqua-blue/20">
                        Nominated
                      </Badge>
                    </div> */}
                    {/* <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          ML Level 1
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-soft-gray text-text-gray"
                      >
                        Available
                      </Badge>
                    </div> */}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                    onClick={() =>
                      router.push("/individual/introductory-training")
                    }
                  >
                    View All Programs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Certificates */}
              <Card className="hover:shadow-xl transition-shadow card-individual">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                    <Award className="h-5 w-5 text-electric-orange" />
                    My Certificates
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Download and share your achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-aqua-blue/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-aqua-blue" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            Python Basics
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Completed
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
                      >
                        <Download className="h-4 w-4 text-gray-800 dark:text-white" />
                      </Button>
                    </div> */}
                    {/* <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-electric-orange/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-electric-orange" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            Data Analysis
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Completed
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-soft-gray text-deep-navy hover:bg-surface-secondary"
                      >
                        <Download className="h-4 w-4 text-gray-800 dark:text-white" />
                      </Button>
                    </div> */}

                    {/* 🧠 Dynamic Certificate: AI101 Introductory Training */}
                    <div className="flex items-center justify-between p-3 border border-soft-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            trainingProgress?.certificateIssued
                              ? "bg-electric-orange/10"
                              : "bg-gray-100"
                          }`}
                        >
                          <Award
                            className={`h-5 w-5 ${
                              trainingProgress?.certificateIssued
                                ? "text-electric-orange"
                                : "text-gray-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            AI101 Introductory Training
                          </p>
                          <p className="text-sm text-text-gray">
                            {trainingProgress?.certificateIssued
                              ? "Completed"
                              : "In Progress"}
                          </p>
                        </div>
                      </div>
                      {trainingProgress?.certificateIssued && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            router.push("/individual/certificates")
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  >
                    View All Certificates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="skills" className="space-y-6">
            <Card className="card-individual">
              <CardHeader>
                <CardTitle className="">Your AI Learning Pathway</CardTitle>
                <CardDescription className="text-text-gray">
                  Based on your profile, here’s a recommended set of skills to
                  focus on. Completing these will strengthen your career fitment
                  in AI & Data Science.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-6">
                  {userProfile?.evaluation?.skill_pathway?.length > 0 ? (
                    userProfile.evaluation.skill_pathway.map((skill, index) => {
                      // Give progressive % and labels for a roadmap feel
                      const progressLevels = [20, 40, 60, 80, 100];
                      const labels = [
                        "Not Started",
                        "Beginner",
                        "Intermediate",
                        "Advanced",
                        "Mastery",
                      ];

                      const progress =
                        progressLevels[index % progressLevels.length];
                      const label = labels[index % labels.length];

                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-deep-navy dark:text-white">
                                {skill}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs border-soft-gray text-text-gray dark:border-gray-600 dark:text-gray-400"
                              >
                                Recommended Steps {index + 1}
                              </Badge>
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {label}
                            </span>
                          </div>
                          <Progress
                            value={progress}
                            className="h-2 bg-surface-tertiary dark:bg-gray-700"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skill recommendations available. Complete an assessment
                      to get your personalized pathway.
                    </p>
                  )}
                </div>

                <Button
                  className="w-full mt-6 bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 dark:bg-orange-600 dark:hover:bg-orange-500"
                  onClick={() => router.push("/individual/assessments")}
                >
                  Take Skills Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="card-individual">
              <CardHeader>
                <CardTitle className="">Recent Activity</CardTitle>
                <CardDescription className="">
                  Your latest achievements and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => {
                      const {
                        icon: Icon,
                        color,
                        bgColor,
                      } = activityTypeMap[activity.type] || {};
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-4 border border-soft-gray dark:border-gray-700 rounded-lg hover:bg-surface-secondary dark:hover:bg-muted/30 transition-colors"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}
                          >
                            {Icon ? (
                              <Icon className={`h-5 w-5 ${color}`} />
                            ) : (
                              <span className="text-sm">?</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-deep-navy dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-sm text-text-gray dark:text-gray-400">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-sm text-text-gray dark:text-gray-500">
                            {activity.timestamp}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-text-gray dark:text-gray-400 text-center py-4">
                      🚀 No recent activity yet — you’re still not active.
                    </p>
                  )}

                  {/* {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 p-4 border border-soft-gray dark:border-gray-700 rounded-lg hover:bg-surface-secondary dark:hover:bg-muted/30 transition-colors"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor} dark:bg-opacity-20`}
                          >
                            <Icon className={`h-5 w-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-deep-navy dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-sm text-text-gray dark:text-gray-400">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-sm text-text-gray dark:text-gray-500">
                            {activity.timestamp}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-text-gray dark:text-gray-400 text-center py-4">
                      🚀 No recent activity yet — you’re still not active.
                    </p>
                  )} */}
                </div>
              </CardContent>
            </Card>

            {/* <Card className="card-individual">
              <CardHeader>
                <CardTitle className="">Recent Activity</CardTitle>
                <CardDescription className="">
                  Your latest achievements and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border border-soft-gray dark:border-gray-700 rounded-lg hover:bg-surface-secondary dark:hover:bg-muted/30 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor} dark:bg-opacity-20`}
                        >
                          <Icon className={`h-5 w-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-deep-navy dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-text-gray dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-sm text-text-gray dark:text-gray-500">
                          {activity.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="card-individual">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-deep-navy dark:text-white">
                  <Calendar className="h-5 w-5 text-aqua-blue" />
                  Upcoming Events
                </CardTitle>
                <CardDescription className="text-text-gray dark:text-gray-400">
                  Your scheduled training sessions and assessments
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-soft-gray dark:border-gray-700 rounded-lg hover:bg-surface-secondary dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}
                        >
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-sm text-text-gray dark:text-gray-400">
                            {event.date} at {event.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-soft-gray dark:border-gray-600 text-text-gray dark:text-gray-300"
                        >
                          {event.type}
                        </Badge>
                        <Button
                          size="sm"
                          className="bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-soft-gray dark:border-gray-700 text-deep-navy dark:text-white hover:bg-surface-secondary dark:hover:bg-gray-800 transition-colors"
                >
                  View Full Calendar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
