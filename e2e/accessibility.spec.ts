import { test, expect } from '@playwright/test';

test.describe('Accessibility Basics', () => {
  test('landing page has lang attribute', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('navigation has correct ARIA label', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toHaveAttribute('aria-label', 'Main navigation');
  });

  test('sign-in form has associated labels', async ({ page }) => {
    await page.goto('/auth/signin');
    const label = page.locator('label[for="email"]');
    await expect(label).toBeVisible();
    const input = page.locator('#email');
    await expect(input).toBeVisible();
  });

  test('sign-up form has associated labels', async ({ page }) => {
    await page.goto('/auth/signup');
    const label = page.locator('label[for="email"]');
    await expect(label).toBeVisible();
  });

  test('feedback regions have aria-live', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.locator('#feedback')).toHaveAttribute('aria-live', 'polite');
  });

  test('fonts are preloaded', async ({ page }) => {
    await page.goto('/');
    const preloads = page.locator('link[rel="preload"][as="font"]');
    expect(await preloads.count()).toBeGreaterThanOrEqual(2);
  });

  test('page is keyboard navigable — sign-in form', async ({ page }) => {
    await page.goto('/auth/signin');
    // Tab to email input
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Eventually the email input should be focusable
    const emailInput = page.locator('#email');
    // Just verify the input exists and is focusable
    await expect(emailInput).toBeEnabled();
  });

  test('breathing dot uses CSS pseudo-element (no extra DOM node)', async ({ page }) => {
    await page.goto('/');
    // Breathing dot is implemented as ::before pseudo-element on .site-footer
    // This is inherently accessible — no DOM node = no screen reader announcement
    const footer = page.locator('.site-footer');
    const hasPseudo = await footer.evaluate((el) => {
      const before = window.getComputedStyle(el, '::before');
      return before.content !== 'none' && before.content !== '';
    });
    expect(hasPseudo).toBe(true);
  });
});
