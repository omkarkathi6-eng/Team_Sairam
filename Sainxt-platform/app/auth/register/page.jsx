"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "individual",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // [id]: value,
      [id]: id === "email" ? value.toLowerCase().trim() : value,
    }));
  };


  const validateForm = () => {
    let requiredFields;

      // individual
      requiredFields = [
        { field: "firstName", label: "First Name" },
        { field: "lastName", label: "Last Name" },
        { field: "email", label: "Email" },
        { field: "password", label: "Password" },
      ];

    // Check all required fields
    for (const { field, label } of requiredFields) {
      if (!formData[field]?.trim()) {
        toast({
          title: "Error",
          description: `${label} is required`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "You must accept the terms and conditions",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Clear previous email errors

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsLoading(true);

    try {
      const apiEndpoint = "https://www.jobraze.in/api/create_account";

      // Prepare base user data
      const userData = {
        firstName: formData.firstName || "User",
        lastName: formData.lastName || "User",
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        userType: "individual",
        phone: formData.phone || "",
      };

      console.log("Sending request to:", apiEndpoint);
      console.log("Request data:", JSON.stringify(userData, null, 2));

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // Include cookies for session handling
      });

      const data = await response.json().catch(() => ({
        detail: "Invalid server response",
      }));

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        if (
          response.status === 400 &&
          (data.detail === "Account already exists" ||
            data.detail?.includes("already exists"))
        ) {
          setEmailError(
            "An account with this email already exists. Please use a different email or log in."
          );
          setFormData((prev) => ({
            ...prev,
            email: "",
          }));
          return;
        }

        // Handle validation errors
        if (response.status === 422 && data.detail) {
          const errorMessages = Array.isArray(data.detail)
            ? data.detail.map((err) => `${err.loc[1]}: ${err.msg}`).join("\n")
            : data.detail;
          throw new Error(`Validation error: ${errorMessages}`);
        }

        throw new Error(
          data.detail ||
            data.message ||
            `HTTP error! status: ${response.status}`
        );
      }

      // Redirect to success page
      router.push("/auth/register/success");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary relative overflow-hidden flex items-center justify-center p-4">
      {/* AI Circuit Background */}
      <div className="absolute inset-0 bg-ai-circuit opacity-30" />

      {/* Floating AI Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-aqua-blue/20 to-neon-coral/20 rounded-full animate-ai-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-neon-coral/20 to-electric-orange/20 rounded-full animate-ai-pulse" />
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-gradient-to-r from-electric-orange/20 to-aqua-blue/20 rounded-full animate-ai-pulse" />

      {/* Email already exists alert */}
      {emailError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Account Exists</p>
                <p className="text-sm">{emailError}</p>
              </div>
              <button
                onClick={() => setEmailError("")}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <Card className="w-full max-w-lg relative z-10 card-ai-enhanced shadow-enterprise-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
              <Sparkles className="h-7 w-7 text-aqua-blue" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-deep-navy">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-text-gray">
            Join us to transform your AI-powered career journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 mt-2">

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-deep-navy font-medium"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      autoComplete="given-name"
                      className="bg-surface-tertiary border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-deep-navy font-medium"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      autoComplete="family-name"
                      className="bg-surface-tertiary border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-deep-navy font-medium">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10 bg-surface-tertiary border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-deep-navy font-medium"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 bg-surface-tertiary border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      required
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-text-gray hover:text-deep-navy"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-text-gray">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-deep-navy font-medium"
                  >
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-gray" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-surface-tertiary border-soft-gray focus:border-aqua-blue focus:ring-aqua-blue/20 focus-enterprise"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-text-gray hover:text-deep-navy"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked === true)
                }
                required
                className="border-soft-gray data-[state=checked]:bg-aqua-blue data-[state=checked]:border-aqua-blue"
              />
              <Label htmlFor="terms" className="text-sm text-text-gray">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aqua-blue hover:text-neon-coral transition-colors font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aqua-blue hover:text-neon-coral transition-colors font-medium"
                >
                  Privacy Policy
                </Link>
                <span className="text-red-500"> *</span>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-neon-coral text-white hover:bg-electric-orange transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-text-gray mt-4">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-aqua-blue hover:text-neon-coral transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       // [id]: value,
//       [id]: id === "email" ? value.toLowerCase().trim() : value,
//     }));
//   };

//   const handleUserTypeChange = (type) => {
//     setFormData((prev) => ({
//       ...prev,
//       userType: type,
//     }));
//   };

//   const validateForm = () => {
//     let requiredFields;

//     if (formData.userType === "enterprise") {
//       requiredFields = [
//         { field: "companyName", label: "Company Name" },
//         { field: "contactName", label: "Contact Name" },
//         { field: "jobTitle", label: "Job Title" },
//         { field: "phone", label: "Phone" },
//         { field: "industry", label: "Industry" },
//         { field: "companySize", label: "Company Size" },
//         { field: "address", label: "Address" },
//         { field: "email", label: "Email" },
//         { field: "password", label: "Password" },
//       ];
//     } else {
//       // individual
//       requiredFields = [
//         { field: "firstName", label: "First Name" },
//         { field: "lastName", label: "Last Name" },
//         { field: "email", label: "Email" },
//         { field: "password", label: "Password" },
//       ];
//     }

//     // Check all required fields
//     for (const { field, label } of requiredFields) {
//       if (!formData[field]?.trim()) {
//         toast({
//           title: "Error",
//           description: `${label} is required`,
//           variant: "destructive",
//         });
//         return false;
//       }
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast({
//         title: "Error",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (formData.password.length < 8) {
//       toast({
//         title: "Error",
//         description: "Password must be at least 8 characters long",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (!acceptedTerms) {
//       toast({
//         title: "Error",
//         description: "You must accept the terms and conditions",
//         variant: "destructive",
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setEmailError(""); // Clear previous email errors

//     if (!validateForm()) {
//       console.log("Form validation failed");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const isEnterprise = formData.userType === "enterprise";
//       const apiEndpoint = isEnterprise
//         ? "https://www.jobraze.in/api/create_enterprise"
//         : "https://www.jobraze.in/api/create_account";

//       // Prepare base user data
//       const userData = {
//         firstName:
//           formData.firstName || formData.contactName?.split(" ")[0] || "User",
//         lastName:
//           formData.lastName ||
//           formData.contactName?.split(" ").slice(1).join(" ") ||
//           "User",
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         userType: formData.userType,
//         phone: formData.phone || "",
//       };

//       // Add enterprise-specific fields if this is an enterprise registration
//       if (isEnterprise) {
//         Object.assign(userData, {
//           companyName: formData.companyName,
//           contactPerson: formData.contactName,
//           industry: formData.industry,
//           companySize: formData.companySize,
//           address: formData.address,
//           website: formData.website || undefined,
//           jobTitle: formData.jobTitle || undefined,
//         });
//       }

//       console.log("Sending request to:", apiEndpoint);
//       console.log("Request data:", JSON.stringify(userData, null, 2));

//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//         credentials: "include", // Include cookies for session handling
//       });

//       const data = await response.json().catch(() => ({
//         detail: "Invalid server response",
//       }));

//       console.log("Response status:", response.status);
//       console.log("Response data:", data);

//       if (!response.ok) {
//         if (
//           response.status === 400 &&
//           (data.detail === "Account already exists" ||
//             data.detail?.includes("already exists"))
//         ) {
//           setEmailError(
//             "An account with this email already exists. Please use a different email or log in."
//           );
//           setFormData((prev) => ({
//             ...prev,
//             email: "",
//           }));
//           return;
//         }

//         // Handle validation errors
//         if (response.status === 422 && data.detail) {
//           const errorMessages = Array.isArray(data.detail)
//             ? data.detail.map((err) => `${err.loc[1]}: ${err.msg}`).join("\n")
//             : data.detail;
//           throw new Error(`Validation error: ${errorMessages}`);
//         }

//         throw new Error(
//           data.detail ||
//             data.message ||
//             `HTTP error! status: ${response.status}`
//         );
//       }

//       // Redirect to success page
//       router.push("/auth/register/success");
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       {/* Email already exists alert */}
//       {emailError && (
//         <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
//           <div
//             className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg"
//             role="alert"
//           >
//             <div className="flex">
//               <div className="py-1">
//                 <svg
//                   className="fill-current h-6 w-6 text-red-500 mr-4"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
//                 </svg>
//               </div>
//               <div>
//                 <p className="font-bold">Account Exists</p>
//                 <p className="text-sm">{emailError}</p>
//               </div>
//               <button
//                 onClick={() => setEmailError("")}
//                 className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8"
//                 aria-label="Close"
//               >
//                 <span className="sr-only">Close</span>
//                 <svg
//                   className="w-5 h-5"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <Card className="w-full max-w-lg">
//         <CardHeader className="space-y-1">
//           <div className="flex items-center justify-center mb-4">
//             <div className="w-12 h-12 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
//               <Sparkles className="h-7 w-7 text-aqua-blue" />
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-center text-deep-navy">
//             Create Account
//           </CardTitle>
//           <CardDescription className="text-center text-text-gray">
//             Join us to transform your career journey
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Tabs
//               value={formData.userType}
//               onValueChange={handleUserTypeChange}
//               className="w-full"
//             >
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger
//                   value="individual"
//                   className="flex items-center gap-2"
//                 >
//                   <User className="h-4 w-4" />
//                   Individual
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="enterprise"
//                   className="flex items-center gap-2"
//                 >
//                   <Building2 className="h-4 w-4" />
//                   Enterprise
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="individual" className="space-y-4 mt-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstName">First Name *</Label>
//                     <Input
//                       id="firstName"
//                       name="firstName"
//                       placeholder="John"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                       required
//                       autoComplete="given-name"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="lastName">Last Name *</Label>
//                     <Input
//                       id="lastName"
//                       name="lastName"
//                       placeholder="Doe"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                       required
//                       autoComplete="family-name"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email *</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="john@example.com"
//                       className="pl-10"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       autoComplete="email"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password *</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Create a strong password"
//                       className="pl-10 pr-10"
//                       value={formData.password}
//                       onChange={handleChange}
//                       minLength={8}
//                       required
//                       autoComplete="new-password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Must be at least 8 characters long
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password *</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm your password"
//                       className="pl-10 pr-10"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required
//                       autoComplete="new-password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="enterprise" className="space-y-4 mt-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="companyName">Company Name *</Label>
//                   <Input
//                     id="companyName"
//                     name="companyName"
//                     placeholder="Acme Corp"
//                     value={formData.companyName}
//                     onChange={handleChange}
//                     required
//                     autoComplete="organization"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="contactName">Contact Name *</Label>
//                     <Input
//                       id="contactName"
//                       name="contactName"
//                       placeholder="Jane Smith"
//                       value={formData.contactName}
//                       onChange={handleChange}
//                       required
//                       autoComplete="name"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="jobTitle">Job Title *</Label>
//                     <Input
//                       id="jobTitle"
//                       name="jobTitle"
//                       placeholder="HR Manager"
//                       value={formData.jobTitle}
//                       onChange={handleChange}
//                       required
//                       autoComplete="organization-title"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone *</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       placeholder="e.g., +1 234 567 890"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       required
//                       autoComplete="tel"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="industry">Industry *</Label>
//                     <Input
//                       id="industry"
//                       name="industry"
//                       placeholder="e.g., Technology"
//                       value={formData.industry}
//                       onChange={handleChange}
//                       required
//                       autoComplete="off"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companySize">Company Size *</Label>
//                   <Input
//                     id="companySize"
//                     name="companySize"
//                     placeholder="e.g., 50-200 employees"
//                     value={formData.companySize}
//                     onChange={handleChange}
//                     required
//                     autoComplete="off"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address *</Label>
//                   <Input
//                     id="address"
//                     name="address"
//                     placeholder="123 Main St, Anytown, USA"
//                     value={formData.address}
//                     onChange={handleChange}
//                     required
//                     autoComplete="street-address"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website">Company Website</Label>
//                   <Input
//                     id="website"
//                     name="website"
//                     placeholder="https://acme.com"
//                     value={formData.website}
//                     onChange={handleChange}
//                     autoComplete="url"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email">Work Email *</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="jane@company.com"
//                       className="pl-10"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       autoComplete="email"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password *</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Create a strong password"
//                       className="pl-10 pr-10"
//                       value={formData.password}
//                       onChange={handleChange}
//                       minLength={8}
//                       required
//                       autoComplete="new-password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Must be at least 8 characters long
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword">Confirm Password *</Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       id="confirmPassword"
//                       name="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm your password"
//                       className="pl-10 pr-10"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required
//                       autoComplete="new-password"
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>

//             <div className="flex items-center space-x-2 mt-6">
//               <Checkbox
//                 id="terms"
//                 checked={acceptedTerms}
//                 onCheckedChange={(checked) =>
//                   setAcceptedTerms(checked === true)
//                 }
//                 required
//               />
//               <Label htmlFor="terms" className="text-sm">
//                 I agree to the{" "}
//                 <Link
//                   href="/terms"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//                 >
//                   Terms of Service
//                 </Link>{" "}
//                 and{" "}
//                 <Link
//                   href="/privacy"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//                 >
//                   Privacy Policy
//                 </Link>
//                 <span className="text-red-500"> *</span>
//               </Label>
//             </div>

//             <Button type="submit" className="w-full mt-6" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </Button>

//             <p className="text-center text-sm text-muted-foreground mt-4">
//               Already have an account?{" "}
//               <Link
//                 href="/auth/login"
//                 className="text-blue-600 hover:underline"
//               >
//                 Sign in
//               </Link>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
