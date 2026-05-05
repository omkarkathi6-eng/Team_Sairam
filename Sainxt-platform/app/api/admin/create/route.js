import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    // const headersList = headers();
    // const contentType = headersList.get('content-type');
    const headersList = await headers();
    const contentType = headersList.get("content-type");

    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Forward request to backend
    const response = await fetch("https://www.jobraze.in/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in admin creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
