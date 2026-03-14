import { test, expect } from '@playwright/test';

test.describe('Anti-Shame Language Compliance', () => {
  const FORBIDDEN_PHRASES = [
    'you should have',
    'you\'re letting',
    'try harder',
    'you failed to',
    'don\'t forget to',
    'be better',
    'disappointing',
    'letting down',
    'you need to',
    'why didn\'t you',
    'you promised',
    'again?',
  ];

  const PUBLIC_PAGES = ['/', '/auth/signin', '/auth/signup'];

  for (const pagePath of PUBLIC_PAGES) {
    test(`no forbidden shame phrases on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      const bodyText = await page.locator('body').innerText();
      const lower = bodyText.toLowerCase();

      for (const phrase of FORBIDDEN_PHRASES) {
        expect(lower).not.toContain(phrase.toLowerCase());
      }
    });
  }

  test('sign-in error uses anti-shame framing', async ({ page }) => {
    await page.goto('/auth/signin');
    // Submit empty form
    await page.locator('#submit-btn').click();

    const feedback = await page.locator('#feedback').innerText();
    // Should blame ADHD, not the user
    expect(feedback).toContain('ADHD');
    expect(feedback).not.toContain('you forgot');
    expect(feedback).not.toContain('you need');
  });

  test('sign-up error uses anti-shame framing', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.locator('#submit-btn').click();

    const feedback = await page.locator('#feedback').innerText();
    expect(feedback).toContain('ADHD');
  });

  test('landing page externalizes ADHD as opponent', async ({ page }) => {
    await page.goto('/');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toContain('ADHD');
    // Should reference ADHD as the enemy, not the user
    expect(bodyText).toContain('ADHD is the opponent');
  });

  test('landing page contains only positive framing', async ({ page }) => {
    await page.goto('/');
    const bodyText = await page.locator('body').innerText();
    // Positive terms should be present
    expect(bodyText).toContain('wins');
    expect(bodyText).toContain('evidence');
    expect(bodyText).toContain('victories');
  });
});
