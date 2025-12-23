import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

console.log("[AUTH-ROUTE] Route handler loading...");

const authHandler = toNextJsHandler(auth);

console.log("[AUTH-ROUTE] Auth handler created successfully");

// Wrap the handlers with error handling
export const GET = async (request: NextRequest) => {
  try {
    console.log("[AUTH-ROUTE] GET request received:", request.url);
    const response = await authHandler.GET(request);
    console.log("[AUTH-ROUTE] GET response status:", response.status);
    return response;
  } catch (error) {
    console.error("[AUTH-ROUTE] GET error:", error);
    return NextResponse.json(
      { error: "Authentication error", details: (error as any)?.message },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    console.log("[AUTH-ROUTE] POST request received:", request.url);
    const response = await authHandler.POST(request);
    console.log("[AUTH-ROUTE] POST response status:", response.status);
    return response;
  } catch (error) {
    console.error("[AUTH-ROUTE] POST error:", error);
    return NextResponse.json(
      { error: "Authentication error", details: (error as any)?.message },
      { status: 500 }
    );
  }
};