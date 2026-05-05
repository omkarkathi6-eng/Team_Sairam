"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { LogoutButton } from "@/components/auth/logout";

export function DashboardLayout({
  children,
  sidebar,
  userRole,
  userName,
  userEmail,
  profilePhotoPreview,
  setProfilePhotoPreview,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Fetch profile photo only if profilePhotoPreview is not provided
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token || !userEmail || profilePhotoPreview) return;

        const res = await fetch(
          `https://localhost:5000/api/profile?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.profile_photo) {
            // Convert blob data to base64 if needed
            let photoUrl = data.profile_photo;

            // If it's binary data, convert to base64
            if (
              data.profile_photo &&
              typeof data.profile_photo === "string" &&
              !data.profile_photo.startsWith("data:image")
            ) {
              photoUrl = `data:image/jpeg;base64,${data.profile_photo}`;
            }
            setProfilePhotoPreview(photoUrl);
          }
        } else {
          console.error("Failed to fetch profile photo:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };

    if (userEmail && setProfilePhotoPreview) {
      fetchProfilePhoto();
    }
  }, [userEmail, profilePhotoPreview, setProfilePhotoPreview]);

  const getRoleConfig = (role) => {
    switch (role) {
      case "admin":
        return {
          color: "bg-neon-coral/10 text-neon-coral border-neon-coral/20",
          gradient: "from-neon-coral to-electric-orange",
          icon: "⚡",
        };
      default:
        return {
          color:
            "bg-electric-orange/10 text-electric-orange border-electric-orange/20",
          gradient: "from-electric-orange to-aqua-blue",
          icon: "🚀",
        };
    }
  };

  const getProfilePath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/profile";
      default:
        return "/individual/profile";
    }
  };

  const getSettingsPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin/settings";
      default:
        return "/individual/settings";
    }
  };

  const roleConfig = getRoleConfig(userRole);

  return (
    <div className="min-h-screen bg-surface-secondary relative">
      <div className="absolute inset-0 bg-ai-circuit opacity-20" />

      <header className="sticky top-0 z-50 border-b border-soft-gray/50 backdrop-blur-md bg-surface-primary/90 supports-[backdrop-filter]:bg-surface-primary/80">
        <div className="flex h-16 items-center w-full">
          <div className="flex items-center gap-4 absolute left-0 pl-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 bg-deep-navy rounded-xl flex items-center justify-center relative overflow-hidden">
              <Sparkles className="h-6 w-6 text-aqua-blue" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-aqua-blue/20 to-transparent animate-data-flow" />
            </div>
            <span className="font-bold text-xl text-deep-navy dark:text-white">
              Jobraze
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-sm relative"></div>
          </div>

          <div className="flex items-center gap-4 absolute right-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-neon-coral/10 transition-colors"
            >
              <Bell className="h-5 w-5 text-deep-navy dark:text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-aqua-blue/10 transition-colors"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-deep-navy dark:text-white" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-deep-navy dark:text-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-neon-coral/10 transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-transparent bg-gradient-to-r from-neon-coral to-aqua-blue p-0.5">
                    <div className="w-full h-full bg-surface-primary rounded-full flex items-center justify-center overflow-hidden">
                      <AvatarImage
                        src={
                          profilePhotoPreview ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={userName || "User"}
                        className="h-full w-full object-cover rounded-full"
                      />
                      <AvatarFallback className="bg-gradient-to-r from-neon-coral to-aqua-blue text-white font-semibold">
                        {(() => {
                          try {
                            if (!userName || typeof userName !== "string")
                              return "U";
                            return userName
                              .split(" ")
                              .filter(Boolean)
                              .map((n) => n[0]?.toUpperCase() || "")
                              .join("")
                              .substring(0, 2);
                          } catch (e) {
                            return "U";
                          }
                        })()}
                      </AvatarFallback>
                    </div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border-soft-gray bg-surface-primary/95 backdrop-blur-md"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none text-deep-navy dark:text-white">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-text-gray dark:text-gray-400">
                      {userEmail}
                    </p>
                    {userRole && (
                      <Badge
                        className={`w-fit mt-1 ${
                          roleConfig?.color || "bg-gray-100 text-gray-800"
                        } border`}
                      >
                        {roleConfig?.icon && (
                          <span className="mr-1">{roleConfig.icon}</span>
                        )}
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-soft-gray" />
                <DropdownMenuItem
                  asChild
                  className="hover:bg-neon-coral/10 transition-colors"
                >
                  <Link href={getProfilePath()}>
                    <User className="mr-2 h-4 w-4 text-deep-navy dark:text-white" />
                    <span className="text-deep-navy dark:text-white">
                      Profile
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="hover:bg-aqua-blue/10 transition-colors"
                >
                  <Link href={getSettingsPath()}>
                    <Settings className="mr-2 h-4 w-4 text-deep-navy dark:text-white" />
                    <span className="text-deep-navy dark:text-white">
                      Settings
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-soft-gray" />
                <DropdownMenuItem asChild>
                  <LogoutButton
                    variant="ghost"
                    className="w-full justify-start cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-surface-primary/90 backdrop-blur-md border-r border-soft-gray transform transition-transform duration-200 ease-in-out
            md:relative md:translate-x-0 md:z-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-surface-primary/50 to-surface-primary/80 pointer-events-none" />
            <div className="relative z-10">{sidebar}</div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-deep-navy/20 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative bg-gray-50 dark:bg-gray-900">
          <div className="flex-1 overflow-y-auto relative z-10">
            <div className="max-w-7xl mx-auto w-full p-6">{children}</div>
          </div>
          <div className="fixed top-1/4 right-4 w-32 h-32 bg-gradient-to-r from-neon-coral/20 to-aqua-blue/20 rounded-full animate-ai-pulse pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
          <div
            className="fixed bottom-1/4 left-4 w-24 h-24 bg-gradient-to-r from-aqua-blue/20 to-electric-orange/20 rounded-full animate-ai-pulse pointer-events-none mix-blend-multiply dark:mix-blend-screen"
            style={{ animationDelay: "2s" }}
          />
        </main>
      </div>
    </div>
  );
}
