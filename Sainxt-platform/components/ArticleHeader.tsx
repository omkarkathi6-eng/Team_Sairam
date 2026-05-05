"use client";

import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ArticleHeaderProps {
  title: string;
  excerpt?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  publishedAt?: string;
  readTime?: string;
  tags?: string[];
  coverImage?: string;
}

export function ArticleHeader({
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
  tags = [],
  coverImage,
}: ArticleHeaderProps) {
  const router = useRouter();

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="relative">
      {coverImage && (
        <div className="h-64 md:h-96 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl">
          <button 
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </button>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          
          {excerpt && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {author?.name && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{author.name}</span>
              </div>
            )}
            {publishedAt && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(publishedAt)}</span>
              </div>
            )}
            {readTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{readTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
