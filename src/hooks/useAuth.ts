"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id?: string;
  name: string;
  email: string;
  onboarded?: boolean;
}

interface UseAuthOptions {
  /** If true, redirects to `/` when unauthenticated (default: true) */
  requireAuth?: boolean;
  /** If true, redirects onboarded=false users to `/dashboard` (default: false) */
  requireOnboarded?: boolean;
  /** Path to redirect to on logout (default: `/`) */
  logoutRedirect?: string;
}

interface UseAuthReturn {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

/**
 * Reusable auth hook that checks authentication status via `/api/auth/me`.
 * Replaces the duplicated `useEffect` + fetch pattern across 13+ pages.
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const {
    requireAuth = true,
    requireOnboarded = false,
    logoutRedirect = "/",
  } = options;

  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          if (requireAuth && !cancelled) router.push("/");
          else if (!cancelled) setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data || data.error) {
          if (requireAuth && !cancelled) router.push("/");
          else if (!cancelled) setLoading(false);
          return;
        }
        if (requireOnboarded && !data.onboarded) {
          if (!cancelled) router.push("/assessment");
          return;
        }
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error("Auth check failed"));
          if (requireAuth) router.push("/");
          else setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [router, requireAuth, requireOnboarded]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      router.push(logoutRedirect);
    }
  }, [router, logoutRedirect]);

  return { user, loading, error, logout };
}
