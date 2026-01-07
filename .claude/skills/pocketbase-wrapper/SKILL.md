# PocketBase Wrapper Pattern in This Template

## The Issue

The PocketBase skill documentation and official PocketBase docs show the **standard pattern**:

```javascript
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Use directly
const records = await pb.collection('posts').getList();
```

However, **this starter template uses a different pattern** that wraps PocketBase for better Next.js compatibility.

## Why This Template Uses a Wrapper

This Next.js starter template uses a wrapper pattern (`getClient()`) for several reasons:

### 1. **Server-Side Rendering (SSR) Compatibility**
Next.js 16 with App Router runs code on both server and client. The wrapper handles this:

```typescript
// From client.ts
export function createClient(): PocketBase {
  if (typeof window === "undefined") {
    // Server-side: always create a new instance
    return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  }

  // Client-side: reuse the same instance
  if (!pb) {
    pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    // ... cookie handling
  }
  return pb;
}
```

### 2. **Singleton Pattern for Client-Side**
On the client, we want ONE PocketBase instance shared across components to:
- Maintain authentication state
- Avoid multiple WebSocket connections
- Share the same auth store

### 3. **Automatic Cookie Management**
The wrapper automatically handles auth persistence:

```typescript
// Load auth from localStorage/cookies
pb.authStore.loadFromCookie(document.cookie);

// Save to cookies on auth changes
pb.authStore.onChange(() => {
  document.cookie = pb!.authStore.exportToCookie({ httpOnly: false });
});
```

## The Correct Pattern for This Template

### ❌ WRONG (from PocketBase docs)
```typescript
import { pb } from "@/lib/pocketbase";  // ❌ This export doesn't exist!

const records = await pb.collection('posts').getList();
```

### ✅ CORRECT (for this template)
```typescript
import { getClient } from "@/lib/pocketbase";

const pb = getClient();  // Get the singleton instance
const records = await pb.collection('posts').getList();
```

## Why the Confusion?

1. **Official PocketBase docs** show the standard pattern (direct instantiation)
2. **PocketBase skill documentation** follows official docs
3. **This starter template** uses a wrapper for Next.js-specific needs
4. The wrapper pattern is **NOT** documented in official PocketBase sources

## When to Use Each Pattern

### Use Standard Pattern (`const pb = new PocketBase(...)`)
- Vanilla JavaScript projects
- Simple React apps (Create React App)
- Vue.js projects
- Backend Node.js services
- Any environment where you control instantiation

### Use Wrapper Pattern (`getClient()`)
- **This Next.js starter template**
- Projects with SSR/SSG requirements
- Projects needing singleton behavior
- Projects with complex auth state management

## Available Exports from This Template

### From `@/lib/pocketbase/index.ts`

```typescript
// Client management
export { createClient, getClient } from "./client";

// Authentication helpers
export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  signInWithOAuth,
  getCurrentUser,
  isAuthenticated,
} from "./auth";

export type { AuthResult } from "./auth";
```

### From `@/lib/pocketbase/server`

```typescript
// Server-side only
export { createServerClient, getServerUser } from "./server";
```

## Common Patterns in This Template

### Client Components

```typescript
"use client";

import { getClient, getCurrentUser } from "@/lib/pocketbase";

export default function MyComponent() {
  const loadData = async () => {
    const pb = getClient();  // ← Always get client first
    const records = await pb.collection('posts').getList();
  };

  // ... rest of component
}
```

### Server Components

```typescript
import { createServerClient } from "@/lib/pocketbase/server";

export default async function MyServerComponent() {
  const pb = await createServerClient();
  const records = await pb.collection('posts').getList();

  return <div>{/* render records */}</div>;
}
```

### Authentication Helpers

The template provides high-level auth functions so you don't need to use `pb` directly for auth:

```typescript
import {
  signInWithEmail,
  signUpWithEmail,
  getCurrentUser,
  signOut
} from "@/lib/pocketbase";

// Sign in
const { error } = await signInWithEmail(email, password);

// Sign up
const { error } = await signUpWithEmail(email, password, {
  first_name: "John",
  last_name: "Doe"
});

// Get current user
const user = getCurrentUser();

// Sign out
await signOut();
```

## Updating the Code Generator

If you're using AI to generate PocketBase code for this template, make sure to specify:

> "This project uses a PocketBase wrapper pattern. Import `getClient` from `@/lib/pocketbase` and call it to get the PocketBase instance. Do NOT import `pb` directly."

## Example: Before and After

### Before (following PocketBase docs)
```typescript
import { pb } from "@/lib/pocketbase";  // ❌ ERROR

export default function Dashboard() {
  const loadApps = async () => {
    const apps = await pb.collection("applications").getFullList();
  };
}
```

### After (template pattern)
```typescript
import { getClient } from "@/lib/pocketbase";  // ✅ CORRECT

export default function Dashboard() {
  const loadApps = async () => {
    const pb = getClient();  // ← Get instance
    const apps = await pb.collection("applications").getFullList();
  };
}
```

## Summary

| Aspect | Official Docs | This Template |
|--------|---------------|---------------|
| Import | `import PocketBase from 'pocketbase'` | `import { getClient } from '@/lib/pocketbase'` |
| Instantiation | `const pb = new PocketBase(url)` | `const pb = getClient()` |
| Export | Direct instance | Function that returns instance |
| SSR Support | Manual handling | Built-in |
| Auth Persistence | Manual cookies | Automatic |
| Singleton | Manual | Built-in (client-side) |

## Related Files

- `/src/lib/pocketbase/client.ts` - Client-side wrapper implementation
- `/src/lib/pocketbase/server.ts` - Server-side wrapper implementation
- `/src/lib/pocketbase/auth.ts` - Authentication helpers
- `/src/lib/pocketbase/index.ts` - Public exports
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Error solutions

## Recommendation

**The PocketBase skill documentation is NOT wrong** - it accurately represents the official PocketBase SDK usage. However, it doesn't account for this starter template's custom wrapper pattern.

When using this template:
1. ✅ Always use `getClient()` instead of direct `pb` imports
2. ✅ Use the provided auth helpers (`signInWithEmail`, etc.)
3. ✅ Reference this file when generating new code
4. ❌ Don't follow official PocketBase examples verbatim - adapt them for the wrapper pattern

---

**Last Updated:** 2026-01-07
