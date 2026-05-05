"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-circular-progressbar/dist/styles.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, BookOpen, Briefcase, TrendingUp, Brain } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import ScoreCard from "@/components/ScoreCard";
import ProfileForm from "@/components/ProfileForm";
import ProfileRecommendations from "@/components/ProfileRecommendations";
import ProfileEvaluation from "@/components/ProfileEvaluation";
import ProfileActualEvaluation from "@/components/ProfileActualEvaluation";

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

const technicalSkillOptions = [
  "Math Foundations",
  "Python",
  "Pytorch",
  "SQL",
  "Mongodb",
  "Machine Learning",
  "Deep Learning",
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
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

const workEnvironments = ["Remote", "Hybrid", "On-site", "Flexible"];

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
  const [formErrors, setFormErrors] = useState({});
  const [updatedEvaluationData, setUpdatedEvaluationData] = useState(null);
  const [showUpdatedEvaluation, setShowUpdatedEvaluation] = useState(false);
  const [hasEvaluationResult, setHasEvaluationResult] = useState(false);
  const [hasEvaluation, setHasEvaluation] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [hasDraftBeenLoaded, setHasDraftBeenLoaded] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
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
  const [showActualEvaluation, setShowActualEvaluation] = useState(false);
  const [showUpdatedResult, setShowUpdatedResult] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [canReanalyze, setCanReanalyze] = useState(true);
  const [daysUntilReanalysis, setDaysUntilReanalysis] = useState(0);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const autoSaveRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+91 ",
    location: "",
    dateOfBirth: "",
    bio: "",
    university: "",
    degree: "",
    major: "",
    graduationYear: "",
    gpa: "",
    additionalEducation: [],
    workExperiences: [],
    projects: [],
    technicalSkills: [],
    softSkills: [],
    languages: [{ language: "English", proficiency: "Native" }],
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

  useEffect(() => {
    const fetchEvaluation = async () => {
      // Hardcoded data as requested by user - Premium individual insights
      const hardcodedEvaluation = {
        gap_analysis: {
          strengths: [
            "Advanced Proficiency in Python & modern AI frameworks (PyTorch, TensorFlow)",
            "Strong understanding of Cloud-native AI deployment strategies",
            "Exceptional communication skills with ability to explain complex technical concepts",
            "Demonstrated excellence in individual project leadership and end-to-end execution"
          ],
          weaknesses: [
            "Opportunity to deepen expertise in vector database optimization (Milvus, Pinecone)",
            "Could further refine understanding of large-scale distributed training architectures",
            "Strategic roadmap could benefit from more focus on enterprise-grade security protocols for individual apps"
          ]
        },
        recommendations: [
          "Master 'Distributed Systems for AI' to understand how to scale localized LLM applications.",
          "Contribute to high-impact Open Source AI projects to solidify industry authority.",
          "Advanced certification in 'Generative AI Architecture' to stay ahead of the localized processing trend.",
          "Optimize local MongoDB instances for high-concurrency vector search simulations."
        ],
        skill_pathway: [
          "Python Mastery for AI",
          "Deep Learning Specialists Pathway",
          "Natural Language Processing (Advanced)",
          "Vector Databases & RAG Architectures",
          "Localized LLM Deployment (Llama 3.3 Mastery)"
        ],
        market_fitment: {
          fit_level: "High",
          summary: "Your current profile aligns exceptionally well with the emerging trend of 'On-device AI' and localized processing. You possess the core technical foundations that high-growth startups and innovative labs are seeking for their individual-centric AI solutions. By focusing on the refined recommendations, you will be positioned at the top 1% of AI practitioners for localized intelligence."
        }
      };

      setEvaluationData(hardcodedEvaluation);
      setEvaluationAvailable(true);
      
      // Optionally still try to fetch to keep the UI consistent, or just set it
      setHasEvaluationResult(true);
      setAiResults({
        scores: {
          profile_score: 92,
          qualification_score: 88,
          skill_score: 95,
          soft_skills_score: 90
        },
        evaluation: hardcodedEvaluation
      });
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

  const handleSelfEvaluationReport = () => {
    setShowReportOptions(false);
    setShowDetailedRecommendations(true);
  };

  // For the Reports modal - Actual Evaluation Report button:
  const handleActualEvaluationReport = () => {
    setShowReportOptions(false);
    setShowActualEvaluation(true);
    // Also fetch the updated evaluation data if needed
    fetchUpdatedEvaluation();
  };

  const fetchUpdatedEvaluation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://www.jobraze.in/api/actual-evaluation",
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
        throw new Error(
          `Failed to fetch updated evaluation: ${response.status}`
        );
      }

      const data = await response.json();
      setUpdatedEvaluationData(data);
      setShowUpdatedEvaluation(true);
      setShowDetailedRecommendations(false);
      setShowEvaluation(false);
    } catch (error) {
      console.error("Error fetching updated evaluation:", error);
      toast.error("Failed to load updated evaluation. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

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

      //  First calculate the photo Base64 for local storage only
      //  Convert photo to Base64 if available
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

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={userName}
      userEmail={userEmail}
      profilePhotoPreview={profilePhotoPreview} // Pass the profile photo preview
      setProfilePhotoPreview={setProfilePhotoPreview} // Pass the setter function
    >
      {/* Market rediness prompt */}
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

      {/* Photo confirm dialogue */}
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
        toastClassName="mt-8"
      />

      {/* Conditional Rendering - Now using sub-components */}
      {!showDetailedRecommendations &&
      !showActualEvaluation &&
      !showUpdatedResult ? (
        showEvaluation ? (
          <ProfileEvaluation
            evaluationData={evaluationData}
            setShowEvaluation={setShowEvaluation}
            setShowUpdatedResult={setShowUpdatedResult} // Add this prop if ProfileEvaluation needs back navigation
          />
        ) : (
          <ProfileForm
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            steps={steps}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            profilePhotoPreview={profilePhotoPreview}
            setProfilePhotoPreview={setProfilePhotoPreview}
            handlePhotoUpload={handlePhotoUpload}
            maxDate={maxDate}
            customSkill={customSkill}
            setCustomSkill={setCustomSkill}
            customSoftSkill={customSoftSkill}
            setCustomSoftSkill={setCustomSoftSkill}
            technicalSkillOptions={technicalSkillOptions}
            softSkillOptions={softSkillOptions}
            jobTypes={jobTypes}
            workEnvironments={workEnvironments}
            industries={industries}
            companySizes={companySizes}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleSaveDraft={handleSaveDraft}
            hasEvaluationResult={hasEvaluationResult}
            isLoading={isLoading}
            canReanalyze={canReanalyze}
            daysUntilReanalysis={daysUntilReanalysis}
            handleReanalyzeButtonClick={handleReanalyzeButtonClick}
            evaluationAvailable={evaluationAvailable}
            showReportOptions={showReportOptions}
            setShowReportOptions={setShowReportOptions}
            setShowDetailedRecommendations={setShowDetailedRecommendations}
            setShowActualEvaluation={setShowActualEvaluation} // Add this new prop
            fetchUpdatedEvaluation={fetchUpdatedEvaluation}
            toggleTechnicalSkill={toggleTechnicalSkill}
            addCustomSkill={addCustomSkill}
            toggleSoftSkill={toggleSoftSkill}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            toggleJobType={toggleJobType}
            addLocation={addLocation}
            removeLocation={removeLocation}
            toggleIndustry={toggleIndustry}
            toggleCompanySize={toggleCompanySize}
            addAdditionalEducation={addAdditionalEducation}
            updateAdditionalEducation={updateAdditionalEducation}
            removeAdditionalEducation={removeAdditionalEducation}
            addWorkExperience={addWorkExperience}
            updateWorkExperience={updateWorkExperience}
            removeWorkExperience={removeWorkExperience}
            addProject={addProject}
            updateProject={updateProject}
            removeProject={removeProject}
          />
        )
      ) : showDetailedRecommendations ? (
        // Self Evaluation Report - ProfileRecommendations.jsx
        <ProfileRecommendations
          aiResults={aiResults}
          showResults={showResults}
          setShowDetailedRecommendations={setShowDetailedRecommendations}
        />
      ) : showActualEvaluation ? (
        // Actual Evaluation Report - ProfileActualEvaluation.jsx
        <ProfileActualEvaluation
          actualResults={updatedEvaluationData}
          setShowActualEvaluation={setShowActualEvaluation}
          setShowUpdatedResult={setShowUpdatedResult} // New prop for Updated Result navigation
        />
      ) : showUpdatedResult ? (
        // Updated Result - ProfileEvaluation.jsx
        <ProfileEvaluation
          evaluationData={evaluationData}
          setShowEvaluation={setShowUpdatedResult} // This will close the Updated Result view
          // You might want to add a different prop name for clarity, like setShowUpdatedResult
        />
      ) : null}
    </DashboardLayout>
  );
}

export default function ProfileBuilder() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
