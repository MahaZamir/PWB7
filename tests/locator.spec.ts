import {test, expect } from '@playwright/test';
test.describe('Login Page', () => {
    test('should allow users to log in with valid credentials', async ({ page }) => {
        await page.goto('https://practicetestautomation.com/practice-test-login/');
 
        //select button

        await page.getByRole('textbox', {name: 'username'}).fill('maha');   
        await page.getByRole('textbox', {name: 'password'}).fill('maha');   
        //await page.getByRole('button', { name: 'Submit'}).click();

        await expect(page.getByRole('textbox', {name: 'username'})).toBeVisible();
        await expect(page.getByRole('textbox', {name: 'password'})).toBeVisible();
        await expect(page.getByRole('button', {name: 'Submit'})).toBeEnabled();

        //await expect(page.locator("#error")).not.toHaveClass(/show/);
        
    });
});

//PW dont use xpath more
//ids preferred
//