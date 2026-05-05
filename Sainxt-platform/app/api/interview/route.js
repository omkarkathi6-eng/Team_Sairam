import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// This is a development-only route to proxy requests to the Vite dev server
export async function GET() {
  try {
    // In production, you would serve the built files from the interview-frontend/dist directory
    // For development, we'll proxy requests to the Vite dev server
    const response = await fetch("http://localhost:5173");
    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error fetching interview app:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load interview application" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
