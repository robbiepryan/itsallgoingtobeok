import { test, expect } from '@playwright/test';

test.describe('Auth Middleware — Route Protection', () => {
  test('redirects /dashboard to sign-in when unauthenticated', async ({ page }) => {
    const response = await page.goto('/dashboard');
    // Should redirect to sign-in with returnTo param
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page).toHaveURL(/returnTo/);
  });

  test('redirects /settings to sign-in when unauthenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page).toHaveURL(/returnTo/);
  });

  test('preserves returnTo path for /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    const url = new URL(page.url());
    const returnTo = url.searchParams.get('returnTo');
    expect(returnTo).toBe('/dashboard');
  });

  test('preserves returnTo path for /settings', async ({ page }) => {
    await page.goto('/settings');
    const url = new URL(page.url());
    const returnTo = url.searchParams.get('returnTo');
    expect(returnTo).toBe('/settings');
  });

  test('does NOT redirect public routes', async ({ page }) => {
    // Landing page
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Sign-in page
    await page.goto('/auth/signin');
    await expect(page).toHaveURL('/auth/signin');

    // Sign-up page
    await page.goto('/auth/signup');
    await expect(page).toHaveURL('/auth/signup');
  });
});
