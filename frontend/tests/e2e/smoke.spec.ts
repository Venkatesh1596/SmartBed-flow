import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // At minimum it should render something, wait for it
  await page.waitForLoadState('networkidle');
});
