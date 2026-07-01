import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '..', 'playwright', '.auth', 'authentication.json');

test.describe('Using stored auth', () => {
  test('auth file exists and contains cookies', async () => {
    expect(fs.existsSync(authFile)).toBeTruthy();
    const raw = fs.readFileSync(authFile, 'utf8');
    const state = JSON.parse(raw);
    expect(state).toBeTruthy();
    expect(Array.isArray(state.cookies)).toBeTruthy();
  });

  test.use({ storageState: authFile });
  test('should load storage state in test context', async ({ page }) => {
    await page.goto('https://practicetestautomation.com/');
    
    await expect(page).toHaveTitle(/Practice/);
  });
});
