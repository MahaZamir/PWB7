import { test as setup } from '@playwright/test';
import LoginPage from '../pages/login';
import fs from 'fs';
import path from 'path';
import { username, password } from '../fixture/urlconstant';

const authDir = path.join(__dirname, '..', 'playwright', '.auth');
const authFile = path.join(authDir, 'authentication.json');

setup('Login and save authentication state', async ({ page }) => {

  fs.mkdirSync(authDir, { recursive: true });

  // navigate to login page (uses url from fixture if available)
  const urlPath = path.join(__dirname, '..', 'fixture', 'url.json');
  let loginUrl = 'https://practicetestautomation.com/practice-test-login/';
  try {
    const urls = JSON.parse(fs.readFileSync(urlPath, 'utf8'));
    const base = urls.baseUrl || '';
    const login = urls.loginUrl || '';
    loginUrl = new URL(login, base).toString();
  } catch (e) {
  
  }

  
  if (process.env.LOGIN_URL) {
    loginUrl = process.env.LOGIN_URL;
  }

  try {
    await page.goto(loginUrl, { waitUntil: 'load', timeout: 30000 });
  } catch (err: any) {
    throw new Error(
      `Failed to navigate to ${loginUrl}: ${err.message}.\n` +
        `Check network/DNS or set LOGIN_URL to a reachable URL before running the setup.`
    );
  }
  await page.getByRole('textbox', { name: /username/i }).fill(username);
  await page.getByRole('textbox', { name: /password/i }).fill(password);
  await page.getByRole('button', { name: /submit/i }).click();

  await page.waitForLoadState('networkidle');


  await page.context().storageState({ path: authFile });
});
