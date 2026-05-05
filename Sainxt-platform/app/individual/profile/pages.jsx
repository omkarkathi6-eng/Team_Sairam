"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ScoreCard from "@/components/ScoreCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-circular-progressbar/dist/styles.css";
import RadarSkillChart from "@/components/RadarSkillChart";
import PieSkillChart from "@/components/ui/PieSkillChart";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  BookOpen,
  Award,
  Briefcase,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Plus,
  Trash2,
  X,
  Globe,
  Building,
  Zap,
  Sparkles,
  Laptop,
  Lightbulb,
  DollarSign,
  MapPinned,
  Video,
  BriefcaseIcon,
  Users,
  Brain,
  Shield,
  Trophy,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { debounce } from "lodash";
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

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about you",
  },
  { id: 2, title: "Education", description: "Your educational background" },
  { id: 3, title: "Experience", description: "Work and project experience" },
  { id: 4, title: "Skills", description: "Technical and soft skills" },
  { id: 5, title: "Preferences", description: "Career goals and preferences" },
];

// Predefined skill options
// const technicalSkillOptions = [
//   "JavaScript",
//   "Python",
//   "Java",
//   "C++",
//   "React",
//   "Angular",
//   "Vue",
//   "Node.js",
//   "Express",
//   "Django",
//   "Flask",
//   "Spring Boot",
//   "SQL",
//   "MongoDB",
//   "PostgreSQL",
//   "AWS",
//   "Azure",
//   "GCP",
//   "Docker",
//   "Kubernetes",
//   "CI/CD",
//   "Git",
//   "Machine Learning",
//   "Data Science",
//   "AI",
//   "Blockchain",
//   "IoT",
//   "Mobile Development",
//   "DevOps",
// ];

const technicalSkillOptions = [
  "Math Foundations",
  // "Linear Algebra",
  // "Probability & Statistics",
  // "Calculus",

  // Programming
  "Python",
  "Pytorch",
  // "NumPy",
  // "Pandas",
  "SQL",
  "Mongodb",

  "Machine Learning",
  // "Supervised Learning",
  // "Unsupervised Learning",
  // "Model Evaluation & Metrics",

  "Deep Learning",
  // "Neural Networks (NNs)",
  // "Convolutional Neural Networks (CNNs)",
  // "Recurrent Neural Networks (RNNs)",
  // "Transformers",

  // Specialized AI Domains
  "Natural Language Processing (NLP)",
  "Computer Vision (CV)",
  "Reinforcement Learning (RL)",
  "Generative AI (GenAI)",
];

const softSkillOptions = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Critical Thinking",
  "Time Management",
  "Leadership",
  "Adaptability",
  "Creativity",
  "Emotional Intelligence",
  "Conflict Resolution",
  "Negotiation",
  "Presentation Skills",
  // "Project Management",
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

// Work environments
const workEnvironments = ["Remote", "Hybrid", "On-site", "Flexible"];

// Industries
const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Media",
  "Government",
  "Non-profit",
  "Consulting",
];

// Company sizes
const companySizes = [
  "Startup (1-10)",
  "Small (11-50)",
  "Medium (51-200)",
  "Large (201-1000)",
  "Enterprise (1000+)",
];

