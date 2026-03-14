/**
 * Server-side Supabase client — uses @supabase/ssr for cookie-based auth.
 *
 * Use `createServerClient()` in Astro server routes, middleware, and
 * API endpoints to validate sessions via cookies.
 */

import {
  createServerClient as createSupabaseServerClient,
  parseCookieHeader,
} from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

interface ServerClientContext {
  cookies: AstroCookies;
  request: Request;
}

/**
 * Create an authenticated Supabase client from Astro request context.
 *
 * Usage in an Astro page or API route:
 * ```ts
 * const supabase = createServerClient({ cookies: Astro.cookies, request: Astro.request });
 * const { data: { user } } = await supabase.auth.getUser();
 * ```
 */
export function createServerClient({ cookies, request }: ServerClientContext) {
  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('cookie') ?? '');
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, {
            path: '/',
            ...options,
          });
        }
      },
    },
  });
}
