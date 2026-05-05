import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.text();

    const response = await fetch(`https://www.jobraze.in/api/article/submit/`, {
      method: "POST",
      headers: request.headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to submit article" },
      { status: 500 }
    );
  }
}
