import { describe, it, expect } from "vitest";
import { testPb, isAdminAuthenticated, skipIfNoAdmin } from "./setup";

describe("PocketBase Connection", () => {
  it("should connect to PocketBase", async () => {
    const health = await testPb.health.check();
    expect(health.code).toBe(200);
  });
});

describe("PocketBase Collections", () => {
  it(
    "should list collections when authenticated",
    skipIfNoAdmin(async () => {
      const collections = await testPb.collections.getFullList();
      expect(collections.length).toBeGreaterThan(0);

      // users collection should always exist
      const hasUsers = collections.some((c) => c.name === "users");
      expect(hasUsers).toBe(true);
    })
  );

  it(
    "should have users collection with expected fields",
    skipIfNoAdmin(async () => {
      const usersCollection = await testPb.collections.getOne("users");
      expect(usersCollection).toBeDefined();
      expect(usersCollection.type).toBe("auth");
    })
  );
});

describe("Environment", () => {
  it("should have admin authentication configured", () => {
    // This test validates that the test environment is properly set up
    // If this fails, check PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD env vars
    expect(isAdminAuthenticated).toBe(true);
  });
});
