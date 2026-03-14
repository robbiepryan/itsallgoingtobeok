import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section with anti-shame messaging', async ({ page }) => {
    await expect(page.locator('.hero-title')).toContainText('Your wins.');
    await expect(page.locator('.hero-title')).toContainText('Your evidence.');
    await expect(page.locator('.hero-title')).toContainText('ADHD doesn\'t define you');
  });

  test('renders hero subtitle about victory evidence', async ({ page }) => {
    await expect(page.locator('.hero-sub')).toContainText('victories live');
    await expect(page.locator('.hero-sub')).toContainText('Evidence that you can');
  });

  test('renders explanation card about what the site is', async ({ page }) => {
    await expect(page.locator('.explanation-heading')).toContainText('What is this?');
    await expect(page.locator('.explanation-card')).toContainText('evidence board');
    await expect(page.locator('.explanation-card')).toContainText('LockIn');
  });

  test('has Sign In CTA linking to auth/signin', async ({ page }) => {
    const signInCta = page.locator('.cta--primary');
    await expect(signInCta).toContainText('Sign in');
    await expect(signInCta).toHaveAttribute('href', '/auth/signin');
  });

  test('has Get the App CTA', async ({ page }) => {
    const appCta = page.locator('.cta--secondary');
    await expect(appCta).toContainText('Get the app');
  });

  test('shows development notice', async ({ page }) => {
    await expect(page.locator('.cta-note')).toContainText('currently in development');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/all going to be ok/i);
  });

  test('has meta description', async ({ page }) => {
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /wins against ADHD/i);
  });

  test('has noindex meta tag', async ({ page }) => {
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/);
  });
});
