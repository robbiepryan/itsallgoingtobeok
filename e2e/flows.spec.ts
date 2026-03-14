import { test, expect } from '@playwright/test';

test.describe('Cross-Page Navigation Flows', () => {
  test('landing → sign-in → sign-up → landing', async ({ page }) => {
    // Start at landing
    await page.goto('/');
    await expect(page.locator('.hero-title')).toContainText('Your wins');

    // Click Sign In CTA
    await page.locator('.cta--primary').click();
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.locator('.auth-title')).toContainText('Welcome back');

    // Click Create an account link
    await page.locator('.auth-link').click();
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('.auth-title')).toContainText('New operative');

    // Click wordmark to go home
    await page.locator('.site-nav__wordmark').click();
    await expect(page).toHaveURL('/');
    await expect(page.locator('.hero-title')).toContainText('Your wins');
  });

  test('sign-up → sign-in flow', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page.locator('.auth-alt')).toContainText('Already have an account');

    await page.locator('.auth-link').click();
    await expect(page).toHaveURL(/\/auth\/signin/);
    await expect(page.locator('.auth-title')).toContainText('Welcome back');
  });

  test('protected route → auto-redirect → sign-in with returnTo', async ({ page }) => {
    // Try to access dashboard
    await page.goto('/dashboard');

    // Should be redirected to sign-in
    await expect(page).toHaveURL(/\/auth\/signin/);

    // returnTo query param should be preserved
    const url = new URL(page.url());
    expect(url.searchParams.get('returnTo')).toBe('/dashboard');

    // Sign-in page should render correctly
    await expect(page.locator('.auth-title')).toContainText('Welcome back');
  });
});
