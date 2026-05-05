"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/custom_auth-provider";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Shield,
  Users,
  Building2,
  BarChart3,
  Settings,
  DollarSign,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Download,
  RefreshCw,
  FileText,
  MessageSquare,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Feedback", href: "/admin/feedback-details", icon: MessageSquare },
];

const systemHealth = [
  { name: "CPU Usage", value: 45, status: "good", threshold: 80 },
  { name: "Memory Usage", value: 62, status: "warning", threshold: 80 },
  { name: "Database Load", value: 38, status: "good", threshold: 70 },
  { name: "Storage Usage", value: 73, status: "warning", threshold: 85 },
];

const topPerformingFeatures = [
  { name: "AI Skills Assessment", usage: 89, trend: "up", users: 8420 },
  { name: "Profile Builder", usage: 76, trend: "up", users: 7234 },
  { name: "Interview Engine", usage: 68, trend: "down", users: 5891 },
  { name: "Certificate Generator", usage: 54, trend: "up", users: 4567 },
];

function getHealthStatus(value, threshold) {
  if (value >= threshold)
    return { color: "text-red-600", bg: "bg-red-100", label: "Critical" };
  if (value >= threshold * 0.8)
    return { color: "text-orange-600", bg: "bg-orange-100", label: "Warning" };
  return { color: "text-green-600", bg: "bg-green-100", label: "Good" };
}

export default function AdminDashboard() {
  const auth = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const recentActivity = []; // Add this at the top of AdminDashboard
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total_users: 0,
    active_assessments: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      try {
        const res = await fetch("https://www.jobraze.in/api/dashboard/metrics");

        if (!res.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const data = await res.json();
        setMetrics(data);
      } catch (error) {
        console.error("Dashboard metrics error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardMetrics();
  }, []);

  const platformMetrics = [
    {
      title: "Total Users",
      value: metrics.total_users.toLocaleString(),
      change: "+8.2%",
      changeType: "increase",
      period: "from last month",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Premium Subscriptions",
      value: "842", // Static for now
      change: "+12.5%",
      changeType: "increase",
      period: "from last month",
      icon: Star,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "$89,420", // Static for now
      change: "+15.3%",
      changeType: "increase",
      period: "from last month",
      icon: DollarSign,
      color: "text-purple-600",
    },
    {
      title: "Active Assessments",
      value: metrics.active_assessments.toLocaleString(),
      change: "+5.7%",
      changeType: "increase",
      period: "from last week",
      icon: BarChart3,
      color: "text-orange-600",
    },
  ];

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Only run on client side
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          // console.error("No authentication token found");
          console.warn(
            "No authentication token found (user likely unauthenticated)"
          );

          setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (!isClient) {
    // Show loading state during server-side rendering

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

  const { user, loading } = auth;

  // Debug: Log the user object to see what data we have
  console.log("User object in dashboard:", JSON.stringify(user, null, 2));

  // Check localStorage directly as well
  let storedUser = null;
  if (typeof window !== "undefined") {
    storedUser = localStorage.getItem("jobraze-user");
    console.log("Stored user in localStorage (raw):", storedUser);
    try {
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log("Parsed user from localStorage:", parsedUser);
      console.log(
        "Available keys in user object:",
        Object.keys(parsedUser || {})
      );
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }
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

    // Finally check localStorage as fallback
    try {
      const storedUser =
        typeof window !== "undefined" && localStorage.getItem("jobraze-user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return (
          parsedUser.first_name ||
          parsedUser.name?.split(" ")[0] ||
          parsedUser.email?.split("@")[0]
        );
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }

    return "Admin";
  };

  const userName = getDisplayName();
  const userEmail =
    userProfile?.email || auth.user?.email || "admin@sainxt.com";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <p className="text-center mt-10 text-lg">
        You must be signed in to access the Admin Dashboard.
      </p>
    );
  }

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="admin"
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-6">
        {/* Breadcrumb */}
        {/* <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb> */}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              System Administration
            </h1>
            <p className="text-muted-foreground">
              Monitor platform performance and manage system-wide settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button> */}
          </div>
        </div>

        {/* Platform Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {metric.changeType === "increase" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={
                        metric.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {metric.change}
                    </span>
                    <span className="ml-1">{metric.period}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      System Health Summary
                    </CardTitle>
                    <CardDescription>
                      Real-time system performance overview
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    All Systems Operational
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemHealth.map((metric) => {
                    const status = getHealthStatus(
                      metric.value,
                      metric.threshold
                    );
                    return (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {metric.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{metric.value}%</span>
                            <Badge
                              className={`${status.bg} ${status.color} text-xs`}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Metrics
                  </Button>
                </CardContent>
              </Card>

              {/* Feature Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage Analytics</CardTitle>
                  <CardDescription>
                    Most popular platform features this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformingFeatures.map((feature) => (
                      <div key={feature.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {feature.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{feature.usage}%</span>
                            <TrendingUp
                              className={`h-4 w-4 ${
                                feature.trend === "up"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            />
                          </div>
                        </div>
                        <Progress value={feature.usage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {feature.users.toLocaleString()} active users
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Full Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-blue-50"
                  >
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Manage Users</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-green-50"
                  >
                    <Star className="h-5 w-5 text-green-600" />
                    <span>Manage Plans</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-purple-50"
                  >
                    <Settings className="h-5 w-5 text-purple-600" />
                    <span>System Config</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 hover:bg-orange-50"
                  >
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span>Generate Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Server Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Cpu className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">45%</div>
                      <div className="text-sm text-muted-foreground">
                        CPU Usage
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <HardDrive className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">62%</div>
                      <div className="text-sm text-muted-foreground">
                        Memory
                      </div>
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Database className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High Memory Usage</p>
                        <p className="text-xs text-muted-foreground">
                          Server load above 80%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Backup Completed</p>
                        <p className="text-xs text-muted-foreground">
                          Daily backup successful
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>
                  Latest platform events and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.details}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">
                            {activity.timestamp}
                          </span>
                          <Badge
                            variant={
                              activity.severity === "warning"
                                ? "destructive"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {activity.severity}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    Platform user registration trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-lg">
                    User growth chart placeholder
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>
                    Monthly revenue and subscription metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-lg">
                    Revenue chart placeholder
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  User Feedback Summary
                </CardTitle>
                <CardDescription>
                  Recent feedback and ratings from platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.8</div>
                    <p className="text-sm text-muted-foreground">
                      Average Rating
                    </p>
                    <div className="flex justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">92%</div>
                    <p className="text-sm text-muted-foreground">
                      Satisfaction Rate
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      1,247
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Reviews
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  View Detailed Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
