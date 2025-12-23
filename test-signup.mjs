#!/usr/bin/env node
/**
 * Test signup endpoint
 */

const PORT = 3002; // The actual port the dev server is running on
const BASE_URL = `http://localhost:${PORT}`;

console.log("[SIGNUP-TEST] Testing signup endpoint...");
console.log("[SIGNUP-TEST] Base URL:", BASE_URL);

try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "test@example.com",
            password: "TestPassword123",
            name: "Test User",
        }),
    });

    console.log("[SIGNUP-TEST] Response status:", response.status);
    console.log("[SIGNUP-TEST] Response headers:", {
        "content-type": response.headers.get("content-type"),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("[SIGNUP-TEST] Response data:", JSON.stringify(data, null, 2));
    } else {
        const text = await response.text();
        console.log("[SIGNUP-TEST] Response text (first 500 chars):", text.substring(0, 500));
    }

    if (response.ok) {
        console.log("[SIGNUP-TEST] ✓ Signup endpoint is working!");
    } else {
        console.log("[SIGNUP-TEST] ⚠ Signup returned error status:", response.status);
    }
} catch (error) {
    console.error("[SIGNUP-TEST] ✗ Error:", error.message);
    process.exit(1);
}
