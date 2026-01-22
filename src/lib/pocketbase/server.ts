import PocketBase from "pocketbase";

export function createServerClient(cookieHeader?: string): PocketBase {
  const pb = new PocketBase(
    import.meta.env.VITE_POCKETBASE_URL || import.meta.env.VITE_PUBLIC_POCKETBASE_URL
  );

  // Load auth from cookies if provided
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...val] = c.split("=");
        return [key, val.join("=")];
      })
    );
    const pbAuth = cookies["pb_auth"];
    if (pbAuth) {
      pb.authStore.loadFromCookie(`pb_auth=${pbAuth}`);
    }
  }

  return pb;
}

export function getServerUser(cookieHeader?: string) {
  const pb = createServerClient(cookieHeader);

  if (pb.authStore.isValid) {
    return pb.authStore.record;
  }

  return null;
}
