"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userType = searchParams.get("userType");
    const newUser = searchParams.get("new_user");

    console.log("Auth success page loaded with:", {
      token: !!token,
      userType,
      newUser,
    });

    if (token) {
      // Save token to localStorage
      localStorage.setItem("token", token);
      if (userType) {
        localStorage.setItem("userType", userType);
      }

      console.log("Token saved, redirecting to dashboard...");

      // Small delay to ensure localStorage is set
      setTimeout(() => {
        // Redirect based on user type
        if (userType === "enterprise") {
          router.push("/enterprise/dashboard");
        } else if (userType === "individual" || userType === "user") {
          router.push("/individual/dashboard");
        } else if (userType === "admin") {
          router.push("/admin/dashboard");
        } else {
          // Default fallback
          router.push("/individual/dashboard");
        }
      }, 500); // Increased delay to ensure localStorage is properly set
    } else {
      console.error("No token found in URL parameters");
      // Redirect to login if no token
      router.push("/auth/login?error=oauth_token_missing");
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700">Logging you in...</p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we redirect you
        </p>
      </div>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg text-muted">Loading...</p>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
