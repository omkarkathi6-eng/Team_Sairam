"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";
import { TrendingUp, User, FileText, BookOpen } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: TrendingUp },
  { title: "Profile Builder", href: "/individual/profile", icon: User },
  { title: "AI101", href: "/individual/introductory-training", icon: BookOpen },
  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: BookOpen,
    active: true,
  },
  { title: "View Jobs", href: "/individual/jobs", icon: BookOpen },
];

const ThoughtLeadershipArticlePage = ({ params }) => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const articleId = params.articleId;

  const handleShare = async () => {
    const shareData = {
      title: article?.title || "Check out this article",
      text: article?.excerpt || "I found this article interesting",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article/get-content/${articleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article || data); // Handle both response formats
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-neon-coral border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Thought Leadership Article"
      description="Read the full article"
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={user?.name || "User"}
      userEmail={user?.email || ""}
      profilePhotoPreview={user?.profilePhoto}
      className="!p-0 bg-gradient-to-b from-deep-navy/5 to-white"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-8 group flex items-center text-gray-600 hover:text-neon-coral transition-colors duration-200"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          >
            <div className="p-8 sm:p-10">
              <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-coral to-blue-600 bg-clip-text text-transparent mb-6">
                  {article?.title || "Article Title"}
                </h1>
                <div className="flex items-center justify-center space-x-4 text-gray-500">
                  <span>
                    {article?.createdAt
                      ? new Date(article.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                  {article?.createdAt && <span>•</span>}
                  <span>{article?.readTime || ""}</span>
                </div>
              </header>

              <div className="prose prose-lg max-w-none mx-auto">
                <div
                  className="[&_p]:text-gray-700 [&_p]:mb-6 [&_p:last-child]:mb-0 
                           [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 
                           [&_ul>li]:my-3 [&_ol>li]:my-3 
                           [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-gray-900
                           [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-gray-800
                           [&_a]:text-blue-600 [&_a]:font-medium [&_a]:underline hover:[&_a]:text-blue-700
                           [&_blockquote]:border-l-4 [&_blockquote]:border-neon-coral [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:text-gray-600 [&_blockquote]:italic
                           [&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:mx-auto"
                  dangerouslySetInnerHTML={{
                    __html: article?.content || "<p>No content available</p>",
                  }}
                />
              </div>

              <footer className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    className="rounded-full group relative"
                    onClick={handleShare}
                  >
                    <svg
                      className={`w-5 h-5 mr-2 transition-transform duration-200 ${
                        isCopied ? "text-green-500" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                    </svg>
                    {isCopied ? "Link Copied!" : "Share"}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      Share this article
                    </span>
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Save
                  </Button>
                </div>
              </footer>
            </div>
          </motion.article>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThoughtLeadershipArticlePage;
