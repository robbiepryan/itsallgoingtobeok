/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    /** Authenticated user — set by middleware for protected routes. */
    user?: import('@supabase/supabase-js').User;
  }
}
