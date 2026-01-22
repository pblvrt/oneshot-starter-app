import PocketBase from "pocketbase";

let pb: PocketBase | null = null;

export function createClient(): PocketBase {
  if (typeof window === "undefined") {
    // Server-side: always create a new instance
    return new PocketBase(import.meta.env.VITE_PUBLIC_POCKETBASE_URL);
  }

  // Client-side: reuse the same instance
  if (!pb) {
    pb = new PocketBase(import.meta.env.VITE_PUBLIC_POCKETBASE_URL);

    // Load auth from localStorage if available
    pb.authStore.loadFromCookie(document.cookie);

    // Subscribe to auth changes and save to cookie
    pb.authStore.onChange(() => {
      document.cookie = pb!.authStore.exportToCookie({ httpOnly: false });
    });
  }

  return pb;
}

export function getClient(): PocketBase {
  return createClient();
}
