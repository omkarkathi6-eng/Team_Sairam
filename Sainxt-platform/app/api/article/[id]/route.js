import { NextResponse } from "next/server";
import { API_CONFIG } from "@/src/config";

export async function GET(request, { params }) {
  const articleId = params.id;
  const catchAll = params.nextauth;

  if (!articleId) {
    return NextResponse.json(
      { error: "Article ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLE.GET_CONTENT(
        articleId
      )}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("API Error:", error);

      return NextResponse.json(
        { error: `Failed to fetch article: ${error}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// DELETE handler has been removed as per requirements

export async function PUT(request, { params }) {
  const articleId = (await params).id;

  if (!articleId) {
    return NextResponse.json(
      { error: "Article ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const response = await fetch(
      `https://www.jobraze.in/api/article/update-content/${articleId}`,
      {
        method: "PUT",
        headers: Object.fromEntries(request.headers), // 🛠 Convert headers to a plain object
        body,
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to update article content" },
      { status: 500 }
    );
  }
}
