/**
 * Astro middleware — protects routes that require authentication.
 *
 * Protected routes: /dashboard, /settings
 * Public routes: /, /auth/*, /u/*
 *
 * Uses server-side Supabase client to validate session from cookies.
 * Unauthenticated requests to protected routes redirect to /auth/signin.
 */

import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from './lib/supabase-server';

/** Routes that require authentication. */
const PROTECTED_PREFIXES = ['/dashboard', '/settings'];

/** Check if a pathname matches a protected route. */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip auth check for non-protected routes
  if (!isProtectedRoute(pathname)) {
    return next();
  }

  // Validate session via server-side Supabase client
  const supabase = createServerClient({
    cookies: context.cookies,
    request: context.request,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to sign-in with return URL
    const returnUrl = encodeURIComponent(pathname);
    return context.redirect(`/auth/signin?returnTo=${returnUrl}`);
  }

  // User authenticated — attach to locals for downstream use
  context.locals.user = user;

  return next();
});
