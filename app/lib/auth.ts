import { betterAuth } from "better-auth";

console.log("[AUTH] Starting Better Auth initialization (JWT only, no database adapter)...");
console.log("[AUTH] BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "SET" : "NOT SET");
console.log("[AUTH] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
    throw new Error("BETTER_AUTH_SECRET environment variable is not set");
}

console.log("[AUTH] Creating Better Auth instance (JWT tokens only):");
console.log("[AUTH]   - Session: JWT tokens");
console.log("[AUTH]   - Database: None (user management handled separately)");
console.log("[AUTH]   - Base URL: " + (process.env.BETTER_AUTH_URL || "http://localhost:3001"));
console.log("[AUTH]   - Trusted Origins: 3000, 3001, 3002, 3003, 3004, 8000");

export const auth = betterAuth({
    // DO NOT include database config - this is what's causing the error
    secret: secret,
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:8000"
    ],
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
});

console.log("[AUTH] Better Auth initialized successfully (JWT tokens, no database)");
console.log("[AUTH] Auth instance created - user storage handled by custom backend");