function ProfileContent() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showMarketReadinessPrompt, setShowMarketReadinessPrompt] =
    useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  const [aiResults, setAiResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showRecommendationsView, setShowRecommendationsView] = useState(false);
  const [showDetailedRecommendations, setShowDetailedRecommendations] =
    useState(false);
  const [user, setUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [showPhotoConfirm, setShowPhotoConfirm] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [pendingPhotoPreview, setPendingPhotoPreview] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  // const userName = auth?.user?.first_name || auth?.user?.name || "User";
  const [formErrors, setFormErrors] = useState({});
  const [hasEvaluationResult, setHasEvaluationResult] = useState(false);
  const [hasEvaluation, setHasEvaluation] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasDraftBeenLoaded, setHasDraftBeenLoaded] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationData, setEvaluationData] = useState(false);
  // Get current year for date validation
  // Get current date and calculate max date (18 years ago from today)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const maxDate = `${currentYear - 18}-${(currentDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
  const [customSkill, setCustomSkill] = useState("");
  const [customSoftSkill, setCustomSoftSkill] = useState("");
  const [lastAnalysisDate, setLastAnalysisDate] = useState(null);
  const [showReanalysisRestrictionDialog, setShowReanalysisRestrictionDialog] =
    useState(false);
  const [evaluationAvailable, setEvaluationAvailable] = useState(false);

  const [canReanalyze, setCanReanalyze] = useState(true);
  const [daysUntilReanalysis, setDaysUntilReanalysis] = useState(0);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const autoSaveRef = useRef(null);
  const [formData, setFormData] = useState({
    // Personal Information - Initialize with user data if available
    firstName: "",
    lastName: "",
    email: "",
    phone: "+91 ", // Indian format default
    location: "",
    dateOfBirth: "",
    bio: "",

    // Education
    university: "",
    degree: "",
    major: "",
    graduationYear: "",
    gpa: "",
    additionalEducation: [],

    // Experience
    workExperiences: [],
    projects: [],

    // Skills - Start empty for new users
    technicalSkills: [],
    softSkills: [],
    languages: [{ language: "English", proficiency: "Native" }],

    // Preferences
    jobTypes: [],
    salaryExpectation: "50000",
    willingToRelocate: false,
    preferredLocations: [],
    preferredIndustries: [],
    preferredCompanySize: [],
    workEnvironment: "",
    careerGoals: "",
  });

  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("jobraze-user");
        if (stored) {
          setStoredUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
  }, []);

  // Your useEffects (they always run in same order)
  useEffect(() => {
    if (!hasToken || !auth) {
      router.push("/auth/login");
    }
  }, [auth, hasToken, router]);

  useEffect(() => {
    const fetchProfileAndDraft = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        let draftData = null;

        // ✅ Fetch main profile
        const profileResponse = await fetch(
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
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
        if (draftData?.profile_photo_url) {
          setProfilePhotoPreview(draftData.profile_photo_url);
        } else if (profileData?.profile_photo_url) {
          setProfilePhotoPreview(profileData.profile_photo_url);
        } else {
          setProfilePhotoPreview(null);
        }

        const draftResponse = await fetch(
          "https://www.jobraze.in/api/user/draft",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (draftResponse.ok) {
          draftData = await draftResponse.json();
          console.log("Fetched draft data:", draftData);
        }

        // ✅ Pick data to load — prefer draft if available
        const dataToLoad =
          draftData && Object.keys(draftData).length > 0
            ? draftData
            : profileData || {};

        // Load profile photo if available
        if (dataToLoad.profile_photo_url) {
          setProfilePhotoPreview(dataToLoad.profile_photo_url);
        } else if (profileData.profile_photo_url) {
          setProfilePhotoPreview(profileData.profile_photo_url);
        }

        // ✅ Map backend data into form state
        setFormData((prev) => ({
          ...prev,
          firstName: dataToLoad.first_name || "",
          lastName: dataToLoad.last_name || "",
          email:
            dataToLoad.email ||
            profileData.email ||
            auth.user?.email ||
            prev.email ||
            "",
          phone: dataToLoad.phone || "+91 ",
          location: dataToLoad.location || "",
          dateOfBirth: dataToLoad.date_of_birth || "",
          bio: dataToLoad.bio || "",
          university: dataToLoad.university || "",
          degree: dataToLoad.degree || "",
          major: dataToLoad.major || "",
          graduationYear: dataToLoad.graduation_year || "",
          gpa: dataToLoad.gpa || "",
          additionalEducation: dataToLoad.additional_education || [],
          workExperiences: dataToLoad.work_experiences || [],
          projects: dataToLoad.projects || [],
          // technicalSkills: dataToLoad.technical_skills || [],
          technicalSkills: Array.isArray(dataToLoad.technicalSkills)
            ? dataToLoad.technicalSkills
            : dataToLoad.technicalSkills
            ? dataToLoad.technicalSkills.split(",").map((s) => s.trim())
            : [],
          // softSkills: dataToLoad.soft_skills || [],
          softSkills: Array.isArray(dataToLoad.softSkills)
            ? dataToLoad.softSkills
            : dataToLoad.softSkills
            ? dataToLoad.softSkills.split(",").map((s) => s.trim())
            : [],
          languages: dataToLoad.languages || [
            { language: "English", proficiency: "Native" },
          ],
          jobTypes: dataToLoad.job_types || [],
          salaryExpectation: dataToLoad.salary_expectation || "50000",
          willingToRelocate: dataToLoad.willing_to_relocate || false,
          preferredLocations: dataToLoad.preferred_locations || [],
          preferredIndustries: dataToLoad.preferred_industries || [],
          preferredCompanySize: dataToLoad.preferred_company_size || [],
          workEnvironment: dataToLoad.work_environment || "",
          careerGoals: dataToLoad.career_goals || "",
        }));

        // ✅ Set current step from draft if present
        if (draftData?.currentStep) {
          setCurrentStep(draftData.currentStep);
        }

        // ✅ Load profile photo preview (priority order)
        if (dataToLoad.profile_photo_url) {
          // First preference → draft or saved profile photo
          setProfilePhotoPreview(dataToLoad.profile_photo_url);
        } else if (profilePhoto && profilePhoto instanceof File) {
          // Second preference → local uploaded image
          setProfilePhotoPreview(URL.createObjectURL(profilePhoto));
        } else {
          // Fallback → no image
          setProfilePhotoPreview(null);
        }

        // ✅ Update auth context with profile data
        if (auth.setUser) {
          auth.setUser((prev) => ({ ...prev, ...profileData }));
        }

        setHasDraftBeenLoaded(true);
      } catch (error) {
        console.error("Error fetching profile/draft:", error);

        // ✅ Fallback to localStorage if API fails
        const localDraft = localStorage.getItem("profileDraft");
        if (localDraft) {
          const parsedDraft = JSON.parse(localDraft);
          setFormData((prev) => ({ ...prev, ...parsedDraft }));

          // Load preview from localStorage
          if (parsedDraft.profilePhoto)
            setProfilePhotoPreview(parsedDraft.profilePhoto);
          if (parsedDraft.currentStep) setCurrentStep(parsedDraft.currentStep);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndDraft();
  }, []);

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

    return "Induvidual User";
  };

  const userName = getDisplayName();
  const userEmail = userProfile?.email || auth.user?.email || "";

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

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get token from localStorage
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        // If no token, use demo mode
        if (!token) {
          console.log("No access token found. Running in demo mode.");
          setIsAuthenticated(true);
          setUser({
            email: "demo@example.com",
            name: "Demo User",
            role: "individual",
          });
          return;
        }
        // If token exists, try to fetch user data
        console.log("Access token found, fetching user data...");
        const response = await fetch(
          "https://www.jobraze.in/api/read_users_me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            console.warn("User endpoint not found. Using demo user.");
          } else {
            console.warn(
              `API returned status ${response.status}. Using demo user.`
            );
          }
          setIsAuthenticated(true);
          setUser({
            email: "demo@example.com",
            name: "Demo User",
            role: "individual",
          });
          return;
        }

        // If we get here, we have valid user data
        const userData = await response.json();
        setIsAuthenticated(true);
        setUser({
          email: userData.email || "demo@example.com",
          name: userData.name || "Demo User",
          role: userData.role || "individual",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAuthenticated(false);
        setUser({
          email: "default@example.com",
          name: "Guest User",
          role: "guest",
        });
      }
    };

    checkAuth();
  }, []);

  const checkReanalysisEligibility = (lastAnalysisDate) => {
    if (!lastAnalysisDate) {
      return { canReanalyze: true, daysRemaining: 0 };
    }

    const lastAnalysis = new Date(lastAnalysisDate);
    const now = new Date();
    const daysSinceAnalysis = Math.floor(
      (now - lastAnalysis) / (1000 * 60 * 60 * 24)
    );

    const canReanalyze = daysSinceAnalysis >= 30;
    const daysRemaining = Math.max(0, 30 - daysSinceAnalysis);

    return { canReanalyze, daysRemaining };
  };
  const fetchReanalysisEligibility = async (email) => {
    try {
      const response = await fetch(
        `https://www.jobraze.in/api/ai-review/can-reanalyze?email=${email}`
      );

      if (response.ok) {
        return await response.json();
      }

      // Fallback to local check if API fails
      return checkReanalysisEligibility(null);
    } catch (error) {
      console.error("Error checking reanalysis eligibility:", error);
      return checkReanalysisEligibility(null);
    }
  };

  const handleReanalyzeButtonClick = async () => {
    // First check with backend API for most accurate data
    const eligibility = await fetchReanalysisEligibility(formData.email);

    if (!eligibility.can_reanalyze) {
      setDaysUntilReanalysis(eligibility.days_remaining);
      setLastAnalysisDate(eligibility.last_analysis_date);
      setShowReanalysisRestrictionDialog(true);
      return;
    }

    // If eligible, proceed with analysis
    handleMarketReadinessConfirm();
  };

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "recommendations") {
      setShowRecommendationsView(true);
    } else {
      setShowRecommendationsView(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (userEmail) {
      setFormData((prev) => ({
        ...prev,
        email: userEmail,
      }));
    }
  }, [userEmail]);

  useEffect(() => {
    const checkEvaluationResult = async () => {
      try {
        const res = await fetch(
          `https://www.jobraze.in/api/profile?email=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        if (
          data?.evaluation?.gap_analysis ||
          data?.evaluation?.recommendations
        ) {
          setHasEvaluationResult(true);
          setAiResults(data);

          // Check last analysis date and eligibility
          const lastAnalysis = data.evaluation?.last_analysis_date;
          setLastAnalysisDate(lastAnalysis);

          if (lastAnalysis) {
            const eligibility = checkReanalysisEligibility(lastAnalysis);
            setCanReanalyze(eligibility.canReanalyze);
            setDaysUntilReanalysis(eligibility.daysRemaining);
          }
        } else {
          setHasEvaluationResult(false);
          setAiResults(null);
          setCanReanalyze(true);
        }
      } catch (error) {
        console.error("Error checking evaluation result:", error);
      }
    };

    if (userEmail) checkEvaluationResult();
  }, [userEmail]);

  // useEffect(() => {
  //   const fetchEvaluation = async () => {
  //     const res = await fetch(
  //       `https://www.jobraze.in/api/user/evaluation-report?email=${userEmail}`
  //     );
  //     const data = await res.json();
  //     setEvaluationData(data);
  //   };

  //   if (userEmail) fetchEvaluation();
  // }, [userEmail]);

  // useEffect(() => {
  //   const fetchEvaluation = async () => {
  //     try {
  //       const res = await fetch(
  //         `https://www.jobraze.in/api/user/evaluation-report?email=${userEmail}`
  //       );

  //       if (res.ok) {
  //         const data = await res.json();
  //         if (data.exists) {
  //           setEvaluationData(data.data); // ✅ only store inner "data"
  //           setEvaluationAvailable(true); // ✅ enable button
  //         } else {
  //           setEvaluationAvailable(false); // ❌ hide button if not exists
  //         }
  //       } else {
  //         setEvaluationAvailable(false);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching evaluation:", err);
  //       setEvaluationAvailable(false);
  //     }
  //   };

  //   if (userEmail) fetchEvaluation();
  // }, [userEmail]);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await fetch(
          `https://www.jobraze.in/api/user/evaluation-report?email=${userEmail}`
        );

        if (res.ok) {
          const data = await res.json();
          if (data.evaluation) {
            setEvaluationData(data.evaluation); // ✅ store the report directly
            setEvaluationAvailable(true); // ✅ show button
          } else {
            setEvaluationAvailable(false); // ❌ hide button if no evaluation
          }
        } else {
          setEvaluationAvailable(false);
        }
      } catch (err) {
        console.error("Error fetching evaluation:", err);
        setEvaluationAvailable(false);
      }
    };

    if (userEmail) fetchEvaluation();
  }, [userEmail]);

  // After other useEffects, add this:
  useEffect(() => {
    // Mark data as changed for auto-save
    setIsDataChanged(true);
  }, [formData]); // Trigger on any formData change

  useEffect(() => {
    // Create debounced auto-save function (saves 5 seconds after last change)
    autoSaveRef.current = debounce(async () => {
      if (isDataChanged && !isSavingDraft) {
        await handleSaveDraft(); // Use your existing handleSaveDraft (saves to backend + localStorage)
        setIsDataChanged(false); // Reset change flag
        toast.success("Progress auto-saved!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    }, 5000); // 5-second debounce

    return () => autoSaveRef.current?.cancel(); // Cleanup on unmount
  }, [isDataChanged, isSavingDraft, formData]); // Dependencies

  // Handle profile photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSizeInMB = 5;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("File size exceeds 5MB limit.", {
          position: "top-center",
          autoClose: 3000,
          style: {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 9999,
          },
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingPhoto(file);
        setPendingPhotoPreview(reader.result);
        setShowPhotoConfirm(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhotoUpload = () => {
    setProfilePhoto(pendingPhoto);
    setProfilePhotoPreview(pendingPhotoPreview);
    setShowPhotoConfirm(false);
    setPendingPhoto(null);
    setPendingPhotoPreview(null);

    // ✅ Show toast here
    toast.success("Profile photo uploaded successfully!", {
      position: "top-center",
      autoClose: 3000,
    });
  };
  const addAdditionalEducation = () => {
    const newEducation = {
      id: Date.now(), // Use timestamp for unique ID
      university: "",
      degree: "",
      major: "",
      graduationYear: "",
      gpa: "",
      certificationName: "", // For certifications
      issuingOrganization: "", // For certifications
      issueDate: "", // For certifications
      type: "degree", // "degree" or "certification"
    };
    setFormData({
      ...formData,
      additionalEducation: [...formData.additionalEducation, newEducation],
    });
  };
  const updateAdditionalEducation = (id, field, value) => {
    setFormData({
      ...formData,
      additionalEducation: formData.additionalEducation.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };
  const removeAdditionalEducation = (id) => {
    setFormData({
      ...formData,
      additionalEducation: formData.additionalEducation.filter(
        (edu) => edu.id !== id
      ),
    });
  };
  const validateCurrentStep = () => {
    const errors = {};

    // Personal Information validation
    if (currentStep === 1) {
      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    }
    // Phone number validation
    const phoneDigits = formData.phone
      .replace(/^\+91\s*/, "")
      .replace(/[^0-9]/g, "");
    if (phoneDigits.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits (excluding +91)";
    }
    // Education validation - Fixed mandatory field validation
    // Updated validation function - replace the education validation part (currentStep === 2)

    // Education validation - Updated to handle pursuing and expected graduation
    else if (currentStep === 2) {
      if (!formData.university.trim())
        errors.university = "University/Institution is required";
      if (!formData.degree) errors.degree = "Degree level is required";
      if (!formData.major.trim())
        errors.major = "Major/Field of study is required";
      if (!formData.graduationYear)
        errors.graduationYear = "Graduation year is required";

      // Updated graduation year validation to handle new formats
      if (
        formData.graduationYear &&
        !formData.graduationYear.startsWith("pursuing") &&
        !formData.graduationYear.startsWith("expected-") &&
        isNaN(formData.graduationYear)
      ) {
        errors.graduationYear = "Please select a valid graduation year";
      }

      if (
        formData.gpa &&
        (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0)
      ) {
        errors.gpa = "Please enter a valid GPA between 0 and 4.0";
      }
    }
    // Experience validation
    // Replace the existing validateCurrentStep function's case 3 section with this:

    // Experience validation
    else if (currentStep === 3) {
      // Validate work experiences
      formData.workExperiences.forEach((exp, index) => {
        if (!exp.title.trim()) {
          errors[`workExpTitle_${exp.id}`] = "Job title is required";
        }
        if (!exp.company.trim()) {
          errors[`workExpCompany_${exp.id}`] = "Company name is required";
        }
        if (!exp.startDate) {
          errors[`workExpStartDate_${exp.id}`] = "Start date is required";
        }

        // Validate date consistency if both dates are provided
        if (
          exp.startDate &&
          exp.endDate &&
          !exp.current &&
          new Date(exp.startDate) > new Date(exp.endDate)
        ) {
          errors[`workExpEndDate_${exp.id}`] =
            "End date must be after start date";
        }
      });

      // Validate projects
      formData.projects.forEach((project, index) => {
        if (!project.title.trim()) {
          errors[`projectTitle_${project.id}`] = "Project title is required";
        }
      });
    }
    // Skills validation
    else if (currentStep === 4) {
      if (formData.technicalSkills.length === 0) {
        errors.technicalSkills = "At least one technical skill is required";
      }
      if (formData.softSkills.length === 0) {
        errors.softSkills = "At least one soft skill is required";
      }

      // Validate languages
      formData.languages.forEach((lang, index) => {
        if (!lang.language.trim()) {
          errors[`language_${index}`] = "Language is required";
        }
        if (!lang.proficiency) {
          errors[`proficiency_${index}`] = "Proficiency level is required";
        }
      });
    }

    // Preferences validation - No validations, all fields are optional
    else if (currentStep === 5) {
      // No validations for preferences section
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      toast.error("Please fill out all required fields correctly.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // Scroll to the first error
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        const element = document.getElementById(firstError);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      setFormErrors({}); // Clear errors when moving to next step
    } else {
      try {
        // First, save all profile data to the backend
        await submitProfileToBackend();

        // Show market readiness prompt
        setShowMarketReadinessPrompt(true);
      } catch (error) {
        console.error("Error saving profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMarketReadinessConfirm = async () => {
    try {
      setShowMarketReadinessPrompt(true);
      setShowResults(false);
      setIsLoading(true);

      const response = await fetch(
        "https://www.jobraze.in/api/ai-review/generate-scores",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      // Handle 429 status (rate limited - reanalysis not allowed)
      if (response.status === 429) {
        const errorData = await response.json();
        console.log("Rate limit response:", errorData);

        // Update state with the restriction data from backend
        setDaysUntilReanalysis(errorData.days_remaining);
        setLastAnalysisDate(errorData.last_analysis_date);

        // Close the market readiness prompt
        setShowMarketReadinessPrompt(false);
        setIsLoading(false);

        // Show the restriction dialog
        setShowReanalysisRestrictionDialog(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Analysis result:", data);

      // Handle successful analysis
      setAnalysisResult(data);
      setHasEvaluationResult(true);
      setShowResults(true);
      setShowMarketReadinessPrompt(false);

      // Update last analysis date for future checks
      setLastAnalysisDate(data.last_analysis_date);
    } catch (error) {
      console.error("Error in market readiness analysis:", error);

      // Show error message to user
      alert("Something went wrong during analysis. Please try again later.");

      // Reset loading states
      setShowMarketReadinessPrompt(false);
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleViewEvaluation = () => {
    setShowEvaluation(true);
  };

  // Convert camelCase to snake_case
  const toSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

  // Build FormData with snake_case keys
  const buildFormData = (formDataObj) => {
    const formDataToSend = new FormData();

    Object.entries(formDataObj).forEach(([key, value]) => {
      const snakeKey = toSnakeCase(key);

      if (Array.isArray(value) || typeof value === "object") {
        formDataToSend.append(snakeKey, JSON.stringify(value));
      } else {
        formDataToSend.append(snakeKey, value ?? "");
      }
    });
    if (profilePhoto && profilePhoto instanceof File) {
      formDataToSend.append("profile_photo", profilePhoto);
    }

    return formDataToSend;
  };

  const handleSaveDraft = async (isAutoSave = false) => {
    try {
      setIsSavingDraft(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error(
          "No token found in localStorage. User not authenticated."
        );
        return;
      }

      // ✅ First calculate the photo Base64 for local storage only
      // ✅ Convert photo to Base64 if available
      let profilePhotoBase64 = null;
      if (profilePhoto && profilePhoto instanceof File) {
        profilePhotoBase64 = await fileToBase64(profilePhoto);
      } else if (profilePhotoPreview && !profilePhoto) {
        profilePhotoBase64 = profilePhotoPreview;
      }

      // ✅ Prepare JSON payload instead of FormData
      const draftData = {
        ...formData,
        profile_photo: profilePhotoBase64,
        is_draft: true,
        last_saved: new Date().toISOString(),
        current_step: currentStep,
      };

      // ✅ Save locally for fallback
      localStorage.setItem("profileDraft", JSON.stringify(draftData));

      // ✅ Build FormData to send to backend
      const formDataToSend = buildFormData(formData);

      // ✅ Append profile photo if selected
      if (profilePhoto && profilePhoto instanceof File) {
        formDataToSend.append("profile_photo", profilePhoto);
      }

      formDataToSend.append("is_draft", "true");
      formDataToSend.append("last_saved", draftData.lastSaved);
      formDataToSend.append("current_step", currentStep.toString());

      const response = await fetch("https://www.jobraze.in/api/save_draft", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
        credentials: "include",
      });

      if (response.ok) {
        if (!isAutoSave) {
          toast.success(
            `Your profile has been saved successfully. You can continue later from Step ${currentStep}.`,
            {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            }
          );
        }
      } else {
        const errorData = await response.json();
        console.error("Error saving draft:", errorData);
        if (!isAutoSave) {
          toast.error(
            "Failed to save draft on server. Progress saved locally.",
            {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            }
          );
        }
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!isAutoSave) {
        toast.error(
          "Unable to save your draft to the server. Progress saved locally.",
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Helper function to convert file to base64 for localStorage
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  // Experience handlers
  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(), // Use timestamp for unique ID
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setFormData({
      ...formData,
      workExperiences: [...formData.workExperiences, newExperience],
    });
  };

  const updateWorkExperience = (id, field, value) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeWorkExperience = (id) => {
    setFormData({
      ...formData,
      workExperiences: formData.workExperiences.filter((exp) => exp.id !== id),
    });
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(), // Use timestamp for unique ID
      title: "",
      url: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setFormData({
      ...formData,
      projects: [...formData.projects, newProject],
    });
  };

  const updateProject = (id, field, value) => {
    setFormData({
      ...formData,
      projects: formData.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((project) => project.id !== id),
    });
  };

  // Skills handlers
  const toggleTechnicalSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      technicalSkills: prev.technicalSkills.includes(skill)
        ? prev.technicalSkills.filter((s) => s !== skill)
        : [...prev.technicalSkills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.technicalSkills.includes(customSkill)) {
      toggleTechnicalSkill(customSkill.trim());
      setCustomSkill("");
    }
  };
  const toggleSoftSkill = (skill) => {
    if (formData.softSkills.includes(skill)) {
      setFormData({
        ...formData,
        softSkills: formData.softSkills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        softSkills: [...formData.softSkills, skill],
      });
    }
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [
        ...formData.languages,
        { language: "", proficiency: "Beginner" },
      ],
    });
  };

  const updateLanguage = (index, field, value) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData({
      ...formData,
      languages: updatedLanguages,
    });
  };

  const removeLanguage = (index) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index),
    });
  };

  // Preferences handlers
  const toggleJobType = (jobType) => {
    if (formData.jobTypes.includes(jobType)) {
      setFormData({
        ...formData,
        jobTypes: formData.jobTypes.filter((type) => type !== jobType),
      });
    } else {
      setFormData({
        ...formData,
        jobTypes: [...formData.jobTypes, jobType],
      });
    }
  };

  const addLocation = (location) => {
    const trimmedLocation = location.trim();
    if (!trimmedLocation) {
      toast.error("Please enter a valid location.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    if (formData.preferredLocations.includes(trimmedLocation)) {
      toast.error("This location is already added.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    if (formData.preferredLocations.length >= 10) {
      toast.error("You can add up to 10 preferred locations.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }
    setFormData({
      ...formData,
      preferredLocations: [...formData.preferredLocations, trimmedLocation],
    });
  };

  const removeLocation = (location) => {
    setFormData({
      ...formData,
      preferredLocations: formData.preferredLocations.filter(
        (loc) => loc !== location
      ),
    });
  };

  const toggleIndustry = (industry) => {
    if (formData.preferredIndustries.includes(industry)) {
      setFormData({
        ...formData,
        preferredIndustries: formData.preferredIndustries.filter(
          (ind) => ind !== industry
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferredIndustries: [...formData.preferredIndustries, industry],
      });
    }
  };

  const toggleCompanySize = (size) => {
    if (formData.preferredCompanySize.includes(size)) {
      setFormData({
        ...formData,
        preferredCompanySize: formData.preferredCompanySize.filter(
          (s) => s !== size
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferredCompanySize: [...formData.preferredCompanySize, size],
      });
    }
  };

  // Extract [min, max] from a salary range string like "₹3–4 LPA"
  function parseSalaryRange(text) {
    if (!text) return null;
    const match = text.match(/₹?(\d+)[–-](\d+)\s*LPA/i);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }
    return null;
  }

  // Convert salary range into percentage width (relative scale)
  function salaryToWidth([min, max], scaleMax = 12) {
    // scaleMax = maximum salary we want to visualize, e.g., 12 LPA
    const avg = (min + max) / 2;
    return `${Math.min((avg / scaleMax) * 100, 100)}%`;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePhotoPreview ? (
                    <img
                      src={
                        profilePhotoPreview ||
                        userProfile?.profile_photo_url ||
                        "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() =>
                    document.getElementById("photo-upload").click()
                  }
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter your first name"
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter your last name"
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    placeholder="your.email@example.com"
                    className={`pl-10 cursor-not-allowed ${
                      formErrors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-500">{formErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Ensure the prefix "+91 " is always present
                      if (!value.startsWith("+91 ")) {
                        value =
                          "+91 " +
                          value.replace(/^\+91\s*/, "").replace(/[^0-9]/g, "");
                      }
                      // Limit to 10 digits after "+91 "
                      const digits = value
                        .replace(/^\+91\s*/, "")
                        .replace(/[^0-9]/g, "");
                      if (digits.length <= 10) {
                        setFormData({ ...formData, phone: "+91 " + digits });
                      }
                    }}
                    placeholder="+91 1234567890"
                    className={`pl-10 ${
                      formErrors.phone ? "border-red-500" : ""
                    }`}
                    maxLength={14} // Allows for "+91 " (4 chars) + 10 digits
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, State, Country"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    max={maxDate} // Restrict to at least 18 years ago
                    className={`pl-10 ${
                      formErrors.dateOfBirth ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {formErrors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {formErrors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself, your interests, and career goals..."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                A compelling bio helps employers understand your background and
                aspirations.
              </p>
            </div>
          </div>
        );

      // Updated Education Section (Case 2 in renderStepContent function)

      case 2:
        return (
          <div className="space-y-6">
            {/* Primary Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Primary Education
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="university">University/Institution *</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) =>
                      setFormData({ ...formData, university: e.target.value })
                    }
                    placeholder="e.g., Stanford University"
                    className={formErrors.university ? "border-red-500" : ""}
                  />
                  {formErrors.university && (
                    <p className="text-sm text-red-500">
                      {formErrors.university}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="degree">Degree Level *</Label>
                  <Select
                    value={formData.degree}
                    onValueChange={(value) =>
                      setFormData({ ...formData, degree: value })
                    }
                  >
                    <SelectTrigger
                      className={formErrors.degree ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select degree level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="associate">
                        Associate's Degree
                      </SelectItem>
                      <SelectItem value="bachelor">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">Ph.D.</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.degree && (
                    <p className="text-sm text-red-500">{formErrors.degree}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major">Major/Field of Study *</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) =>
                      setFormData({ ...formData, major: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                    className={formErrors.major ? "border-red-500" : ""}
                  />
                  {formErrors.major && (
                    <p className="text-sm text-red-500">{formErrors.major}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Select
                    value={formData.graduationYear}
                    onValueChange={(value) =>
                      setFormData({ ...formData, graduationYear: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        formErrors.graduationYear ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Current/Pursuing options */}
                      <SelectItem value="pursuing">
                        Currently Pursuing
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear()}`}
                      >
                        Expected {new Date().getFullYear()}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 1}`}
                      >
                        Expected {new Date().getFullYear() + 1}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 2}`}
                      >
                        Expected {new Date().getFullYear() + 2}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 3}`}
                      >
                        Expected {new Date().getFullYear() + 3}
                      </SelectItem>
                      <SelectItem
                        value={`expected-${new Date().getFullYear() + 4}`}
                      >
                        Expected {new Date().getFullYear() + 4}
                      </SelectItem>

                      {/* Separator */}
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 border-t">
                        Completed
                      </div>

                      {/* Past graduation years */}
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formErrors.graduationYear && (
                    <p className="text-sm text-red-500">
                      {formErrors.graduationYear}
                    </p>
                  )}

                  {/* Show helper text for pursuing students */}
                  {(formData.graduationYear === "pursuing" ||
                    formData.graduationYear?.startsWith("expected-")) && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      💡 You can update this once you graduate
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">
                    {formData.graduationYear === "pursuing" ||
                    formData.graduationYear?.startsWith("expected-")
                      ? "Current GPA (Optional)"
                      : "GPA (Optional)"}
                  </Label>
                  <Input
                    id="gpa"
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: e.target.value })
                    }
                    placeholder="e.g., 3.8"
                    className={formErrors.gpa ? "border-red-500" : ""}
                  />
                  {formErrors.gpa && (
                    <p className="text-sm text-red-500">{formErrors.gpa}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Education Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Award className="mr-2 h-5 w-5 text-[#33D6C4]" />
                  Additional Education
                </h3>
                <Button
                  onClick={addAdditionalEducation}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Another Degree
                </Button>
              </div>

              {formData.additionalEducation.map((education) => (
                <Card key={education.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeAdditionalEducation(education.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>University/Institution</Label>
                        <Input
                          value={education.university}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "university",
                              e.target.value
                            )
                          }
                          placeholder="e.g., MIT"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree Level</Label>
                        <Select
                          value={education.degree}
                          onValueChange={(value) =>
                            updateAdditionalEducation(
                              education.id,
                              "degree",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select degree level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="associate">
                              Associate's Degree
                            </SelectItem>
                            <SelectItem value="bachelor">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="master">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="phd">Ph.D.</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="certificate">
                              Certificate
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Major/Field of Study</Label>
                        <Input
                          value={education.major}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "major",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Data Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Year</Label>
                        <Select
                          value={education.graduationYear}
                          onValueChange={(value) =>
                            updateAdditionalEducation(
                              education.id,
                              "graduationYear",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Current/Pursuing options */}
                            <SelectItem value="pursuing">
                              Currently Pursuing
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear()}`}
                            >
                              Expected {new Date().getFullYear()}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 1}`}
                            >
                              Expected {new Date().getFullYear() + 1}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 2}`}
                            >
                              Expected {new Date().getFullYear() + 2}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 3}`}
                            >
                              Expected {new Date().getFullYear() + 3}
                            </SelectItem>
                            <SelectItem
                              value={`expected-${new Date().getFullYear() + 4}`}
                            >
                              Expected {new Date().getFullYear() + 4}
                            </SelectItem>

                            {/* Separator */}
                            <div className="px-2 py-1 text-xs font-medium text-gray-500 border-t">
                              Completed
                            </div>

                            {/* Past graduation years */}
                            {Array.from({ length: 30 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        {/* Show helper text for pursuing students */}
                        {(education.graduationYear === "pursuing" ||
                          education.graduationYear?.startsWith(
                            "expected-"
                          )) && (
                          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            💡 You can update this once you graduate
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>
                          {education.graduationYear === "pursuing" ||
                          education.graduationYear?.startsWith("expected-")
                            ? "Current GPA (Optional)"
                            : "GPA (Optional)"}
                        </Label>
                        <Input
                          value={education.gpa}
                          onChange={(e) =>
                            updateAdditionalEducation(
                              education.id,
                              "gpa",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 3.8"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.additionalEducation.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Award className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No additional education added yet
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add additional degrees, diplomas, or certifications
                  </p>
                  <Button
                    onClick={addAdditionalEducation}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Another Degree
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Education Tips
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Include all relevant degrees and diplomas. For current
                    students, select "Currently Pursuing" or expected graduation
                    year. This helps employers understand your qualifications
                    and commitment to continuous learning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Experience
        return (
          <div className="space-y-8">
            {/* Work Experience Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Work Experience
                </h3>
                <Button
                  onClick={addWorkExperience}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Experience
                </Button>
              </div>

              {formData.workExperiences.map((experience, index) => (
                <Card key={experience.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeWorkExperience(experience.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`job-title-${experience.id}`}>
                          Job Title *
                        </Label>
                        <Input
                          id={`workExpTitle_${experience.id}`}
                          value={experience.title}
                          onChange={(e) =>
                            updateWorkExperience(
                              experience.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g., Software Engineer"
                          className={
                            formErrors[`workExpTitle_${experience.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`workExpTitle_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpTitle_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`company-${experience.id}`}>
                          Company *
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`workExpCompany_${experience.id}`}
                            value={experience.company}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Google"
                            className={`pl-10 ${
                              formErrors[`workExpCompany_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                        </div>
                        {formErrors[`workExpCompany_${experience.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`workExpCompany_${experience.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`work-location-${experience.id}`}>
                          Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`work-location-${experience.id}`}
                            value={experience.location}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "location",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Bengaluru, Karnataka, India"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor={`start-date-${experience.id}`}>
                            Start Date *
                          </Label>
                          <Input
                            id={`workExpStartDate_${experience.id}`}
                            type="month"
                            value={experience.startDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "startDate",
                                e.target.value
                              )
                            }
                            className={
                              formErrors[`workExpStartDate_${experience.id}`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          {formErrors[`workExpStartDate_${experience.id}`] && (
                            <p className="text-sm text-red-500">
                              {formErrors[`workExpStartDate_${experience.id}`]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`end-date-${experience.id}`}>
                              End Date
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`current-job-${experience.id}`}
                                checked={experience.current}
                                onCheckedChange={(checked) =>
                                  updateWorkExperience(
                                    experience.id,
                                    "current",
                                    checked
                                  )
                                }
                              />
                              <Label
                                htmlFor={`current-job-${experience.id}`}
                                className="text-sm font-normal"
                              >
                                Current
                              </Label>
                            </div>
                          </div>
                          <Input
                            id={`end-date-${experience.id}`}
                            type="month"
                            value={experience.endDate}
                            onChange={(e) =>
                              updateWorkExperience(
                                experience.id,
                                "endDate",
                                e.target.value
                              )
                            }
                            disabled={experience.current}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`description-${experience.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`description-${experience.id}`}
                        value={experience.description}
                        onChange={(e) =>
                          updateWorkExperience(
                            experience.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.workExperiences.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Briefcase className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No work experience added yet
                  </h4>
                  <Button
                    onClick={addWorkExperience}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Work Experience
                  </Button>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Laptop className="mr-2 h-5 w-5 text-[#33D6C4]" />
                  Projects
                </h3>
                <Button
                  onClick={addProject}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Project
                </Button>
              </div>

              {formData.projects.map((project) => (
                <Card key={project.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`project-title-${project.id}`}>
                          Project Title *
                        </Label>
                        <Input
                          id={`projectTitle_${project.id}`}
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project.id, "title", e.target.value)
                          }
                          placeholder="e.g., E-commerce Platform"
                          className={
                            formErrors[`projectTitle_${project.id}`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {formErrors[`projectTitle_${project.id}`] && (
                          <p className="text-sm text-red-500">
                            {formErrors[`projectTitle_${project.id}`]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-url-${project.id}`}>
                          Project URL
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={`project-url-${project.id}`}
                            value={project.url}
                            onChange={(e) =>
                              updateProject(project.id, "url", e.target.value)
                            }
                            placeholder="e.g., https://github.com/username/project"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-start-${project.id}`}>
                          Start Date
                        </Label>
                        <Input
                          id={`project-start-${project.id}`}
                          type="month"
                          value={project.startDate}
                          onChange={(e) =>
                            updateProject(
                              project.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-end-${project.id}`}>
                          End Date
                        </Label>
                        <Input
                          id={`project-end-${project.id}`}
                          type="month"
                          value={project.endDate}
                          onChange={(e) =>
                            updateProject(project.id, "endDate", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Label htmlFor={`project-description-${project.id}`}>
                        Description
                      </Label>
                      <Textarea
                        id={`project-description-${project.id}`}
                        value={project.description}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the project, technologies used, and your role..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {formData.projects.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Laptop className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <h4 className="text-muted-foreground">
                    No projects added yet
                  </h4>
                  <Button
                    onClick={addProject}
                    variant="outline"
                    className="mt-2"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add Project
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Pro Tip
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Adding detailed work experience and projects helps employers
                    understand your capabilities and increases your chances of
                    getting matched with relevant opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Skills
        return (
          <div className="space-y-8">
            {/* Technical Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Zap className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Technical Skills
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the technical skills that apply to you
                </Label>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.technicalSkills) &&
                    formData.technicalSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer flex items-center gap-1 px-3 py-1"
                        onClick={() => toggleTechnicalSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                </div>

                {/* Add Skills Section */}
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Add Skills</div>

                  {/* Custom Skill Input */}
                  {/* <div className="flex gap-2">
                    <Input
                      placeholder="Type a skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          customSkill.trim() &&
                          !formData.technicalSkills.includes(customSkill.trim())
                        ) {
                          toggleTechnicalSkill(customSkill.trim());
                          setCustomSkill("");
                        }
                      }}
                      className="px-4 py-2 bg-[#33D6C4] text-white rounded-lg hover:bg-[#2bc0b0] transition"
                    >
                      Add
                    </button>
                  </div> */}

                  {/* Predefined Skills */}
                  <div className="flex flex-wrap gap-2">
                    {technicalSkillOptions
                      .filter(
                        (skill) => !formData.technicalSkills.includes(skill)
                      )
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleTechnicalSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Click a skill to add.
                  </p>
                </div>
              </div>
            </div>

            {/* Soft Skills Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Soft Skills
              </h3>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all the soft skills that apply to you
                </Label>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.softSkills) &&
                    formData.softSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                        onClick={() => toggleSoftSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                </div>

                {/* Add Skills Section */}
                <div className="mt-4 border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Add Skills</div>

                  {/* Custom Skill Input */}
                  {/* <div className="flex gap-2">
                    <Input
                      placeholder="Type a soft skill"
                      value={customSoftSkill}
                      onChange={(e) => setCustomSoftSkill(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          customSoftSkill.trim() &&
                          !formData.softSkills.includes(customSoftSkill.trim())
                        ) {
                          toggleSoftSkill(customSoftSkill.trim());
                          setCustomSoftSkill("");
                        }
                      }}
                      className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#e85d3d] transition"
                    >
                      Add
                    </button>
                  </div> */}

                  {/* Predefined Skills */}
                  <div className="flex flex-wrap gap-2">
                    {softSkillOptions
                      .filter((skill) => !formData.softSkills.includes(skill))
                      .map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#EDEFF2]"
                          onClick={() => toggleSoftSkill(skill)}
                        >
                          + {skill}
                        </Badge>
                      ))}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Click a skill to add.
                  </p>
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                  Languages
                </h3>
                <Button
                  onClick={addLanguage}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Language
                </Button>
              </div>

              {formData.languages.map((lang, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`language-${index}`}>Language</Label>
                    <Input
                      id={`language-${index}`}
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, "language", e.target.value)
                      }
                      placeholder="e.g., English"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`proficiency-${index}`}>Proficiency</Label>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) =>
                        updateLanguage(index, "proficiency", value)
                      }
                    >
                      <SelectTrigger id={`proficiency-${index}`}>
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Fluent">Fluent</SelectItem>
                        <SelectItem value="Native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLanguage(index)}
                    className="mb-2"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    AI-Powered Skill Matching
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Our AI will analyze your skills to match you with the most
                    relevant job opportunities. The more skills you add, the
                    better your matches will be.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Preferences
        return (
          <div className="space-y-8">
            {/* Job Types Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <BriefcaseIcon className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Job Types
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select all job types you're interested in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((jobType) => (
                    <Badge
                      key={jobType}
                      variant={
                        formData.jobTypes.includes(jobType)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.jobTypes.includes(jobType)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleJobType(jobType)}
                    >
                      {formData.jobTypes.includes(jobType)
                        ? `${jobType} ✓`
                        : jobType}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                {/* <DollarSign className="mr-2 h-5 w-5 text-[#33D6C4]" /> */}
                ₹Salary Expectations
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Annual Salary (INR)</Label>
                  <span className="font-medium">
                    ₹
                    {Number.parseInt(
                      formData.salaryExpectation || 0
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <Slider
                  value={[Number.parseInt(formData.salaryExpectation || 0)]}
                  min={30000}
                  max={1050000}
                  step={5000}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      salaryExpectation: value[0].toString(),
                    })
                  }
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹30,000</span>
                  <span>₹10,50,000+</span>
                </div>
              </div>
            </div>

            {/* Location Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <MapPinned className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Location Preferences
              </h3>

              <div className="space-y-4">
                {/* Willing to relocate switch */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="relocate"
                    checked={formData.willingToRelocate}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, willingToRelocate: checked })
                    }
                  />
                  <Label htmlFor="relocate">Willing to relocate</Label>
                </div>

                {/* Preferred locations */}
                <div className="space-y-2">
                  <Label>Preferred Locations</Label>

                  {formData.preferredLocations.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.preferredLocations.map((location, index) => (
                        <Badge
                          key={`${location}-${index}`}
                          variant="secondary"
                          className="bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer flex items-center gap-1 px-3 py-1"
                        >
                          {location}
                          <X
                            className="h-3 w-3 ml-1"
                            onClick={() => removeLocation(location)}
                          />
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No locations added yet.
                    </p>
                  )}

                  {/* Input + Add button */}
                  <div className="flex gap-2">
                    <Input
                      id="new-location"
                      placeholder="Add a location (e.g., Bengaluru, Karnataka, India)"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value) {
                            addLocation(value);
                            e.currentTarget.value = "";
                          } else {
                            toast({
                              title: "Invalid Input",
                              description: "Please enter a valid location.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById("new-location");
                        const value = input.value.trim();
                        if (value) {
                          addLocation(value);
                          input.value = "";
                        } else {
                          toast({
                            title: "Invalid Input",
                            description: "Please enter a valid location.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Environment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Building className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Work Environment
              </h3>
              <div className="space-y-2">
                <Label>Preferred Work Environment</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {workEnvironments.map((env) => (
                    <Button
                      key={env}
                      type="button"
                      variant={
                        formData.workEnvironment === env ? "default" : "outline"
                      }
                      className={
                        formData.workEnvironment === env
                          ? "bg-[#FF5E3A] hover:bg-[#e04c2b]"
                          : ""
                      }
                      onClick={() =>
                        setFormData({ ...formData, workEnvironment: env })
                      }
                    >
                      {env}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Industry Preferences
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select industries you're interested in working in
                </Label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={
                        formData.preferredIndustries.includes(industry)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredIndustries.includes(industry)
                          ? "bg-[#33D6C4] text-white hover:bg-[#2bc0b0] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleIndustry(industry)}
                    >
                      {formData.preferredIndustries.includes(industry)
                        ? `${industry} ✓`
                        : industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Size */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-[#33D6C4]" />
                Company Size
              </h3>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Select preferred company sizes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {companySizes.map((size) => (
                    <Badge
                      key={size}
                      variant={
                        formData.preferredCompanySize.includes(size)
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        formData.preferredCompanySize.includes(size)
                          ? "bg-[#FF6B4A] text-white hover:bg-[#e85d3d] cursor-pointer"
                          : "cursor-pointer hover:bg-[#EDEFF2]"
                      }
                      onClick={() => toggleCompanySize(size)}
                    >
                      {formData.preferredCompanySize.includes(size)
                        ? `${size} ✓`
                        : size}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Target className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                Career Goals
              </h3>
              <div className="space-y-2">
                <Label htmlFor="career-goals">
                  Describe your career goals and aspirations
                </Label>
                <Textarea
                  id="career-goals"
                  value={formData.careerGoals}
                  onChange={(e) =>
                    setFormData({ ...formData, careerGoals: e.target.value })
                  }
                  placeholder="What are your short and long-term career goals? What kind of role are you looking for next?"
                  rows={4}
                />
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 text-[#FF5E3A] dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    AI-Powered Job Matching
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Your preferences help our AI match you with jobs that align
                    with your career goals and work style. Be specific about
                    what matters most to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              Step {currentStep} Content
            </h3>
            <p className="text-muted-foreground">
              This step is under construction. Continue to see the complete
              flow.
            </p>
          </div>
        );
    }
  };

  const submitProfileToBackend = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Fetch token here

      const formDataToSend = new FormData();
      formDataToSend.append("first_name", formData.firstName || "");
      formDataToSend.append("last_name", formData.lastName || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("location", formData.location || "");
      formDataToSend.append("date_of_birth", formData.dateOfBirth || "");
      formDataToSend.append("bio", formData.bio || "");
      formDataToSend.append("university", formData.university || "");
      formDataToSend.append("degree", formData.degree || "");
      formDataToSend.append("major", formData.major || "");
      formDataToSend.append("graduation_year", formData.graduationYear || "");
      formDataToSend.append("gpa", formData.gpa || "");
      formDataToSend.append(
        "additional_education",
        JSON.stringify(formData.additionalEducation || [])
      );
      formDataToSend.append(
        "work_experiences",
        JSON.stringify(formData.workExperiences || [])
      );
      formDataToSend.append(
        "projects",
        JSON.stringify(formData.projects || [])
      );
      formDataToSend.append(
        "technical_skills",
        JSON.stringify(formData.technicalSkills || [])
      );
      formDataToSend.append(
        "soft_skills",
        JSON.stringify(formData.softSkills || [])
      );
      formDataToSend.append(
        "languages",
        JSON.stringify(formData.languages || [])
      );
      formDataToSend.append(
        "job_types",
        JSON.stringify(formData.jobTypes || [])
      );
      formDataToSend.append(
        "salary_expectation",
        formData.salaryExpectation || ""
      );
      formDataToSend.append(
        "willing_to_relocate",
        formData.willingToRelocate ? "true" : "false"
      );
      formDataToSend.append(
        "preferred_locations",
        JSON.stringify(formData.preferredLocations || [])
      );
      formDataToSend.append(
        "preferred_industries",
        JSON.stringify(formData.preferredIndustries || [])
      );
      formDataToSend.append(
        "preferred_company_size",
        JSON.stringify(formData.preferredCompanySize || [])
      );
      formDataToSend.append("work_environment", formData.workEnvironment || "");
      formDataToSend.append("career_goals", formData.careerGoals || "");
      formDataToSend.append("currentStep", currentStep.toString());
      formDataToSend.append("isDraft", "true");
      formDataToSend.append("lastSaved", new Date().toISOString());

      if (profilePhoto && profilePhoto instanceof File) {
        formDataToSend.append("profile_photo", profilePhoto);
      }

      const profileResponse = await fetch(
        "https://www.jobraze.in/api/save_profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
          credentials: "include",
        }
      );
      if (!profileResponse.ok) throw new Error("Failed to save profile");

      // Submit education
      const educationResponse = await fetch(
        "https://www.jobraze.in/api/save_education",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university: formData.university,
            degree_level: formData.degree,
            major: formData.major,
            graduation_year: formData.graduationYear,
            cgpa: formData.gpa,
            additional_info: formData.additionalEducation.join(", "),
          }),
        }
      );
      if (!educationResponse.ok) throw new Error("Failed to save education");

      // Submit experience
      if (formData.workExperiences.length > 0) {
        const exp =
          formData.workExperiences[formData.workExperiences.length - 1];
        const experienceResponse = await fetch(
          "https://www.jobraze.in/api/save_experience",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              work_experience: exp.title,
              job_title: exp.title,
              company: exp.company,
              location: exp.location,
              start_date: exp.startDate,
              end_date: exp.endDate,
              description: exp.description,
            }),
          }
        );
        if (!experienceResponse.ok)
          throw new Error("Failed to save experience");
      }

      // Submit project
      if (formData.projects.length > 0) {
        const proj = formData.projects[formData.projects.length - 1];
        const projectResponse = await fetch(
          "https://www.jobraze.in/api/save_project",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_title: proj.title,
              project_url: proj.url,
              start_date: proj.startDate,
              end_date: proj.endDate,
              description: proj.description,
            }),
          }
        );
        if (!projectResponse.ok) throw new Error("Failed to save project");
      }

      // Submit skills
      const skillsResponse = await fetch(
        "https://www.jobraze.in/api/save_skills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            technical_skills: formData.technicalSkills.join(", "),
            soft_skills: formData.softSkills.join(", "),
            language:
              formData.languages.length > 0
                ? formData.languages[0].language
                : "",
            proficiency:
              formData.languages.length > 0
                ? formData.languages[0].proficiency
                : "",
          }),
        }
      );
      if (!skillsResponse.ok) throw new Error("Failed to save skills");

      // Submit preferences
      const preferencesResponse = await fetch(
        "https://www.jobraze.in/api/save_preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_types: formData.jobTypes.join(", "),
            salary_expectations: formData.salaryExpectation,
            location_preferences: formData.preferredLocations.join(", "),
            work_environment: formData.workEnvironment,
            industry_preferences: formData.preferredIndustries.join(", "),
            company_size: formData.preferredCompanySize.join(", "),
            career_goals: formData.careerGoals,
          }),
        }
      );
      if (!preferencesResponse.ok)
        throw new Error("Failed to save preferences");

      console.log("Profile successfully submitted to backend");
    } catch (error) {
      console.error("Error submitting profile to backend:", error);
      throw error;
    }
  };
  const radarChartScores = {
    communication: aiResults?.scores?.soft_skills_score || 0,
    leadership: aiResults?.scores?.qualification_score || 0,
    technical: aiResults?.scores?.skill_score || 0,
    domain: aiResults?.scores?.qualification_score || 0,
    problemSolving: aiResults?.scores?.profile_score || 0,
  };
  const getLearningResource = (skill) => {
    const resources = {
      Python: "Learn Python from Coursera, W3Schools, or Codecademy.",
      NumPy: "Start with NumPy tutorials on W3Schools or DataCamp.",
      Pandas: "Explore Pandas with real-world data on Kaggle or DataCamp.",
      "scikit-learn":
        "Take scikit-learn crash courses on YouTube or Coursera’s ML specialization.",
      TensorFlow:
        "Use TensorFlow official docs and Coursera's Deep Learning AI.",
    };
    return resources[skill] || `Explore online resources to learn ${skill}.`;
  };

  const renderStars = (skill) => {
    const ratings = {
      Python: 5,
      NumPy: 4,
      Pandas: 4,
      "scikit-learn": 3,
      TensorFlow: 5,
    };

    const rating = ratings[skill] || 3; // default fallback

    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // If we're in recommendations view, render the recommendations page
  if (showRecommendationsView && aiResults) {
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Detailed Recommendations</h1>
              <p className="text-muted-foreground">
                Based on your profile analysis, here are detailed
                recommendations to improve your market readiness.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/individual/profile")}
              className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreCard
              label="Profile Score"
              score={aiResults.scores?.profile_score || 0}
              color="#3b82f6"
            />
            <ScoreCard
              label="Skill Score"
              score={aiResults.scores?.skill_score || 0}
              color="#10b981"
            />
            <ScoreCard
              label="Qualification Score"
              score={aiResults.scores?.qualification_score || 0}
              color="#3b82f6"
            />
            <ScoreCard
              label="Soft Skill Score"
              score={aiResults.scores?.soft_skills_score || 0}
              color="#f59e0b"
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Recommendations */}
            <div className="flex-1 min-w-0 space-y-6">
              <Dialog>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      Profile Analysis & Recommendations
                    </DialogTitle>
                  </DialogHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white w-1/4">
                            Category
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white w-20">
                            Status
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Strengths Section */}
                        {aiResults?.evaluation?.gap_analysis?.strengths
                          ?.length > 0 &&
                          aiResults.evaluation.gap_analysis.strengths.map(
                            (strength, index) => (
                              <tr
                                key={`strength-${index}`}
                                className="hover:bg-green-50 dark:hover:bg-green-900/10"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 ? "Strengths" : ""}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  {strength}
                                </td>
                              </tr>
                            )
                          )}

                        {/* Areas for Improvement Section */}
                        {aiResults?.evaluation?.gap_analysis?.weaknesses
                          ?.length > 0 &&
                          aiResults.evaluation.gap_analysis.weaknesses.map(
                            (weakness, index) => (
                              <tr
                                key={`weakness-${index}`}
                                className="hover:bg-yellow-50 dark:hover:bg-yellow-900/10"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 ? "Areas for Improvement" : ""}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  {weakness}
                                </td>
                              </tr>
                            )
                          )}

                        {/* Recommendations Section */}
                        {aiResults?.evaluation?.recommendations?.length > 0 &&
                          aiResults.evaluation.recommendations.map(
                            (rec, index) => (
                              <tr
                                key={`recommendation-${index}`}
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/10"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 ? "Recommendations" : ""}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  {typeof rec === "object"
                                    ? rec.course_name ||
                                      rec.description ||
                                      "Unnamed Course"
                                    : rec}
                                </td>
                              </tr>
                            )
                          )}

                        {/* Skill Development Pathway Section */}
                        {aiResults?.evaluation?.skill_pathway?.length > 0 &&
                          aiResults.evaluation.skill_pathway.map(
                            (item, index) => {
                              const text =
                                typeof item === "string"
                                  ? item
                                  : item.current_skill
                                  ? `From ${item.current_skill} to ${
                                      item.next_skill || "next level"
                                    }`
                                  : JSON.stringify(item);

                              return (
                                <tr
                                  key={`pathway-${index}`}
                                  className="hover:bg-purple-50 dark:hover:bg-purple-900/10"
                                >
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {index === 0
                                      ? "Skill Development Pathway"
                                      : ""}
                                  </td>
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto"></div>
                                  </td>
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    {text}
                                  </td>
                                </tr>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </DialogContent>
              </Dialog>
              {/* </CardContent>
              </Card> */}
            </div>

            {/* Right: Radar Chart */}
            <div className="w-full lg:w-[400px] shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Skill distrubtion Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4">
                    {/* <RadarSkillChart scores={radarChartScores} /> */}
                    <PieSkillChart scores={radarChartScores} />
                    <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Visual representation of your profile's key competencies
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
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
    >
      {/* <ToastContainer position="top-center" autoClose={3000} /> */}

      {/* Market Readiness Prompt */}
      <Dialog open={showMarketReadinessPrompt} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          {!isLoading && !showResults && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
                  Market Readiness Assessment
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Are you interested to know where you stand currently in terms
                  of market readiness?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => {
                    setShowMarketReadinessPrompt(false);
                    router.push("/individual/dashboard");
                  }}
                  disabled={isLoading}
                >
                  No
                </Button>

                <Button
                  className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      console.log("Calling AI review API...");
                      const response = await fetch(
                        "https://www.jobraze.in/api/ai-review/generate-scores",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            email: formData.email,
                          }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error("Failed to generate AI review");
                      }

                      const result = await response.json();
                      setAiResults(result);
                      setShowResults(true);
                    } catch (error) {
                      console.error("Error generating AI review:", error);
                      toast({
                        title: "Error",
                        description:
                          "Failed to generate AI review. Please try again.",
                        variant: "destructive",
                      });
                      setShowMarketReadinessPrompt(false);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Yes"}
                </Button>
              </DialogFooter>
            </>
          )}

          {isLoading && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
                  Analyzing Profile
                </DialogTitle>
              </DialogHeader>
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5E3A] mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-center font-semibold">
                  Analyzing your profile...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 font-medium">
                  This may take a moment
                </p>
              </div>
            </>
          )}
          {showResults && aiResults && (
            <>
              {console.log("Profile score:", aiResults.scores?.profile_score)}
              {console.log(
                "Raw profile score value:",
                aiResults.scores?.profile_score
              )}
              {console.log("Full aiResults object:", aiResults)}
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
                    Profile Analysis Complete
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
                    Here's how your profile looks
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <ScoreCard
                      label="Profile Score"
                      score={aiResults.scores?.profile_score || 0}
                      color="#3b82f6"
                    />
                    <ScoreCard
                      label="Skill Score"
                      score={aiResults.scores?.skill_score || 0}
                      color="#10b981"
                    />
                    <ScoreCard
                      label="Qualification Score"
                      score={aiResults.scores?.qualification_score || 0}
                      color="#3b82f6"
                    />
                    <ScoreCard
                      label="Soft Skill Score"
                      score={aiResults.scores?.soft_skills_score || 0}
                      color="#f59e0b"
                    />
                  </div>

                  {aiResults.evaluation?.gap_analysis?.strengths?.length >
                    0 && (
                    <div>
                      <h4 className="font-medium mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.strengths.map(
                          (strength, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-8 w-8 text-green-500 mr-2 mt-0.5"
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
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {aiResults.evaluation?.gap_analysis?.weaknesses?.length >
                    0 && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {aiResults.evaluation.gap_analysis.weaknesses.map(
                          (weakness, index) => (
                            <li key={index} className="flex items-center">
                              <svg
                                className="h-7 w-7 text-yellow-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">
                                {weakness}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowMarketReadinessPrompt(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMarketReadinessPrompt(false);
                      setShowDetailedRecommendations(true);
                    }}
                    className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
                  >
                    View Detailed Recommendations
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Photo Upload Confirmation Dialog */}
      <Dialog open={showPhotoConfirm} onOpenChange={setShowPhotoConfirm}>
        <DialogContent className="sm:max-w-[500px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold">
              Confirm Profile Photo Upload
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              Are you sure you want to upload this new profile photo? This will
              replace your current photo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <img
              src={pendingPhotoPreview}
              alt="New Profile Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => {
                setShowPhotoConfirm(false);
                setPendingPhoto(null);
                setPendingPhotoPreview(null);
                // Clear the input field
                document.getElementById("photo-upload").value = "";
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
              onClick={() => {
                setProfilePhoto(pendingPhoto);
                setProfilePhotoPreview(pendingPhotoPreview);
                setShowPhotoConfirm(false);
                setPendingPhoto(null);
                setPendingPhotoPreview(null);
                toast.success("Profile photo uploaded successfully!", {
                  position: "top-center",
                  autoClose: 3000,
                });
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showReanalysisRestrictionDialog}
        onOpenChange={setShowReanalysisRestrictionDialog}
      >
        <DialogContent className="sm:max-w-[500px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white text-xl font-bold flex items-center">
              <svg
                className="h-6 w-6 text-orange-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Re-analysis Not Available
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-base">
              You can only re-analyze your profile once every 30 days to ensure
              meaningful progress tracking.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg
                  className="h-5 w-5 text-orange-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-orange-800 dark:text-orange-200">
                  Time Remaining
                </span>
              </div>
              <p className="text-orange-700 dark:text-orange-300 text-lg font-semibold">
                {daysUntilReanalysis} days remaining
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Last analysis:{" "}
                {lastAnalysisDate
                  ? new Date(lastAnalysisDate).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-start">
                <svg
                  className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Use this time to work on the recommendations from your last
                analysis
              </p>
              <p className="flex items-start">
                <svg
                  className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Update your profile with new skills and experiences
              </p>
              <p className="flex items-start">
                <svg
                  className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Complete courses and certifications to improve your scores
              </p>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReanalysisRestrictionDialog(false)}
              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              I Understand
            </Button>
            <Button
              onClick={() => {
                setShowReanalysisRestrictionDialog(false);
                setShowDetailedRecommendations(true);
              }}
              className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
            >
              View Current Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="mt-8" // 👈 Tailwind (or use CSS below)
      />

      {/* Conditional rendering: Show either the main profile content or the detailed recommendations page */}
      {!showDetailedRecommendations ? (
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and career details
            </p>
          </div>
          {hasEvaluationResult && (
            <div className="flex justify-center mt-6">
              <Button
                className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
                onClick={() => {
                  setShowResults(false);
                  setShowMarketReadinessPrompt(false);
                  setShowDetailedRecommendations(true);
                }}
              >
                View Results
              </Button>
            </div>
          )}
          {evaluationAvailable && (
            <Button
              // onClick={() => setShowEvaluation(true)}
              // onClick={() => {
              //   setShowEvaluation(true);
              // }}
              onClick={handleViewEvaluation}
              className="bg-[#FF5E3A] hover:bg-[#e8552e] text-white rounded-md"
              style={{ backgroundColor: "#28564F", border: "none" }}
            >
              Actual Evaluation
            </Button>
          )}

          {/* Step Navigation */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-0">
                    <div
                      className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${
                      currentStep >= step.id
                        ? "bg-[#FF5E3A] text-white"
                        : "bg-[#EDEFF2] text-[#6C757D]"
                    }
                  `}
                    >
                      {step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                    w-12 h-0.5 mx-4 mt-5
                    ${currentStep > step.id ? "bg-[#FF5E3A]" : "bg-[#EDEFF2]"}
                  `}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              {/* <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
              >
                Save Draft
              </Button> */}
              <Button
                variant="outline"
                onClick={() => handleSaveDraft(false)} // ✅ pass false explicitly
                className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
              >
                Save Draft
              </Button>

              {/* {currentStep === steps.length ? (
                hasEvaluationResult ? (
                  <Button
                    onClick={handleMarketReadinessConfirm}
                    className="bg-[#FF5E3A] hover:bg-[#e04c2b] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Analyzing..." : "Re-analyze Profile"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
                  >
                    Complete Profile
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )} */}

              {currentStep === steps.length ? (
                hasEvaluationResult ? (
                  // <Button
                  //   onClick={() => {
                  //     if (!canReanalyze) {
                  //       setShowReanalysisRestrictionDialog(true);
                  //     } else {
                  //       handleMarketReadinessConfirm();
                  //     }
                  //   }}
                  //   className="bg-[#FF5E3A] hover:bg-[#e04c2b] text-white"
                  //   disabled={isLoading}
                  // >
                  //   {isLoading ? "Analyzing..." : "Re-analyze Profile"}
                  // </Button>
                  // Replace your current button onClick handler with this:

                  <Button
                    variant="outline"
                    className="border-[#FF5E3A] text-[#FF5E3A] hover:bg-[#FF5E3A] hover:text-white rounded-md"
                    onClick={handleReanalyzeButtonClick} // Use the new handler
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Analyzing..."
                      : canReanalyze
                      ? "Re-analyze Profile"
                      : `Re-analyze (${daysUntilReanalysis} days)`}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
                  >
                    Complete Profile
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-[#FF5E3A] hover:bg-[#e04c2b]"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : showEvaluation ? (
        // ---------------- ACTUAL EVALUATION ----------------
        <div className="mt-6 p-6 border rounded-lg shadow bg-white">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Actual Evaluation Report
          </h2>

          {/* Back Button */}
          <button
            onClick={() => setShowEvaluation(false)}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ← Back to Profile
          </button>

          {/* Overall Score & Assessment */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold">Overall Score</h3>
            <p className="text-xl text-blue-600 font-bold">
              {evaluationData.overall_score?.toFixed(2)}%
            </p>
            <p className="text-gray-600">
              {evaluationData.overall_assessment?.summary}
            </p>
            <p className="text-sm text-gray-500">
              Level: {evaluationData.overall_assessment?.level} | Score:{" "}
              {evaluationData.overall_assessment?.score}
            </p>
          </div>

          {/* Skill Summary */}
          {evaluationData.skill_summary && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Skill Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(evaluationData.skill_summary).map(
                  ([skill, details]) => (
                    <div
                      key={skill}
                      className="p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <h4 className="text-lg font-semibold text-gray-700">
                        {skill}
                      </h4>
                      {details.score !== undefined && (
                        <p>Score: {details.score}%</p>
                      )}
                      {details.level && <p>Level: {details.level}</p>}

                      {/* Strengths */}
                      {details.strengths?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-green-600">
                            Strengths:
                          </p>
                          <ul className="list-disc ml-5 text-sm">
                            {details.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {details.weaknesses?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-yellow-600">
                            Weaknesses:
                          </p>
                          <ul className="list-disc ml-5 text-sm">
                            {details.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {details.recommendations?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-blue-600">
                            Recommendations:
                          </p>
                          <ul className="list-disc ml-5 text-sm">
                            {details.recommendations.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {details.code_performance && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Code Performance:</strong>{" "}
                          {details.code_performance}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Per-question Breakdown */}
          {evaluationData.skill_breakdown &&
            Object.entries(evaluationData.skill_breakdown).map(
              ([skill, details]) => (
                <div
                  key={skill}
                  className="mt-8 p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {skill} – Questions
                  </h3>
                  <table className="w-full border text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Question</th>
                        <th className="p-2 border">Your Answer</th>
                        <th className="p-2 border">Correct Answer</th>
                        <th className="p-2 border">Correct?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.questions?.map((q, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{q.question}</td>
                          <td className="p-2 border">{q.user_answer}</td>
                          <td className="p-2 border">{q.correct_answer}</td>
                          <td className="p-2 border">
                            {q.is_correct ? "✅" : "❌"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

          {/* Global Sections */}
          {evaluationData.strengths?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-green-700">
                Overall Strengths
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluationData.weaknesses?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-yellow-700">
                Overall Weaknesses
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluationData.recommendations?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-blue-700">
                Overall Recommendations
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Path */}
          {evaluationData.learning_path?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Learning Path</h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.learning_path.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Immediate Actions */}
          {evaluationData.immediate_actions?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-red-600">
                Immediate Actions
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.immediate_actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Long-Term Goals */}
          {evaluationData.long_term_goals?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-purple-600">
                Long-Term Goals
              </h3>
              <ul className="list-disc ml-5 text-sm">
                {evaluationData.long_term_goals.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Detailed Recommendations Page */
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Profile Analysis & Recommendations
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive analysis of your profile with personalized
                recommendations
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDetailedRecommendations(false)}
              className="border-[#EDEFF2] text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#2A2D34]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
          {/* Score Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              ["Profile", "#3b82f6"],
              ["Skill", "#10b981"],
              ["Qualification", "#3b82f6"],
              ["Soft Skills", "#f59e0b"],
            ].map(([label, color]) => (
              <div key={label} className="scorecard-label-override">
                <ScoreCard
                  label={`${label} Score`}
                  score={
                    aiResults.scores?.[
                      `${label.toLowerCase().replace(/\s+/g, "_")}_score`
                    ] || 0
                  }
                  color={color}
                />
              </div>
            ))}
          </div>
          {/* Main Content Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Analysis Table */}
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                    Profile Analysis Overview
                  </CardTitle>
                  <CardDescription>
                    Strengths, areas for improvement, and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-1/4">
                            Category
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-16">
                            Status
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Strengths Section */}
                        {aiResults?.evaluation?.gap_analysis?.strengths
                          ?.length > 0 &&
                          aiResults.evaluation.gap_analysis.strengths.map(
                            (strength, index) => (
                              <tr
                                key={`strength-${index}`}
                                className="hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors duration-200"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 && (
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                      <span className="font-semibold text-green-700 dark:text-green-300">
                                        Strengths
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-green-500 rounded-full mx-auto shadow-sm"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  <div className="flex items-start">
                                    <svg
                                      className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
                                    {strength}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}

                        {/* Areas for Improvement Section */}
                        {aiResults?.evaluation?.gap_analysis?.weaknesses
                          ?.length > 0 &&
                          aiResults.evaluation.gap_analysis.weaknesses.map(
                            (weakness, index) => (
                              <tr
                                key={`weakness-${index}`}
                                className="hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-colors duration-200"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 && (
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                      <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                                        Areas for Improvement
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto shadow-sm"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  <div className="flex items-start">
                                    <svg
                                      className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                                      />
                                    </svg>
                                    {weakness}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}

                        {/* Recommendations Section */}
                        {aiResults?.evaluation?.recommendations?.length > 0 &&
                          aiResults.evaluation.recommendations.map(
                            (rec, index) => (
                              <tr
                                key={`recommendation-${index}`}
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                              >
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {index === 0 && (
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                                        Recommendations
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                  <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto shadow-sm"></div>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                  <div className="flex items-start">
                                    <svg
                                      className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                      />
                                    </svg>
                                    {typeof rec === "object"
                                      ? rec.course_name ||
                                        rec.description ||
                                        "Unnamed Course"
                                      : rec}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Development Pathway */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-[#33D6C4]" />
                    Skill Development Pathway
                  </CardTitle>
                  <CardDescription>
                    Personalized learning path based on your current skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-1/4">
                            Skill
                          </th>
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-20">
                            Level
                          </th>
                          {/* <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-24">
                            Rating
                          </th> */}
                          <th className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Learning Resources
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Individual Skills from Pathway */}
                        {aiResults?.evaluation?.skill_pathway?.length > 0 &&
                          aiResults.evaluation.skill_pathway
                            .filter((s) => typeof s === "string")
                            .map((skill, index) => {
                              const skillHeading = skill.includes(":")
                                ? skill.split(":")[0].trim()
                                : skill;

                              const getSkillStatus = (skillName) => {
                                const skillText = skill.toLowerCase();
                                if (
                                  skillText.includes("basic") ||
                                  skillText.includes("beginner") ||
                                  skillText.includes("fundamental") ||
                                  skillText.includes("improve")
                                ) {
                                  return {
                                    level: "Beginner",
                                    color: "bg-red-500",
                                    textColor: "text-red-700 dark:text-red-300",
                                    bgColor: "bg-red-50 dark:bg-red-900/20",
                                    hoverColor:
                                      "hover:bg-red-50 dark:hover:bg-red-900/10",
                                  };
                                } else if (
                                  skillText.includes("intermediate") ||
                                  skillText.includes("moderate") ||
                                  skillText.includes("developing")
                                ) {
                                  return {
                                    level: "Intermediate",
                                    color: "bg-yellow-500",
                                    textColor:
                                      "text-yellow-700 dark:text-yellow-300",
                                    bgColor:
                                      "bg-yellow-50 dark:bg-yellow-900/20",
                                    hoverColor:
                                      "hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
                                  };
                                } else {
                                  return {
                                    level: "Advanced",
                                    color: "bg-green-500",
                                    textColor:
                                      "text-green-700 dark:text-green-300",
                                    bgColor: "bg-green-50 dark:bg-green-900/20",
                                    hoverColor:
                                      "hover:bg-green-50 dark:hover:bg-green-900/10",
                                  };
                                }
                              };

                              const skillStatus = getSkillStatus(skillHeading);

                              return (
                                <tr
                                  key={`skill-${index}`}
                                  className={`${skillStatus.hoverColor} transition-colors duration-200`}
                                >
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    <div className="flex items-center">
                                      <div
                                        className={`w-2 h-2 ${skillStatus.color} rounded-full mr-3`}
                                      ></div>
                                      {skillHeading}
                                    </div>
                                  </td>
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${skillStatus.bgColor} ${skillStatus.textColor}`}
                                    >
                                      {skillStatus.level}
                                    </span>
                                  </td>
                                  {/* <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-center text-yellow-500 text-sm">
                                    {renderStars && renderStars(skillHeading)}
                                  </td> */}
                                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex items-start">
                                      <svg
                                        className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                      </svg>
                                      {getLearningResource &&
                                        getLearningResource(skillHeading)}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Radar Chart & Summary */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-[#FF5E3A]" />
                    Skills Overview
                  </CardTitle>
                  <CardDescription>
                    Visual representation of your competencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Radar Chart */}
                    <div className="flex justify-center">
                      {showResults && aiResults && (
                        // <RadarSkillChart scores={radarChartScores} />
                        <PieSkillChart scores={radarChartScores} />
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        Quick Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          {/* <span className="text-xs text-gray-600 dark:text-gray-400">
                            Overall Score
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round(
                              ((aiResults.scores?.profile_score || 0) +
                                (aiResults.scores?.skill_score || 0) +
                                (aiResults.scores?.qualification_score || 0) +
                                (aiResults.scores?.soft_skills_score || 0)) /
                                4
                            )}
                            /5
                          </span> */}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Strengths
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {aiResults?.evaluation?.gap_analysis?.strengths
                              ?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Areas to Improve
                          </span>
                          <span className="text-sm font-medium text-yellow-600">
                            {aiResults?.evaluation?.gap_analysis?.weaknesses
                              ?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Recommendations
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {aiResults?.evaluation?.recommendations?.length ||
                              0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market fitment data */}

              {aiResults?.evaluation?.market_fitment &&
                (() => {
                  const summaryText = Array.isArray(
                    aiResults.evaluation.market_fitment.summary
                  )
                    ? aiResults.evaluation.market_fitment.summary.join(" ")
                    : aiResults.evaluation.market_fitment.summary;

                  // Extract salary ranges dynamically
                  const currentRange = parseSalaryRange(summaryText); // e.g., [3, 4]
                  const futureRangeMatches = summaryText.match(
                    /future.*₹?(\d+)[–-](\d+)\s*LPA/i
                  );
                  const futureRange = futureRangeMatches
                    ? [
                        parseInt(futureRangeMatches[1], 10),
                        parseInt(futureRangeMatches[2], 10),
                      ]
                    : null;

                  return (
                    <Card className="sticky top-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendingUp className="mr-2 h-5 w-5 text-[#33D6C4]" />
                          Market Fitment Analysis
                        </CardTitle>
                        <CardDescription>
                          Your current market readiness and positioning
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {/* <h5 className="font-medium text-gray-800 dark:text-gray-200">
                              Current Fit Level
                            </h5>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${
                                      aiResults.evaluation.market_fitment
                                        .fit_level === "emerging"
                                        ? "33%"
                                        : aiResults.evaluation.market_fitment
                                            .fit_level === "developing"
                                        ? "66%"
                                        : "100%"
                                    }`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {aiResults.evaluation.market_fitment.fit_level}
                              </span>
                            </div> 

                            {/* ✅ Display summary as bullet points */}
                            {Array.isArray(
                              aiResults.evaluation.market_fitment.summary
                            ) ? (
                              <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {aiResults.evaluation.market_fitment.summary.map(
                                  (point, idx) => (
                                    <li key={idx}>{point}</li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {aiResults.evaluation.market_fitment.summary}
                              </p>
                            )}
                            {/* ✅ Salary Potential Visualization */}
                            <div className="mt-4 space-y-4">
                              {currentRange && (
                                <div>
                                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                                    Current Earning Potential
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                      <div
                                        className="bg-yellow-500 h-2.5 rounded-full"
                                        style={{
                                          width: salaryToWidth(currentRange),
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-yellow-600">
                                      ₹{currentRange[0]}–{currentRange[1]} LPA
                                    </span>
                                  </div>
                                </div>
                              )}

                              {futureRange && (
                                <div>
                                  <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                                    Future Earning Potential (Following the
                                    Recommendation)
                                  </h5>
                                  <div className="flex items-center gap-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                      <div
                                        className="bg-green-500 h-2.5 rounded-full"
                                        style={{
                                          width: salaryToWidth(futureRange),
                                        }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-green-600">
                                      ₹{futureRange[0]}–{futureRange[1]} LPA
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function ProfileBuilder() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
