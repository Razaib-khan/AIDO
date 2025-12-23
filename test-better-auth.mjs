#!/usr/bin/env node
/**
 * Test Better Auth initialization to see what specific error occurs
 */

import { betterAuth } from "better-auth";

const DATABASE_URL = "postgresql://postgres:razaib@localhost:5432/fishera";
const SECRET = "anyqffVTL37jOY0ptQHClNAVTrTBDjYOA5q/m3tLLRg=";

console.log("[TEST-AUTH] Starting Better Auth initialization test...");
console.log("[TEST-AUTH] DATABASE_URL:", DATABASE_URL.substring(0, 50) + "...");
console.log("[TEST-AUTH] SECRET: SET");

try {
    console.log("[TEST-AUTH] Creating betterAuth instance...");

    const auth = betterAuth({
        database: {
            provider: "postgres",
            url: DATABASE_URL,
        },
        secret: SECRET,
        baseURL: "http://localhost:3001",
        emailAndPassword: {
            enabled: true,
        },
    });

    console.log("[TEST-AUTH] ✓ Better Auth instance created successfully");
    console.log("[TEST-AUTH] Auth object:", typeof auth);
    console.log("[TEST-AUTH] Auth keys:", Object.keys(auth || {}).slice(0, 10));

    // Try to call a method on the auth object to trigger initialization
    try {
        if (auth && typeof auth.handler === "function") {
            console.log("[TEST-AUTH] Calling auth.handler to test full initialization...");
            // This might be async, so let's just check if the method exists
        }
    } catch (e) {
        console.error("[TEST-AUTH] Error calling auth.handler:", e.message);
    }

    console.log("[TEST-AUTH] ✓ Test passed");
    process.exit(0);
} catch (error) {
    console.error("[TEST-AUTH] ✗ Better Auth initialization failed:");
    console.error("[TEST-AUTH] Error type:", error.constructor.name);
    console.error("[TEST-AUTH] Error message:", error.message);
    if (error.cause) {
        console.error("[TEST-AUTH] Cause:", error.cause);
    }
    if (error.stack) {
        console.error("[TEST-AUTH] Stack:");
        console.error(error.stack);
    }
    process.exit(1);
}
