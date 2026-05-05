"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@radix-ui/react-dialog";
import { toast } from "react-toastify";
import {
  Loader2,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Shield,
  X,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Feedback", href: "/admin/feedback-details", icon: MessageSquare },
  { title: "Articles", href: "/admin/articles", icon: FileText },
  {
    title: "Article Cards",
    href: "/admin/new_article-card",
    icon: FileText,
  },
];

export default function FeedbackPage() {
  const auth = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          "https://www.jobraze.in/api/admin/feedback",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load feedback", {
          description: "Please try again later.",
          duration: 5000,
          className: "bg-red-50 border-red-200",
          style: {
            backgroundColor: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No authentication token found");
        setIsLoading(false);
        return;
      }

      try {
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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data);

        if (auth.setUser) {
          auth.setUser((prev) => ({
            ...prev,
            ...data,
            first_name: data.first_name || prev?.first_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile", {
          description: "Please try again or log in again.",
          duration: 5000,
          className: "bg-red-50 border-red-200",
          style: {
            backgroundColor: "#fef2f2",
            borderColor: "#fecaca",
            color: "#dc2626",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
    fetchFeedback();
  }, []); // Empty dependency array to run only on mount

  const getDisplayName = () => {
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.name) return userProfile.name.split(" ")[0];
    if (auth.user?.first_name) return auth.user.first_name;
    if (auth.user?.name) return auth.user.name.split(" ")[0];
    if (auth.user?.email) return auth.user.email.split("@")[0];

    try {
      const storedUser = localStorage.getItem("jobraze-user");
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
  const userEmail = userProfile?.email || auth.user?.email || "";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const renderFeedbackTable = (
    feedbackList,
    emptyMessage = "No feedback found"
  ) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (feedbackList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Satisfaction</TableHead>
            <TableHead>Recommendation</TableHead>
            <TableHead>Reaction</TableHead>
            <TableHead>Helpful</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbackList.map((feedback) => (
            <TableRow key={feedback._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  {feedback.email}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {feedback.satisfaction && feedback.satisfaction > 0
                    ? [...Array(feedback.satisfaction)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))
                    : "Not Rated"}
                </div>
              </TableCell>
              <TableCell>
                {feedback.recommendation
                  ? `${feedback.recommendation}/10`
                  : "N/A"}
              </TableCell>
              <TableCell>{feedback.reaction || "N/A"}</TableCell>
              <TableCell>
                {feedback.helpful ? (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      feedback.helpful === "Yes"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {feedback.helpful}
                  </span>
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(feedback.submitted_at)}
                </div>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedFeedback(feedback)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  {selectedFeedback && (
                    <DialogContent className="sm:max-w-[600px] bg-white p-6 rounded-lg shadow-lg relative">
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </DialogClose>
                      <DialogTitle>
                        Feedback Details - {selectedFeedback.email}
                      </DialogTitle>
                      <DialogDescription>
                        Detailed feedback information submitted by the user.
                      </DialogDescription>
                      <div className="space-y-4 mt-4">
                        {selectedFeedback.feedback && (
                          <div>
                            <h4 className="font-semibold">General Feedback</h4>
                            <p>{selectedFeedback.feedback}</p>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold">Ratings</h4>
                          {selectedFeedback.ratings &&
                          Object.keys(selectedFeedback.ratings).length > 0 ? (
                            <ul className="list-disc pl-5">
                              <li>
                                Ease of Use:{" "}
                                {selectedFeedback.ratings.easeOfUse || 0}/5
                              </li>
                              <li>
                                Clarity: {selectedFeedback.ratings.clarity || 0}
                                /5
                              </li>
                              <li>
                                Engagement:{" "}
                                {selectedFeedback.ratings.engagement || 0}/5
                              </li>
                              <li>
                                Usefulness:{" "}
                                {selectedFeedback.ratings.usefulness || 0}/5
                              </li>
                            </ul>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">Feature Ease</h4>
                          {selectedFeedback.featureEase &&
                          Object.keys(selectedFeedback.featureEase).length >
                            0 ? (
                            <ul className="list-disc pl-5">
                              <li>
                                Ease of Use:{" "}
                                {selectedFeedback.featureEase.easeOfUse || 0}/5
                              </li>
                              <li>
                                Clarity:{" "}
                                {selectedFeedback.featureEase.clarity || 0}/5
                              </li>
                              <li>
                                Engagement:{" "}
                                {selectedFeedback.featureEase.engagement || 0}/5
                              </li>
                              <li>
                                Usefulness:{" "}
                                {selectedFeedback.featureEase.usefulness || 0}/5
                              </li>
                            </ul>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">Useful Features</h4>
                          <p>
                            {selectedFeedback.usefulFeatures?.length > 0
                              ? selectedFeedback.usefulFeatures.join(", ")
                              : "None"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Liked Most</h4>
                          <p>{selectedFeedback.likedMost || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Disliked</h4>
                          <p>{selectedFeedback.disliked || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Suggestions</h4>
                          <p>{selectedFeedback.suggestions || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Skill Impact</h4>
                          <p>{selectedFeedback.skillImpact || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Satisfaction</h4>
                          <p>
                            {selectedFeedback.satisfaction &&
                            selectedFeedback.satisfaction > 0
                              ? `${selectedFeedback.satisfaction}/5`
                              : "Not Rated"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Recommendation</h4>
                          <p>
                            {selectedFeedback.recommendation
                              ? `${selectedFeedback.recommendation}/10`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Reaction</h4>
                          <p>{selectedFeedback.reaction || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Helpful</h4>
                          <p>{selectedFeedback.helpful || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Submitted At</h4>
                          <p>{formatDate(selectedFeedback.submitted_at)}</p>
                        </div>
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

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
      <div className="min-h-screen bg-surface-secondary relative overflow-hidden py-8 px-4">
        <div className="absolute inset-0 bg-ai-circuit opacity-30" />
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-aqua-blue/20 to-neon-coral/20 rounded-full animate-ai-pulse" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-neon-coral/20 to-electric-orange/20 rounded-full animate-ai-pulse" />

        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-deep-navy">
                Feedback Management
              </h1>
              <p className="text-text-gray">View and analyze user feedback</p>
            </div>
          </div>

          <Card className="card-ai-enhanced shadow-enterprise-lg">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center px-6 pt-6">
                <TabsList className="bg-surface-secondary">
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-2 data-[state=active]:bg-aqua-blue/10 data-[state=active]:text-aqua-blue"
                  >
                    <MessageSquare className="h-4 w-4" />
                    All Feedback ({feedbacks.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="positive"
                    className="flex items-center gap-2 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Positive (
                    {feedbacks.filter((f) => f.reaction === "😃").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="neutral"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-500/10 data-[state=active]:text-blue-500"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Neutral (
                    {feedbacks.filter((f) => f.reaction === "😐").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="negative"
                    className="flex items-center gap-2 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Negative (
                    {feedbacks.filter((f) => f.reaction === "😞").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="pt-6 bg-white/50 backdrop-blur-sm">
                <TabsContent value="all">
                  {renderFeedbackTable(
                    feedbacks,
                    "No feedback found in the system."
                  )}
                </TabsContent>
                <TabsContent value="positive">
                  {renderFeedbackTable(
                    feedbacks.filter((f) => f.reaction === "😃"),
                    "No positive feedback found."
                  )}
                </TabsContent>
                <TabsContent value="neutral">
                  {renderFeedbackTable(
                    feedbacks.filter((f) => f.reaction === "😐"),
                    "No neutral feedback found."
                  )}
                </TabsContent>
                <TabsContent value="negative">
                  {renderFeedbackTable(
                    feedbacks.filter((f) => f.reaction === "😞"),
                    "No negative feedback found."
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
