"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";

interface Article {
  article_id: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  readTime?: string;
  publishedAt?: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  currentArticleId: string;
}

export function RelatedArticles({ articles, currentArticleId }: RelatedArticlesProps) {
  const relatedArticles = articles
    .filter(article => article.article_id !== currentArticleId)
    .slice(0, 3);

  if (relatedArticles.length === 0) return null;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            You might also like
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Explore more articles on similar topics
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((article) => (
            <article key={article.article_id} className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-700">
              {article.coverImage && (
                <div className="flex-shrink-0 h-48 relative">
                  <Image
                    className="w-full h-full object-cover"
                    src={article.coverImage}
                    alt={article.title}
                    width={400}
                    height={200}
                  />
                </div>
              )}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    <Link href={`/individual/thought-leadership/${article.article_id}`} className="hover:underline">
                      Read Article
                    </Link>
                  </p>
                  <Link href={`/individual/thought-leadership/${article.article_id}`} className="block mt-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {article.publishedAt && (
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                  )}
                  {article.readTime && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
