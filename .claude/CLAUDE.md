# Vibecoder Starter Template

You are helping a vibecoder (non-technical user) build their app idea. Your job is to read their app description and build it for them.

**The current code is just a starter template.** Feel free to completely modify, replace, or delete any existing pages and components to match what the user wants. Nothing is sacred—rebuild everything to fit their vision.

### Skills

You have access to skills that explain how to use and cofigure different technologies in this repo. Please always use the apropiate skill when planing or completing a task.

Check the /skills directory to understand which skills you have access to before doing anything else.

## Your Workflow

1. Check `documentation/` for the app spec
2. Plan the design of the app as needed. Use the design skill and the frontend skill.
3. Plan the pages and data models needed
4. Create PocketBase collections if needed. Please USE the pocketbase collection skill to do this properly
5. TEST DRIVEN DEVELOPMENT: create a comprehensive test suit to test all collections and api endpoints for the data to make sure everything is working correclty.
6. Achive 100% test coverage beofre you move on to the next step. NO EXCEPTIONS.
7. Build pages one at a time, testing each
8. Style with Tailwind and shadcn/ui components. Use the shadcn skills.

## Desing

It is critical that the design and ux of the application is and feels world class.
Please elaborate landing pages in depth and use the motion skills always to create great motion animations when needed.

## Environment

This repo runs in an **e2b sandbox** or **local Docker environment**. Everything is pre-configured:

- **Port 3000**: TanStack Start app (auto-opens)
- **Port 8090**: PocketBase database + Admin UI at `/_/`


### Common pitfalls

We need to deploy pocketbase migrations without having to rely on the user.

Pocketbase is run inside a docker container, use the pocketbase api to run the migrations.

There is an admin created at container startup.

### URL Routing (Important!)

The `.devcontainer/setup.sh` generates two PocketBase URLs:

| Variable                      | Value                               | Used By           |
| ----------------------------- | ----------------------------------- | ----------------- |
| `VITE_PUBLIC_POCKETBASE_URL`  | `http://localhost:8090`             | Browser           |
| `VITE_POCKETBASE_URL`         | `http://pocketbase:8090`            | Server (internal) |

Browser can't reach Docker internal network, so it uses localhost for browser requests.

## Stack

| Tool           | Purpose         | Location             |
| -------------- | --------------- | -------------------- |
| TanStack Start | App framework   | `src/routes/`        |
| TanStack Router| Routing         | File-based routes    |
| Vite           | Build tool      | `vite.config.ts`     |
| Tailwind v4    | Styling         | Classes in JSX       |
| shadcn/ui      | UI components   | `src/components/ui/` |
| PocketBase     | Auth + Database | `@/lib/pocketbase`   |
| OpenRouter     | AI/LLM          | `@/lib/ai`           |

## File Structure

```
src/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout
│   ├── index.tsx     # Home page (/)
│   └── login.tsx     # Login page (/login)
├── components/ui/    # shadcn/ui components
├── lib/
│   ├── pocketbase/   # PocketBase client & auth
│   └── ai/           # OpenRouter integration
├── styles/
│   └── app.css       # Global styles (Tailwind)
├── router.tsx        # Router configuration
└── routeTree.gen.ts  # Auto-generated route tree (don't edit)
```

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Run production server

## Key Differences from Next.js

### Links
```tsx
// Use TanStack Router Link
import { Link } from "@tanstack/react-router"
<Link to="/login">Login</Link>
```

### Navigation
```tsx
import { useNavigate } from "@tanstack/react-router"
const navigate = useNavigate()
navigate({ to: "/" })
```

### Server Functions
```tsx
// Use createServerFn for server-side logic
import { createServerFn } from "@tanstack/react-start"

export const myServerFn = createServerFn({ method: "POST" })
  .validator((data) => data)
  .handler(async ({ data }) => {
    // Server-side code
    return result
  })
```

### Environment Variables
```tsx
// Use import.meta.env for Vite
import.meta.env.VITE_PUBLIC_POCKETBASE_URL
```

## Environment Variables (CRITICAL)

This is a **Vite** project, NOT Next.js:
- Use `VITE_PUBLIC_*` prefix for client-accessible variables (**NOT** `NEXT_PUBLIC_`)
- Use `import.meta.env.VITE_PUBLIC_*` to access them (**NOT** `process.env`)

| Variable | Usage | Example |
|----------|-------|---------|
| `VITE_PUBLIC_*` | Browser accessible | `import.meta.env.VITE_PUBLIC_POCKETBASE_URL` |
| `VITE_*` | Server only | `import.meta.env.VITE_POCKETBASE_URL` |

Common mistake: Using `NEXT_PUBLIC_POCKETBASE_URL` will NOT work. Always use `VITE_PUBLIC_`.

## PocketBase with SSR (IMPORTANT)

PocketBase auth store is **NOT available during SSR** because it relies on browser cookies. Always use the provided hooks:

```tsx
// WRONG - breaks on server, causes hydration errors
const pb = getClient();
if (!pb.authStore.isValid) { /* redirect */ }

// CORRECT - SSR safe
import { useAuth } from "@/lib/pocketbase/hooks";
const { user, loading, pb } = useAuth();
```

### Available Hooks

| Hook | Purpose |
|------|---------|
| `usePocketBase()` | Get SSR-safe PocketBase client |
| `useAuth()` | Protected routes with auto-redirect |
| `usePocketBaseQuery()` | SSR-safe data fetching |
| `usePocketBaseMutation()` | SSR-safe create/update/delete |

### Handler Functions Pattern

For event handlers that need PocketBase, get a fresh instance:

```tsx
const handleSave = async () => {
  const pb = getClient(); // Get fresh instance inside handler
  await pb.collection("items").create({ name: "New Item" });
};
```

## TanStack Router Quick Reference

### Links
```tsx
import { Link } from "@tanstack/react-router"

// Simple link
<Link to="/dashboard">Dashboard</Link>

// Link with params
<Link to="/visits/$visitId" params={{ visitId: "123" }}>View Visit</Link>
```

### Navigation
```tsx
import { useNavigate } from "@tanstack/react-router"

const navigate = useNavigate();

// Simple navigation
navigate({ to: "/dashboard" });

// With params
navigate({ to: "/visits/$visitId", params: { visitId: "123" } });

// Replace history (no back button)
navigate({ to: "/dashboard", replace: true });
```

### Route Params
```tsx
// In /routes/visits/$visitId.tsx
const { visitId } = Route.useParams();
```

### Differences from Next.js

| Next.js | TanStack Router |
|---------|-----------------|
| `useRouter().push("/path")` | `navigate({ to: "/path" })` |
| `router.query.id` | `Route.useParams().id` |
| `<Link href="/path">` | `<Link to="/path">` |
| `NEXT_PUBLIC_*` | `VITE_PUBLIC_*` |
| `process.env.*` | `import.meta.env.*` |
