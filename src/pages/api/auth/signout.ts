/**
 * Sign-out API endpoint — clears session and redirects to landing page.
 *
 * Accepts POST requests (used by Nav sign-out form).
 * Also accepts GET for convenience (direct link fallback).
 */

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase-server';

export const prerender = false;

async function handleSignOut(context: Parameters<APIRoute>[0]): Promise<Response> {
  const supabase = createServerClient({
    cookies: context.cookies,
    request: context.request,
  });

  await supabase.auth.signOut();

  return context.redirect('/', 302);
}

export const POST: APIRoute = async (context) => {
  return handleSignOut(context);
};

export const GET: APIRoute = async (context) => {
  return handleSignOut(context);
};
