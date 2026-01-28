import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getClient } from "./client";
import type { RecordModel } from "pocketbase";
import type PocketBase from "pocketbase";

/**
 * SSR-safe hook for accessing PocketBase client.
 *
 * PocketBase uses browser cookies for auth, which aren't available during SSR.
 * This hook ensures PocketBase is only accessed after the component has mounted.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { pb, isReady } = usePocketBase();
 *
 *   useEffect(() => {
 *     if (!isReady) return;
 *     // Safe to use pb here
 *     pb.collection("items").getList();
 *   }, [isReady, pb]);
 * }
 * ```
 */
export function usePocketBase() {
  const [mounted, setMounted] = useState(false);
  const [pb, setPb] = useState<PocketBase | null>(null);

  useEffect(() => {
    setMounted(true);
    setPb(getClient());
  }, []);

  return { pb, mounted, isReady: mounted && pb !== null };
}

/**
 * Hook for protected routes that require authentication.
 *
 * Automatically redirects to /login if not authenticated.
 * Provides the current user, loading state, and PocketBase client.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { user, loading, pb } = useAuth();
 *
 *   if (loading) return <Skeleton />;
 *
 *   return <div>Welcome, {user?.name}</div>;
 * }
 * ```
 */
export function useAuth(redirectTo: string = "/login") {
  const navigate = useNavigate();
  const { pb, isReady } = usePocketBase();
  const [user, setUser] = useState<RecordModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !pb) return;

    if (!pb.authStore.isValid) {
      navigate({ to: redirectTo });
      return;
    }

    setUser(pb.authStore.record);
    setLoading(false);
  }, [isReady, pb, navigate, redirectTo]);

  const logout = useCallback(() => {
    if (pb) {
      pb.authStore.clear();
      navigate({ to: "/" });
    }
  }, [pb, navigate]);

  return {
    user,
    loading,
    pb,
    isAuthenticated: !!user,
    logout
  };
}

/**
 * Hook for SSR-safe data fetching from PocketBase.
 *
 * Handles loading states, errors, and cancellation automatically.
 * Only executes the query after the component has mounted.
 *
 * @example
 * ```tsx
 * function ItemList() {
 *   const { data, loading, error, refetch } = usePocketBaseQuery(
 *     (pb) => pb.collection("items").getList(1, 50),
 *     [] // dependencies that trigger refetch
 *   );
 *
 *   if (loading) return <Skeleton />;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <ul>{data?.items.map(item => <li>{item.name}</li>)}</ul>;
 * }
 * ```
 */
export function usePocketBaseQuery<T>(
  queryFn: (pb: PocketBase) => Promise<T>,
  deps: unknown[] = []
) {
  const { pb, isReady } = usePocketBase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    if (!isReady || !pb) return;

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn(pb);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [isReady, pb, queryFn]);

  useEffect(() => {
    if (!isReady) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await queryFn(pb!);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, pb, ...deps]);

  return { data, loading, error, refetch: execute };
}

/**
 * Hook for SSR-safe mutations (create, update, delete) with PocketBase.
 *
 * @example
 * ```tsx
 * function CreateItem() {
 *   const { mutate, loading, error } = usePocketBaseMutation(
 *     (pb, data: { name: string }) => pb.collection("items").create(data)
 *   );
 *
 *   const handleSubmit = async (name: string) => {
 *     const result = await mutate({ name });
 *     if (result) toast.success("Created!");
 *   };
 * }
 * ```
 */
export function usePocketBaseMutation<TData, TResult>(
  mutationFn: (pb: PocketBase, data: TData) => Promise<TResult>
) {
  const { pb, isReady } = usePocketBase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: TData): Promise<TResult | null> => {
    if (!isReady || !pb) {
      setError(new Error("PocketBase not ready"));
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(pb, data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isReady, pb, mutationFn]);

  return { mutate, loading, error };
}
