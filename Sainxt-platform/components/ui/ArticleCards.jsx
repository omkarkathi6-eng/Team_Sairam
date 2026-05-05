"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // adjust this import path to where your Card components are defined

export default function ArticleCards({ articles = [] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 p-4 min-w-full snap-x snap-mandatory overflow-x-scroll">
        {articles.map((article, index) => {
          const imageUrl = article.image
            ? `data:${article.content_type};base64,${article.image}`
            : null;

          return (
            <Card
              key={index}
              className="min-w-[300px] flex-shrink-0 snap-start"
            >
              <CardHeader>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={article.filename || "Article Image"}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>

              {article.tags && article.tags.length > 0 && (
                <CardContent className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-sm px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
