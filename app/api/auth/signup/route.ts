import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

/**
 * Custom signup endpoint that:
 * 1. Creates a user in the database
 * 2. Returns a JWT token
 */

export async function POST(request: NextRequest) {
  try {
    console.log("[API-SIGNUP] ========== FRONTEND SIGNUP ENDPOINT CALLED ==========");

    const body = await request.json();
    const { email, password, name } = body;

    console.log("[API-SIGNUP] Received data:", { email, name });

    if (!email || !password || !name) {
      console.log("[API-SIGNUP] Missing fields!");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("[API-SIGNUP] Hashing password...");

    // Hash the password
    const hashedPassword = await hash(password, 10);
    console.log("[API-SIGNUP] Password hashed");

    // Make a request to the FastAPI backend to create the user
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    console.log("[API-SIGNUP] Backend URL:", backendUrl);
    console.log("[API-SIGNUP] Sending request to backend...");

    const response = await fetch(`${backendUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: hashedPassword,
        name,
        isBuyer: true,
        isSeller: false,
        sellerVerified: false,
      }),
    });

    console.log("[API-SIGNUP] Response received, status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[API-SIGNUP] Backend error:", errorData);
      return NextResponse.json(
        { error: "Failed to create user", details: errorData },
        { status: 400 }
      );
    }

    const userData = await response.json();
    console.log("[SIGNUP] User created successfully:", userData.id);

    // For now, return the user data
    // In a real app, you'd generate and return a JWT token here
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (error) {
    console.error("[SIGNUP] Error:", error);
    return NextResponse.json(
      {
        error: "Signup failed",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
