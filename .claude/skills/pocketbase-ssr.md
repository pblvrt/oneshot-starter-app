# PocketBase with TanStack Start (SSR)

## The Problem

PocketBase client uses browser cookies for authentication. During Server-Side Rendering (SSR), these cookies aren't available because:

1. The code runs on the server first
2. `document.cookie` doesn't exist on the server
3. `pb.authStore.isValid` returns `false` on server

This causes hydration mismatches and broken auth flows.

## Solution: SSR-Safe Hooks

The template provides hooks in `@/lib/pocketbase/hooks` that handle SSR automatically:

### `usePocketBase()`

Basic hook for SSR-safe PocketBase client access.

```tsx
import { usePocketBase } from "@/lib/pocketbase/hooks";

function MyComponent() {
  const { pb, isReady } = usePocketBase();

  useEffect(() => {
    if (!isReady) return;
    // Safe to use pb here - component has mounted
    pb.collection("items").getList(1, 50);
  }, [isReady, pb]);
}
```

### `useAuth()`

For protected routes that require authentication. Automatically redirects to login.

```tsx
import { useAuth } from "@/lib/pocketbase/hooks";

function Dashboard() {
  const { user, loading, pb, logout } = useAuth();

  if (loading) return <Skeleton />;

  return (
    <div>
      Welcome, {user?.name}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### `usePocketBaseQuery()`

For fetching data with automatic loading/error states.

```tsx
import { usePocketBaseQuery } from "@/lib/pocketbase/hooks";

function ItemList() {
  const { data, loading, error, refetch } = usePocketBaseQuery(
    (pb) => pb.collection("items").getList(1, 50),
    [] // dependencies that trigger refetch
  );

  if (loading) return <Skeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### `usePocketBaseMutation()`

For create/update/delete operations.

```tsx
import { usePocketBaseMutation } from "@/lib/pocketbase/hooks";

function CreateItem() {
  const { mutate, loading, error } = usePocketBaseMutation(
    (pb, data: { name: string }) => pb.collection("items").create(data)
  );

  const handleSubmit = async (name: string) => {
    const result = await mutate({ name });
    if (result) toast.success("Created!");
  };

  return (
    <button onClick={() => handleSubmit("New Item")} disabled={loading}>
      {loading ? "Creating..." : "Create"}
    </button>
  );
}
```

## Handler Functions Pattern

For event handlers (onClick, onSubmit, etc.), get a fresh PocketBase instance:

```tsx
function MyComponent() {
  // DON'T store pb at component level for handlers
  // DO get a fresh instance inside the handler

  const handleSave = async () => {
    const pb = getClient(); // Fresh instance
    await pb.collection("items").create({ name: "New Item" });
  };

  const handleDelete = async (id: string) => {
    const pb = getClient(); // Fresh instance
    await pb.collection("items").delete(id);
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Common Errors and Solutions

### "pb.authStore.isValid is false on server"

**Cause:** Checking auth during SSR
**Fix:** Use `useAuth()` hook or `usePocketBase()` with `isReady` check

### "document is not defined"

**Cause:** Accessing `document.cookie` on server
**Fix:** Use the provided hooks which only run after mount

### "Hydration mismatch"

**Cause:** Server renders differently than client
**Fix:** Use `loading` state from hooks to render skeleton/loading UI

### "Auth redirect loop"

**Cause:** Checking auth before component mounts
**Fix:** Use `useAuth()` which handles mount state internally

## The Mounted State Pattern

If you need custom behavior, here's the underlying pattern:

```tsx
function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Wait for client-side mount

    const pb = getClient();
    // Now safe to use pb
  }, [mounted]);
}
```

The hooks encapsulate this pattern so you don't have to repeat it.
