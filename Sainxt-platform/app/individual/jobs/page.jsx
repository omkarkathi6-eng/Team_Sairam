"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  User,
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Sparkles,
  Brain,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Video,
  X,
  RefreshCw,
  Cpu,
  Database,
  BarChart2,
  Code,
  Zap,
  Server,
  Layers,
  Shield,
  Cloud,
  GitBranch,
  Cpu as CpuIcon,
  Bot,
  Network,
  MessageSquare,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/jobs/JobCard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { aiSpecializations, trendingSkills } from "@/data/jobsData";

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

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [activeSpecialization, setActiveSpecialization] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const isLoading = isJobsLoading || isProfileLoading;

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

  // Load hardcoded professional job listings
  useEffect(() => {
    const loadJobs = () => {
      try {
        setIsJobsLoading(true);
        const professionalJobs = [
          {
            id: "1",
            title: "Senior AI/ML Engineer",
            company: "TechNova AI Solutions",
            location: "Bengaluru, India(Remote)",
            type: "Full-time",
            salary: "$150,000 - $200,000/year",

            match: 92,
            posted: "2 days ago",
            description:
              "We are looking for an experienced AI/ML Engineer to join our team. You will be responsible for developing and implementing machine learning models, designing algorithms, and working with large datasets to solve complex problems.",
            requirements: [
              "5+ years of experience in machine learning and artificial intelligence",
              "Strong programming skills in Python and experience with ML frameworks like TensorFlow or PyTorch",
              "Experience with natural language processing and computer vision",
              "Knowledge of cloud platforms (AWS, GCP, or Azure)",
              "Strong problem-solving and analytical skills",
            ],
            skills: [
              "Machine Learning",
              "Python",
              "TensorFlow",
              "NLP",
              "Computer Vision",
              "AWS",
            ],
            aiFocus: [
              "Machine Learning",
              "Deep Learning",
              "NLP",
              "Computer Vision",
            ],
          },
          {
            id: "2",
            title: "Data Scientist - AI Research",
            company: "DataInsight Labs",
            location: "Hyderabad, India (Hybrid)",
            type: "Full-time",
            salary: "$130,000 - $180,000/year",
            match: 87,
            posted: "1 week ago",
            description:
              "Join our AI research team to develop cutting-edge machine learning models and algorithms. You will work on challenging problems in natural language understanding and predictive analytics.",
            requirements: [
              "PhD or Master's degree in Computer Science, Statistics, or related field",
              "3+ years of experience in data science and machine learning",
              "Strong background in statistics and experimental design",
              "Experience with big data technologies (Spark, Hadoop, etc.)",
              "Excellent communication and collaboration skills",
            ],
            skills: [
              "Data Science",
              "Python",
              "R",
              "Spark",
              "Machine Learning",
              "Statistics",
            ],
            aiFocus: ["Data Science", "Machine Learning", "NLP", "Big Data"],
          },
          {
            id: "3",
            title: "AI Product Manager",
            company: "FutureTech Innovations",
            location: "Pune, India (Remote)",
            type: "Full-time",
            salary: "$140,000 - $190,000/year",
            match: 84,
            posted: "3 days ago",
            description:
              "We are seeking an AI Product Manager to lead the development of our AI-powered products. You will work closely with engineering, design, and business teams to define product vision and roadmap.",
            requirements: [
              "5+ years of product management experience, preferably in AI/ML products",
              "Strong technical background with understanding of AI/ML concepts",
              "Experience with agile development methodologies",
              "Excellent communication and leadership skills",
              "Proven track record of delivering successful products",
            ],
            skills: [
              "Product Management",
              "AI/ML",
              "Agile",
              "Product Strategy",
              "User Research",
            ],
            aiFocus: [
              "AI Product Management",
              "Machine Learning",
              "Product Strategy",
            ],
          },
          {
            id: "4",
            title: "Computer Vision Engineer",
            company: "Visionary AI",
            location: "Mumbai, India (On-site)",
            type: "Full-time",
            salary: "$145,000 - $195,000/year",
            match: 89,
            posted: "5 days ago",
            description:
              "Join our team to develop state-of-the-art computer vision algorithms for real-world applications. You will work on challenging problems in image recognition, object detection, and video analysis.",
            requirements: [
              "3+ years of experience in computer vision and deep learning",
              "Strong programming skills in Python and C++",
              "Experience with OpenCV, TensorFlow, or PyTorch",
              "Knowledge of 3D computer vision and SLAM is a plus",
              "Strong mathematical background in linear algebra and optimization",
            ],
            skills: [
              "Computer Vision",
              "Python",
              "C++",
              "OpenCV",
              "Deep Learning",
              "TensorFlow",
            ],
            aiFocus: ["Computer Vision", "Deep Learning", "Image Processing"],
          },
          {
            id: "5",
            title: "NLP Research Scientist",
            company: "LinguaTech AI",
            location: "New Delhi, India,(Remote)",
            type: "Contract",
            salary: "$100 - $150/hour",
            match: 91,
            posted: "1 day ago",
            description:
              "We are looking for an NLP Research Scientist to join our team and help push the boundaries of natural language understanding and generation. You will work on cutting-edge research and develop novel algorithms.",
            requirements: [
              "PhD in Computer Science, Linguistics, or related field",
              "Strong publication record in top-tier NLP/ML conferences",
              "Experience with transformer models and large language models",
              "Proficiency in Python and deep learning frameworks",
              "Experience with distributed training is a plus",
            ],
            skills: [
              "NLP",
              "Machine Learning",
              "Python",
              "Transformers",
              "Deep Learning",
              "Research",
            ],
            aiFocus: ["NLP", "Machine Learning", "Deep Learning", "Research"],
          },
        ];
        setJobs(professionalJobs);
      } catch (err) {
        console.error("Error loading jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setIsJobsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Fetch user profile
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
          setIsProfileLoading(false);
          router.push("/auth/login");
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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
        console.error("Error fetching user profile:", error);
        router.push("/auth/login");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const experienceLevels = [
    { id: "all", label: "All Levels" },
    { id: "fresher", label: "Fresher (0-2 years)" },
    { id: "internship", label: "Internship" },
    { id: "mid-level", label: "Mid-Level (2-5 years)" },
    { id: "experienced", label: "Experienced (5+ years)" },
  ];

  const filteredJobs = jobs.filter((job) => {
    if (!job) return false;

    const matchesSearch =
      (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      job.skills?.some((skill) =>
        skill?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false ||
      job.aiFocus?.some((focus) =>
        focus?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      false;
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesJobType = !jobTypeFilter || job.type === jobTypeFilter;
    const matchesSpecialization =
      activeSpecialization === "all" ||
      (job.aiFocus || []).some((focus) =>
        focus.toLowerCase().includes(activeSpecialization)
      );
    const matchesExperience =
      experienceFilter === "all" ||
      job.experienceLevel === experienceFilter ||
      (experienceFilter === "fresher" && job.experienceLevel === "internship");

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesSpecialization &&
      matchesExperience
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-neon-coral" />
      </div>
    );
  }

  const userName = userProfile?.first_name || userProfile?.name || "User";
  const userEmail = userProfile?.email || "";

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userName}
      userEmail={userEmail}
      profilePhotoPreview={profilePhotoPreview}
      setProfilePhotoPreview={setProfilePhotoPreview}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-deep-navy to-indigo-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/ai-pattern.png')] bg-cover bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-coral to-aqua-blue">
              AI & ML Career Opportunities
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover cutting-edge AI and Machine Learning roles at top tech
              companies worldwide. Your dream job in artificial intelligence is
              just a search away.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/70" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Job title, company, or AI specialization"
                    className="pl-10 h-14 text-lg bg-white/5 border-0 text-white placeholder-white/70 focus-visible:ring-2 focus-visible:ring-white/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  className="h-14 px-8 text-lg bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => {}}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* AI Specializations */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-neon-coral" />
                AI Specializations
              </h3>
              <div className="space-y-2">
                {aiSpecializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() =>
                      setActiveSpecialization(
                        spec.id === "all" ? "all" : spec.name.toLowerCase()
                      )
                    }
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      (activeSpecialization === "all" && spec.id === "all") ||
                      (spec.id !== "all" &&
                        activeSpecialization === spec.name.toLowerCase())
                        ? "bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium"
                        : "hover:bg-gray-50 text-deep-navy/80"
                    }`}
                  >
                    <spec.icon className="h-5 w-5 mr-3" />
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending AI Skills */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-electric-orange" />
                Trending AI Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(skill.name)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-50 hover:bg-gray-100 text-deep-navy/80 hover:text-neon-coral transition-colors border border-gray-200 hover:border-neon-coral/30"
                  >
                    {skill.name}
                    <span className="ml-1 text-xs text-gray-500">
                      {skill.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level Filter */}
            <div className="bg-white rounded-2xl shadow-enterprise p-6 border border-soft-gray">
              <h3 className="font-semibold text-lg text-deep-navy mb-4 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-neon-coral" />
                Experience Level
              </h3>
              <div className="space-y-2">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setExperienceFilter(level.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-all ${
                      experienceFilter === level.id
                        ? "bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 border border-neon-coral/20 text-neon-coral font-medium"
                        : "hover:bg-gray-50 text-deep-navy/80"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Active Filters */}
            {(searchTerm ||
              locationFilter ||
              jobTypeFilter ||
              activeSpecialization !== "all" ||
              experienceFilter !== "all") && (
              <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-soft-gray/50 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-deep-navy/70 mr-2">
                    Active filters:
                  </span>

                  {searchTerm && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <span className="text-sm text-deep-navy">
                        Search: {searchTerm}
                      </span>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-2 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {locationFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <MapPin className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">
                        {locationFilter}
                      </span>
                      <button
                        onClick={() => setLocationFilter("")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {jobTypeFilter && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Briefcase className="w-3.5 h-3.5 text-deep-navy/60 mr-1" />
                      <span className="text-sm text-deep-navy">
                        {jobTypeFilter}
                      </span>
                      <button
                        onClick={() => setJobTypeFilter("")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {activeSpecialization !== "all" && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <Brain className="w-3.5 h-3.5 text-neon-coral mr-1" />
                      <span className="text-sm text-deep-navy">
                        {aiSpecializations.find(
                          (s) => s.id === activeSpecialization
                        )?.name || activeSpecialization}
                      </span>
                      <button
                        onClick={() => setActiveSpecialization("all")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {experienceFilter !== "all" && (
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-soft-gray/50">
                      <GraduationCap className="w-3.5 h-3.5 text-aqua-blue mr-1" />
                      <span className="text-sm text-deep-navy">
                        {experienceLevels.find((l) => l.id === experienceFilter)
                          ?.label || experienceFilter}
                      </span>
                      <button
                        onClick={() => setExperienceFilter("all")}
                        className="ml-1.5 text-gray-400 hover:text-neon-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setLocationFilter("");
                      setJobTypeFilter("");
                      setActiveSpecialization("all");
                      setExperienceFilter("all");
                    }}
                    className="ml-auto flex items-center text-sm text-neon-coral hover:text-neon-coral/80 transition-colors font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-deep-navy">
                      {filteredJobs.length}{" "}
                      {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
                    </h2>
                    <div
                      className="flex items-center
                    "
                    >
                      <span className="text-sm text-deep-navy/70 mr-2">
                        Sort by:
                      </span>
                      <select
                        className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-neon-coral/50 focus:border-neon-coral/30"
                        defaultValue="relevance"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="newest">Newest</option>
                        <option value="salary-high">Salary: High to Low</option>
                        <option value="salary-low">Salary: Low to High</option>
                      </select>
                    </div>
                  </div>

                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobModal(true);
                      }}
                      className="cursor-pointer"
                    >
                      <JobCard job={job} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-enterprise border border-soft-gray/50">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 mb-4">
                    <Briefcase className="h-8 w-8 text-deep-navy/70" />
                  </div>
                  <h3 className="text-xl font-medium text-deep-navy mb-2">
                    No matching jobs found
                  </h3>
                  <p className="text-deep-navy/70 max-w-md mx-auto mb-6">
                    We couldn't find any jobs matching your criteria. Try
                    adjusting your search or filters.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      className="border-neon-coral/30 text-neon-coral hover:bg-neon-coral/5 hover:border-neon-coral/50"
                      onClick={() => {
                        setSearchTerm("");
                        setLocationFilter("");
                        setJobTypeFilter("");
                        setActiveSpecialization("all");
                      }}
                    >
                      Clear all filters
                    </Button>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90"
                      onClick={() => {
                        setSearchTerm("AI");
                      }}
                    >
                      Show View Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Description Modal */}
      {showJobModal && selectedJob && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowJobModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-soft-gray/50 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-deep-navy">
                  {selectedJob.title}
                </h2>
                <p className="text-lg text-deep-navy/80">
                  {selectedJob.company}
                </p>
                <div className="flex items-center mt-2">
                  <MapPin className="w-4 h-4 text-deep-navy/60 mr-1" />
                  <span className="text-sm text-deep-navy/70">
                    {selectedJob.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center px-3 py-1 bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 rounded-full border border-neon-coral/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neon-coral to-aqua-blue mr-2"></div>
                  <span className="text-sm font-medium text-deep-navy">
                    {selectedJob.match}% Match
                  </span>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-neon-coral transition-colors p-1 -mr-2"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-deep-navy mb-3">
                      Job Description
                    </h3>
                    <p className="text-deep-navy/80 leading-relaxed">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-deep-navy mb-3">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-neon-coral mt-0.5">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="ml-2 text-deep-navy/80">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-neon-coral/5 to-aqua-blue/5 p-5 rounded-xl border border-soft-gray/50">
                    <h3 className="font-semibold text-deep-navy mb-3">
                      Job Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-deep-navy/60 mr-2" />
                        <div>
                          <p className="text-sm text-deep-navy/60">Job Type</p>
                          <p className="font-medium">{selectedJob.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-deep-navy/60 mr-2" />
                        <div>
                          <p className="text-sm text-deep-navy/60">Salary</p>
                          <p className="font-medium">{selectedJob.salary}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-deep-navy/60 mr-2" />
                        <div>
                          <p className="text-sm text-deep-navy/60">Posted</p>
                          <p className="font-medium">{selectedJob.posted}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-deep-navy/80 mb-2">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-white border border-soft-gray/50 text-deep-navy/80"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-soft-gray/50">
                    <h3 className="font-semibold text-deep-navy mb-3">
                      About {selectedJob.company}
                    </h3>
                    <p className="text-sm text-deep-navy/80 mb-4">
                      {selectedJob.company} is a leading company in the AI/ML
                      space, dedicated to pushing the boundaries of artificial
                      intelligence and delivering innovative solutions to
                      complex problems.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-neon-coral/30 text-neon-coral hover:bg-neon-coral/5"
                    >
                      View Company Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
