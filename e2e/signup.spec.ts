import { test, expect } from '@playwright/test';

test.describe('Sign-Up Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup');
  });

  test('renders with anti-shame welcome message', async ({ page }) => {
    await expect(page.locator('.auth-title')).toContainText('New operative? Welcome');
  });

  test('shows join-the-fight subtitle', async ({ page }) => {
    await expect(page.locator('.auth-sub')).toContainText('fight against ADHD');
  });

  test('has email input with correct attributes', async ({ page }) => {
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
  });

  test('has magic link submit button', async ({ page }) => {
    const btn = page.locator('#submit-btn');
    await expect(btn).toContainText('Send magic link');
    await expect(btn).toBeEnabled();
  });

  test('has link to sign-in page', async ({ page }) => {
    const link = page.locator('.auth-link');
    await expect(link).toContainText('Sign in');
    await expect(link).toHaveAttribute('href', '/auth/signin');
  });

  test('shows anti-shame note about magic links', async ({ page }) => {
    await expect(page.locator('.auth-note')).toContainText('no passwords to forget');
    await expect(page.locator('.auth-note')).toContainText('ADHD has enough ammo');
  });

  test('shows anti-shame error when submitting empty email', async ({ page }) => {
    await page.locator('#submit-btn').click();

    const feedback = page.locator('#feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('ADHD wants you to skip');
    await expect(feedback).toHaveClass(/feedback--error/);
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign up/i);
  });

  test('navigates to sign-in via link', async ({ page }) => {
    await page.locator('.auth-link').click();
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('has feedback area with proper ARIA', async ({ page }) => {
    const feedback = page.locator('#feedback');
    await expect(feedback).toHaveAttribute('role', 'status');
    await expect(feedback).toHaveAttribute('aria-live', 'polite');
  });
});
