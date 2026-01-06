// Client-side exports only
// For server-side, import directly from "./server"
export { createClient, getClient } from "./client";
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  signInWithOAuth,
  getCurrentUser,
  isAuthenticated,
} from "./auth";
export type { AuthResult } from "./auth";

