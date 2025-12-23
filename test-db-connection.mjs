#!/usr/bin/env node
/**
 * Test PostgreSQL connection from Node.js
 * This helps verify if the database connection issue is with the DB itself or Better Auth
 */

import pg from "pg";

const { Pool } = pg;

// Hardcode the connection string for testing
// Since .env might not be loaded at this point
const DATABASE_URL = "postgresql://postgres:razaib@localhost:5432/fishera";

console.log("[TEST] Starting PostgreSQL connection test...");
console.log("[TEST] DATABASE_URL:", DATABASE_URL?.substring(0, 50) + "...");

if (!DATABASE_URL) {
    console.error("[TEST] ERROR: DATABASE_URL is not set");
    process.exit(1);
}

try {
    const pool = new Pool({
        connectionString: DATABASE_URL,
        max: 1,
    });

    console.log("[TEST] Attempting to connect to database...");

    const client = await pool.connect();
    console.log("[TEST] ✓ Connected to database successfully");

    // Test querying tables
    const result = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
    `);

    console.log("[TEST] ✓ Tables in database:");
    result.rows.forEach(row => {
        console.log("[TEST]   - " + row.table_name);
    });

    // Check if 'user' table exists and has the expected columns
    const userTableCheck = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'user'
        ORDER BY ordinal_position
    `);

    if (userTableCheck.rows.length > 0) {
        console.log("[TEST] ✓ 'user' table exists with columns:");
        userTableCheck.rows.forEach(row => {
            console.log("[TEST]   - " + row.column_name + ": " + row.data_type);
        });
    } else {
        console.warn("[TEST] ⚠ 'user' table does not exist or is empty");
    }

    client.release();
    await pool.end();

    console.log("[TEST] ✓ All tests passed");
    process.exit(0);
} catch (error) {
    console.error("[TEST] ✗ Connection test failed:");
    console.error("[TEST]   Error:", error.message);
    if (error.code) {
        console.error("[TEST]   Code:", error.code);
    }
    process.exit(1);
}
