#!/usr/bin/env node
/**
 * Test signup endpoint with detailed error logging
 */

const PORT = 3004; // Update this if the port is different
const BASE_URL = `http://localhost:${PORT}`;

console.log("[SIGNUP-TEST] Testing signup endpoint at port", PORT);
console.log("[SIGNUP-TEST] Base URL:", BASE_URL);

try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: `testuser${Date.now()}@example.com`,
            password: "TestPassword123",
            name: "Test User",
        }),
    });

    console.log("[SIGNUP-TEST] Response status:", response.status);
    console.log("[SIGNUP-TEST] Response headers:");
    for (const [key, value] of response.headers) {
        console.log(`  ${key}: ${value}`);
    }

    const responseText = await response.text();
    console.log("[SIGNUP-TEST] Response length:", responseText.length);
    console.log("[SIGNUP-TEST] Response (first 500 chars):");
    console.log(responseText.substring(0, 500));

    if (responseText.length > 500) {
        console.log("[SIGNUP-TEST] ... (truncated)");
    }

    try {
        const data = JSON.parse(responseText);
        console.log("[SIGNUP-TEST] Parsed JSON:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.log("[SIGNUP-TEST] Response is not valid JSON");
    }

} catch (error) {
    console.error("[SIGNUP-TEST] Error:", error.message);
    process.exit(1);
}
