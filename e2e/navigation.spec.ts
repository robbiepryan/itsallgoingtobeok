import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('renders wordmark linking to home', async ({ page }) => {
    await page.goto('/');
    const wordmark = page.locator('.site-nav__wordmark');
    await expect(wordmark).toContainText('itsallgoingtobeok');
    await expect(wordmark).toHaveAttribute('href', '/');
  });

  test('shows Sign In link when unauthenticated', async ({ page }) => {
    await page.goto('/');
    const navLinks = page.locator('#nav-links');
    await expect(navLinks).toContainText('Sign in');
    await expect(navLinks.locator('a')).toHaveAttribute('href', '/auth/signin');
  });

  test('nav is present on sign-in page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.locator('.site-nav')).toBeVisible();
    await expect(page.locator('.site-nav__wordmark')).toContainText('itsallgoingtobeok');
  });

  test('nav is present on sign-up page', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page.locator('.site-nav')).toBeVisible();
    await expect(page.locator('.site-nav__wordmark')).toContainText('itsallgoingtobeok');
  });

  test('nav wordmark navigates to home', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.locator('.site-nav__wordmark').click();
    await expect(page).toHaveURL('/');
  });
});
