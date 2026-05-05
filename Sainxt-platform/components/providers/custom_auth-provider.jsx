"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("jobraze-user");
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        // Ensure we have the most up-to-date user data
        const updatedUser = {
          ...parsedUser,
          // Make sure first_name is properly set
          first_name:
            parsedUser.first_name ||
            parsedUser.name?.split(" ")[0] ||
            parsedUser.email?.split("@")[0],
          // profilePhoto:
          //   parsedUser.profile_photo_url ||
          //   parsedUser.profilePhoto ||
          //   "/default-avatar.png",
        };
        setUser(updatedUser);
        // Update localStorage with the normalized data
        localStorage.setItem("jobraze-user", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("jobraze-user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Make refreshUser available globally for login redirects
    window.refreshUser = refreshUser;

    // Initial load
    refreshUser();
    setLoading(false);

    // Cleanup function
    return () => {
      delete window.refreshUser;
    };
  }, []);

  // Log the current user for debugging
  useEffect(() => {
    if (user) {
      console.log("Current auth user:", user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
