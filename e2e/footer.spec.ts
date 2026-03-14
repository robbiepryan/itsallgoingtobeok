import { test, expect } from '@playwright/test';

test.describe('Footer', () => {
  test('renders anti-shame tagline on landing page', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.site-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('ADHD is the opponent');
    await expect(footer).toContainText('Never you');
  });

  test('renders breathing dot via CSS pseudo-element', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.site-footer');
    // Breathing dot is a ::before pseudo-element — verify it exists via computed style
    const hasPseudo = await footer.evaluate((el) => {
      const before = window.getComputedStyle(el, '::before');
      return before.content !== 'none' && before.content !== '';
    });
    expect(hasPseudo).toBe(true);
  });

  test('footer is present on auth pages', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('.site-footer')).toContainText('ADHD is the opponent');
  });

  test('footer is present across all static pages', async ({ page }) => {
    for (const path of ['/', '/auth/signin', '/auth/signup']) {
      await page.goto(path);
      await expect(page.locator('.site-footer')).toBeVisible();
    }
  });
});
