import { test, expect } from '@playwright/test';

/**
 * Diagnostic test: launcher → Memory Map navigation
 *
 * This test exercises the preview server click-through path that was reported
 * as broken (blank page at /tools/memory-map/).  It captures the exact URL,
 * any console errors, and whether the mind-elixir canvas actually renders.
 */

// Use the baseURL from playwright.config.ts (set via the webServer.port).
// Empty string makes page.goto('/…') resolve relative to baseURL.
const PREVIEW_BASE = '';

test.describe('Suite Launcher → Memory Map navigation', () => {
  test('clicking Memory Map card from launcher renders the app', async ({ page }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('requestfailed', req => {
      failedRequests.push(`${req.failure()?.errorText} — ${req.url()}`);
    });

    // ── Step 1: load the launcher ───────────────────────────────────────────
    // Locally, vite preview serves dist/ at the server root, so the launcher
    // lives at http://localhost:4173/ (not at the /memory-map-mind-elixir/ base).
    await page.goto(`/`);
    await expect(page).toHaveTitle('Effectiveness Toolkit');

    const launcherURL = page.url();
    console.log(`[DIAG] Launcher URL: ${launcherURL}`);

    // ── Step 2: click the Memory Map card ──────────────────────────────────
    const mmLink = page.locator('a.tool-card[aria-label*="Memory Map"]');
    const href = await mmLink.getAttribute('href');
    console.log(`[DIAG] Link href attribute: ${href}`);

    await Promise.all([
      page.waitForURL(/tools\/memory-map/),
      mmLink.click(),
    ]);

    const landingURL = page.url();
    console.log(`[DIAG] Landing URL after click: ${landingURL}`);

    // ── Step 3: assert the URL contains the tool path ───────────────────────
    expect(landingURL, 'URL must contain tools/memory-map path').toContain(
      '/tools/memory-map/'
    );

    // ── Step 4: wait for the React app to render ────────────────────────────
    // mind-elixir renders a <me-main> shadow-host element (or at minimum
    // the #app-root wrapper the React app creates).
    await page.waitForTimeout(3000); // allow React + mind-elixir to boot

    const rootDiv = page.locator('#root');
    const rootHTML = await rootDiv.innerHTML();
    console.log(`[DIAG] #root innerHTML length: ${rootHTML.length}`);

    // A blank page leaves #root empty; a rendered app has content.
    expect(rootHTML.trim().length, '#root must not be empty').toBeGreaterThan(50);

    // ── Step 5: no 404s or console errors ───────────────────────────────────
    console.log(`[DIAG] Console errors: ${JSON.stringify(consoleErrors)}`);
    console.log(`[DIAG] Failed requests: ${JSON.stringify(failedRequests)}`);

    expect(failedRequests.filter(r => r.includes('404') || r.includes('net::ERR'))).toHaveLength(0);
  });

  test('direct navigation to /memory-map-mind-elixir/tools/memory-map/ renders app', async ({ page }) => {
    const failedRequests: string[] = [];
    page.on('requestfailed', req => failedRequests.push(req.url()));

    await page.goto(`/tools/memory-map/`);
    await expect(page).toHaveTitle('Memory Map Action Planner');
    await page.waitForTimeout(3000);

    const rootHTML = await page.locator('#root').innerHTML();
    console.log(`[DIAG] Direct nav - #root innerHTML length: ${rootHTML.length}`);
    expect(rootHTML.trim().length).toBeGreaterThan(50);
    expect(failedRequests).toHaveLength(0);
  });
});
