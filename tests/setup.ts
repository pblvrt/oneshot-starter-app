import { beforeAll, afterAll } from "vitest";
import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.VITE_PUBLIC_POCKETBASE_URL || "http://localhost:8090";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "admin@oneshot.com";
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "Oneshot123456";

export let testPb: PocketBase;
export let isAdminAuthenticated = false;

beforeAll(async () => {
  testPb = new PocketBase(POCKETBASE_URL);

  try {
    // Try v0.23+ auth endpoint first
    await testPb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    isAdminAuthenticated = true;
  } catch {
    try {
      // Fallback to v0.22 auth endpoint
      await testPb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
      isAdminAuthenticated = true;
    } catch (error) {
      console.warn("Could not authenticate as admin. Some tests may be skipped.", error);
    }
  }
});

afterAll(() => {
  testPb.authStore.clear();
});

/**
 * Helper to skip tests that require admin authentication
 */
export function skipIfNoAdmin(testFn: () => void | Promise<void>) {
  return async () => {
    if (!isAdminAuthenticated) {
      console.log("Skipping test: Admin authentication required");
      return;
    }
    return testFn();
  };
}

/**
 * Helper to clean up test records
 */
export async function cleanupCollection(collectionName: string, filter: string) {
  if (!isAdminAuthenticated) return;

  try {
    const records = await testPb.collection(collectionName).getFullList({
      filter,
    });

    for (const record of records) {
      await testPb.collection(collectionName).delete(record.id);
    }
  } catch {
    // Collection might not exist or be empty
  }
}
