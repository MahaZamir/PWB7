import {test, expect } from '@playwright/test';
test.describe('Login Page', () => {
    test('Test case 1: Positive LogIn test', async ({ page }) => {
        await page.goto('https://practicetestautomation.com/practice-test-login/');

        await page.getByRole('textbox', {name: 'username'}).fill('student');   
        await page.getByRole('textbox', {name: 'password'}).fill('Password123');   
        await page.getByRole('button', { name: 'Submit'}).click();
        await expect(page).toHaveURL('https://practicetestautomation.com/logged-in-successfully/');
        await expect(page.getByRole('heading', {name: 'Logged In Successfully'})).toBeVisible();
        await expect(page.getByRole('link', {name: 'Log out'})).toBeVisible();
    });

    test('Test case 2: Negative username test', async ({ page }) => {
        await page.goto('https://practicetestautomation.com/practice-test-login/'); 

        await page.getByRole('textbox', {name: 'username'}).fill('maha');   
        await page.getByRole('textbox', {name: 'password'}).fill('Password123');   
        await page.getByRole('button', { name: 'Submit'}).click();
       
        await expect(page.locator("#error")).toHaveClass(/show/);
        await expect(page.locator("#error")).toHaveText('Your username is invalid!');
        
    });
    test('Test case 3: Negative password test', async ({ page }) => {
        await page.goto('https://practicetestautomation.com/practice-test-login/'); 

        await page.getByRole('textbox', {name: 'username'}).fill('student');   
        await page.getByRole('textbox', {name: 'password'}).fill('incorrectPassword');   
        await page.getByRole('button', { name: 'Submit'}).click();
       
        await expect(page.locator("#error")).toHaveClass(/show/);
        await expect(page.locator("#error")).toHaveText('Your password is invalid!');
        
    });
});


//npx playwright test -g "Test case 3"--headed --project=chromium