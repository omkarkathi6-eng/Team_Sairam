"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({ variant = "ghost", className, children }) {
  const router = useRouter();

  const handleRedirectToFeedback = () => {
    router.push("/feedback"); // 👈 send user to feedback page first
  };

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleRedirectToFeedback}
    >
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </>
      )}
    </Button>
  );
}

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { LogOut } from "lucide-react";

// export function LogoutButton({ variant = "ghost", className, children }) {
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);

//       // Optional: call backend logout if needed
//       // await fetch("http://your-backend/api/logout", { method: "POST", credentials: "include" });

//       // Clear all local/session tokens
//       localStorage.removeItem("jobraze-user");
//       localStorage.removeItem("token");
//       sessionStorage.clear();

//       // Optional: toast / feedback here
//       // toast.success("Logged out");

//       // Redirect to login
//       router.replace("/auth/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   return (
//     <Button
//       variant={variant}
//       className={className}
//       onClick={handleLogout}
//       disabled={isLoggingOut}
//     >
//       {children || (
//         <>
//           <LogOut className="mr-2 h-4 w-4" />
//           {isLoggingOut ? "Logging out..." : "Log out"}
//         </>
//       )}
//     </Button>
//   );
// }
