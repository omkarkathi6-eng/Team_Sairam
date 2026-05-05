"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Loader,
  ArrowLeft,
  Share2,
  Bookmark,
  Clock,
  Calendar,
} from "lucide-react";

import { marked } from "marked";
import { API_CONFIG } from "@/src/config";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useAuth } from "@/components/providers/custom_auth-provider";

type AuthContextType = {
  user: User | null;
  // Add other auth methods if needed
};

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt?: string;
  readTime?: string;
  imageUrl?: string;
}

interface User {
  name?: string;
  email?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  sidebar: React.ReactNode;
  userRole: string;
  userName: string | null;
  userEmail: string | null;
  className?: string;
}

const sidebarItems = [
  { title: "Dashboard", href: "/individual/dashboard", icon: Clock },
  { title: "Profile Builder", href: "/individual/profile", icon: Bookmark },
  { title: "AI101", href: "/individual/introductory-training", icon: Bookmark },

  {
    title: "Thought Leadership",
    href: "/individual/thought-leadership",
    icon: Bookmark,
    active: true,
  },

  { title: "View Jobs", href: "/individual/jobs", icon: Bookmark },
];

const ArticlePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const articleId = Array.isArray(id) ? id[0] : id || "";
  const auth = useAuth() as AuthContextType | null;
  const user = auth?.user ?? null;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add the missing state for profile photo (not used in article page but required for DashboardLayout compatibility)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );

  const handleShare = async () => {
    // Prevent multiple share attempts
    if (isSharing) return;

    const shareData = {
      title: article?.title || "Check out this article",
      text: article?.excerpt || "I found this article interesting",
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      setIsSharing(true);
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (shareError) {
          // Type guard to check if the error is a DOMException

          if (
            shareError instanceof DOMException &&
            shareError.name === "AbortError"
          ) {
            // User cancelled the share, no need to show an error
            return;
          }
          console.error("Error sharing:", shareError);

          // Fallback to clipboard if share fails
          await handleClipboardFallback();
        }
      } else {
        await handleClipboardFallback();
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleClipboardFallback = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error copying to clipboard:", err);

      // Optionally show an error message to the user
    }
  };

  useEffect(() => {
    if (!articleId) return;

    const tryEndpoint = async (url: string): Promise<any> => {
      console.log("Trying endpoint:", url);
      try {
        const startTime = Date.now();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        });

        const responseTime = Date.now() - startTime;
        console.log(
          `Response from ${url}: ${response.status} (${responseTime}ms)`
        );

        // First check if the response is JSON
        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status} from ${url}: `;
          // let responseBody;
          let responseBody: any = "(not parsed)";

          try {
            // Try to get error details from JSON if available
            if (isJson) {
              responseBody = await response.json();

              errorMessage +=
                responseBody.detail ||
                responseBody.message ||
                JSON.stringify(responseBody) ||
                "No error details";
            } else {
              // If not JSON, get the response as text
              const text = await response.text();
              errorMessage += text || "No error details available";

              responseBody = { error: text };
            }
          } catch (e) {
            // If we can't parse the error response

            errorMessage += "Failed to parse error response";
            console.error("Error parsing error response:", e);
          }

          // Log the full error for debugging
          if (response.status !== 404) {
            const errorLog = {
              url,
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              body: responseBody ?? "(empty response body)",
            };

            // Print structured JSON so it never collapses to {}
            console.error("API Error:", JSON.stringify(errorLog, null, 2));
          }

          // For 404s, return a special marker instead of throwing

          // Normalize "not found" cases, even if backend wraps it in a 500
          const bodyText = JSON.stringify(responseBody || "").toLowerCase();
          if (
            response.status === 404 ||
            bodyText.includes("404") ||
            bodyText.includes("not found")
          ) {
            return { notFound: true, url, error: errorMessage };
          }

          throw new Error(errorMessage); // only throw real errors
        }

        // If we get here, the request was successful
        if (isJson) {
          const data = await response.json();
          console.log("API Success:", { url, data: data });

          return data;
        } else {
          // Handle non-JSON responses
          const text = await response.text();
          console.warn(`Received non-JSON response from ${url}:`, text);

          return { content: text };
        }
      } catch (error) {
        console.error(`Error with endpoint ${url}:`, error);
        throw error; // Re-throw to be caught by the main try-catch
      }
    };

    const fetchArticle = async () => {
      if (!articleId) return;

      try {
        console.log("Fetching article with ID:", articleId);

        // Base URL from config
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://www.jobraze.in";

        // Try the most likely endpoints based on the backend API
        const endpoints = [
          // Main endpoints from the backend
          `${baseUrl}/article/${articleId}`,
          `${baseUrl}/article/${articleId}/content`,

          // Fallback to other possible variations
          `${baseUrl}/api/article/${articleId}`,
          `${baseUrl}/api/article/${articleId}/content`,

          // Try with articles (plural)
          `${baseUrl}/articles/${articleId}`,
          `${baseUrl}/api/articles/${articleId}`,

          // Legacy endpoints (keep for backward compatibility)
          `${baseUrl}/article/get-content/${articleId}`,
          `${baseUrl}/api/article/get-content/${articleId}`,
        ];

        let lastError;
        let notFoundCount = 0;

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log("Trying endpoint:", endpoint);
            const data = await tryEndpoint(endpoint);
            console.log("Success with endpoint:", endpoint);
            if (data?.notFound) {
              // Keep trying other endpoints
              console.warn(`Endpoint returned not found: ${endpoint}`);
              notFoundCount++;
              continue;
            }

            setArticle(data);
            return; // Exit if successful
          } catch (error) {
            console.error(`Failed with ${endpoint}:`, error);
            lastError = error;
            // Continue to next endpoint
          }
        }

        // If we get here, all endpoints failed
        if (notFoundCount === endpoints.length) {
          setArticle(null); // Triggers "Article Not Found" UI
          return;
        }

        throw lastError || new Error("All endpoints failed");
        // throw lastError || new Error("All endpoints failed");
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load article"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
        userName={user?.name || "User"}
        userEmail={user?.email || ""}
        profilePhotoPreview={profilePhotoPreview}
        setProfilePhotoPreview={setProfilePhotoPreview}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="animate-spin w-12 h-12 text-neon-coral" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
        userName={user?.name || "User"}
        userEmail={user?.email || ""}
        profilePhotoPreview={profilePhotoPreview}
        setProfilePhotoPreview={setProfilePhotoPreview}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
              onClick={() => router.back()}
              className="mb-8 group flex items-center text-gray-600 hover:text-neon-coral transition-colors duration-200 bg-transparent border-none cursor-pointer text-sm font-medium p-0"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Articles</span>
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100 p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Error Loading Article
              </h2>
              <p className="text-gray-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-6">
                URL: {API_CONFIG.DIRECT_API.GET_ARTICLE(articleId || "")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-neon-coral text-white rounded-md hover:bg-electric-orange transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    const apiUrl = API_CONFIG.DIRECT_API.GET_ARTICLE(
                      articleId || ""
                    );
                    window.open(apiUrl, "_blank");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Open API in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout
        sidebar={<SidebarNav items={sidebarItems} />}
        userRole="individual"
        userName={user?.name || "User"}
        userEmail={user?.email || ""}
        profilePhotoPreview={profilePhotoPreview}
        setProfilePhotoPreview={setProfilePhotoPreview}
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Article not avaliable for now
              </h2>
              <p className="text-gray-600 mb-6">
                The requested article will soon be available
              </p>
              <button
                onClick={() => router.push("/individual/thought-leadership")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-neon-coral hover:bg-electric-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-coral"
              >
                Back to Artiles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const htmlContent = article?.content
    ? (marked.parse(article.content) as string)
    : "<p>No content available</p>";

  return (
    <DashboardLayout
      sidebar={<SidebarNav items={sidebarItems} />}
      userRole="individual"
      userName={user?.name || "User"}
      userEmail={user?.email || ""}
      profilePhotoPreview={profilePhotoPreview}
      setProfilePhotoPreview={setProfilePhotoPreview}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
        <div className="w-full max-w-5xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-8 group flex items-center text-gray-600 hover:text-neon-coral transition-colors duration-200 bg-transparent border-none cursor-pointer text-sm font-medium p-0"
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Articles</span>
          </button>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 w-full">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
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

              <>
                <style jsx global>{`
                  .prose {
                    color: #374151;
                    line-height: 1.8;
                    max-width: 100%;
                  }
                  .prose p {
                    margin-bottom: 1.5em;
                    text-align: justify;
                    text-justify: inter-word;
                    hyphens: auto;
                    line-height: 1.8;
                  }

                  .prose h1,
                  .prose h2,
                  .prose h3,
                  .prose h4,
                  .prose h5,
                  .prose h6 {
                    margin-top: 1.5em;
                    margin-bottom: 0.75em;
                    color: #111827;
                    font-weight: 600;
                  }

                  .prose h1 {
                    font-size: 2.25rem;
                    line-height: 2.5rem;
                  }
                  .prose h2 {
                    font-size: 1.875rem;
                    line-height: 2.25rem;
                  }
                  .prose h3 {
                    font-size: 1.5rem;
                    line-height: 2rem;
                  }
                  .prose h4 {
                    font-size: 1.25rem;
                    line-height: 1.75rem;
                  }

                  .prose a {
                    color: #3b82f6;
                    text-decoration: none;
                    font-weight: 500;
                  }
                  .prose a:hover {
                    text-decoration: underline;
                    text-underline-offset: 2px;
                  }

                  .prose ul,
                  .prose ol {
                    margin-bottom: 1.5em;
                    padding-left: 1.5em;
                  }
                  .prose li {
                    margin-bottom: 0.5em;
                  }
                  .prose img {
                    margin: 2em auto;
                    border-radius: 0.5rem;
                    max-width: 100%;
                    height: auto;
                    display: block;
                  }
                  .prose blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1em;
                    margin: 1.5em 0;
                    font-style: italic;
                    color: #4b5563;
                  }
                `}</style>
                <div
                  className="prose prose-lg max-w-none mx-auto w-full"
                  style={{
                    lineHeight: "1.8",
                    color: "#374151",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </>

              <footer className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className={`inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-neon-coral focus:ring-offset-2 group relative ${
                      isSharing
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isSharing ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin mr-2" />
                        <span>Sharing...</span>
                      </>
                    ) : (
                      <>
                        <Share2
                          className={`h-5 w-5 ${
                            isCopied ? "text-green-500" : ""
                          }`}
                        />
                        <span className="ml-2">
                          {isCopied ? "Link Copied!" : "Share"}
                        </span>

                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          Share this article
                        </span>
                      </>
                    )}
                  </button>
                  <button className="ml-3 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-neon-coral focus:ring-offset-2">
                    <Bookmark className="h-5 w-5" />
                    <span className="ml-2">Save</span>
                  </button>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticlePage;
