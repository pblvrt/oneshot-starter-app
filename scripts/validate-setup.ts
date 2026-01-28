#!/usr/bin/env npx tsx
/**
 * Validates that PocketBase is properly set up with required collections.
 *
 * Usage:
 *   npx tsx scripts/validate-setup.ts
 *
 * Environment variables:
 *   VITE_PUBLIC_POCKETBASE_URL - PocketBase URL (default: http://localhost:8090)
 *   PB_ADMIN_EMAIL - Admin email (default: admin@oneshot.com)
 *   PB_ADMIN_PASSWORD - Admin password (default: Oneshot123456)
 */

import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.VITE_PUBLIC_POCKETBASE_URL || "http://localhost:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@oneshot.com";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "Oneshot123456";

// Add your project's required collections here
const REQUIRED_COLLECTIONS = ["users"];

interface ValidationResult {
  success: boolean;
  message: string;
}

async function validatePocketBaseConnection(pb: PocketBase): Promise<ValidationResult> {
  try {
    const health = await pb.health.check();
    if (health.code === 200) {
      return { success: true, message: "PocketBase is healthy" };
    }
    return { success: false, message: `Unexpected health code: ${health.code}` };
  } catch (error) {
    return { success: false, message: `Cannot connect to PocketBase: ${error}` };
  }
}

async function authenticateAdmin(pb: PocketBase): Promise<ValidationResult> {
  try {
    // Try v0.23+ auth endpoint first
    await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    return { success: true, message: "Admin authenticated (v0.23+ endpoint)" };
  } catch {
    try {
      // Fallback to v0.22 auth endpoint
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      return { success: true, message: "Admin authenticated (v0.22 endpoint)" };
    } catch (error) {
      return { success: false, message: `Admin authentication failed: ${error}` };
    }
  }
}

async function validateCollections(pb: PocketBase): Promise<ValidationResult> {
  try {
    const collections = await pb.collections.getFullList();
    const collectionNames = collections.map((c) => c.name);

    const missing = REQUIRED_COLLECTIONS.filter((name) => !collectionNames.includes(name));

    if (missing.length > 0) {
      return {
        success: false,
        message: `Missing collections: ${missing.join(", ")}`,
      };
    }

    return {
      success: true,
      message: `All ${REQUIRED_COLLECTIONS.length} required collection(s) found`,
    };
  } catch (error) {
    return { success: false, message: `Cannot list collections: ${error}` };
  }
}

async function main() {
  console.log("🔍 Validating PocketBase Setup\n");
  console.log(`   URL: ${POCKETBASE_URL}`);
  console.log(`   Admin: ${ADMIN_EMAIL}\n`);

  const pb = new PocketBase(POCKETBASE_URL);
  let allPassed = true;

  // Check connection
  const connectionResult = await validatePocketBaseConnection(pb);
  console.log(connectionResult.success ? "✅" : "❌", connectionResult.message);
  allPassed = allPassed && connectionResult.success;

  if (!connectionResult.success) {
    console.log("\n❌ Validation failed: Cannot connect to PocketBase");
    console.log("   Make sure PocketBase is running on", POCKETBASE_URL);
    process.exit(1);
  }

  // Check admin auth
  const authResult = await authenticateAdmin(pb);
  console.log(authResult.success ? "✅" : "❌", authResult.message);
  allPassed = allPassed && authResult.success;

  if (!authResult.success) {
    console.log("\n❌ Validation failed: Admin authentication failed");
    console.log("   Check PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD environment variables");
    process.exit(1);
  }

  // Check collections
  const collectionsResult = await validateCollections(pb);
  console.log(collectionsResult.success ? "✅" : "❌", collectionsResult.message);
  allPassed = allPassed && collectionsResult.success;

  console.log("");

  if (allPassed) {
    console.log("✅ All validations passed!");
    process.exit(0);
  } else {
    console.log("❌ Some validations failed");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
