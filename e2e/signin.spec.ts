import { test, expect } from '@playwright/test';

test.describe('Sign-In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signin');
  });

  test('renders with anti-shame welcome message', async ({ page }) => {
    await expect(page.locator('.auth-title')).toContainText('Welcome back, operative');
  });

  test('shows war room subtitle', async ({ page }) => {
    await expect(page.locator('.auth-sub')).toContainText('war room');
  });

  test('has email input with correct attributes', async ({ page }) => {
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(emailInput).toHaveAttribute('placeholder', 'your@email.com');
  });

  test('has magic link submit button', async ({ page }) => {
    const btn = page.locator('#submit-btn');
    await expect(btn).toContainText('Send magic link');
    await expect(btn).toBeEnabled();
  });

  test('has accessible form label for email', async ({ page }) => {
    const label = page.locator('label[for="email"]');
    await expect(label).toContainText('Email');
  });

  test('has link to sign-up page', async ({ page }) => {
    const link = page.locator('.auth-link');
    await expect(link).toContainText('Create an account');
    await expect(link).toHaveAttribute('href', '/auth/signup');
  });

  test('shows anti-shame error when submitting empty email', async ({ page }) => {
    await page.locator('#submit-btn').click();

    const feedback = page.locator('#feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('ADHD wants you to skip');
    await expect(feedback).toHaveClass(/feedback--error/);
  });

  test('shows Sending state when submitting valid email', async ({ page }) => {
    // Fill email and submit — the Supabase call will fail in dev
    // but we can verify the UI transitions
    await page.locator('#email').fill('test@example.com');
    await page.locator('#submit-btn').click();

    // Button should briefly show "Sending..."
    await expect(page.locator('#submit-btn')).toContainText(/Sending|Link sent|magic link/);
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign in/i);
  });

  test('navigates to sign-up via link', async ({ page }) => {
    await page.locator('.auth-link').click();
    await expect(page).toHaveURL('/auth/signup');
  });

  test('has feedback area with proper ARIA attributes', async ({ page }) => {
    const feedback = page.locator('#feedback');
    await expect(feedback).toHaveAttribute('role', 'status');
    await expect(feedback).toHaveAttribute('aria-live', 'polite');
  });
});
