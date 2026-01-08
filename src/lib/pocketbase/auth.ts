import { createClient } from "./client";
import type { RecordModel } from "pocketbase";

export interface AuthResult {
  data: { user: RecordModel | null } | null;
  error: Error | null;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const pb = createClient();
    const authData = await pb.collection("users").authWithPassword(email, password);
    return { data: { user: authData.record }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const pb = createClient();
    
    // Create the user
    const user = await pb.collection("users").create({
      email,
      password,
      passwordConfirm: password,
    });

    // Auto-login after signup
    await pb.collection("users").authWithPassword(email, password);

    return { data: { user }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const pb = createClient();
    pb.authStore.clear();
    
    // Clear the cookie
    if (typeof document !== "undefined") {
      document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function signInWithOAuth(
  provider: "google" | "github" | "discord"
): Promise<AuthResult> {
  try {
    const pb = createClient();
    
    // OAuth2 authentication - opens popup window
    const authData = await pb.collection("users").authWithOAuth2({ provider });
    
    return { data: { user: authData.record }, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export function getCurrentUser(): RecordModel | null {
  const pb = createClient();
  return pb.authStore.record;
}

export function isAuthenticated(): boolean {
  const pb = createClient();
  return pb.authStore.isValid;
}


