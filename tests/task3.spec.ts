import {test, expect, Page} from '@playwright/test';
import loginPage from '../pages/login.ts';
import { username,password } from '../fixture/constant.ts';

test.describe('Login - Page Object Model', () => {

    test('should log in successfully using Page Object Model', async ({ page }) => {    
        await page.goto('https://practicetestautomation.com/practice-test-login/');  

        const loginpage = new loginPage(page);
        await loginpage.enterUsername(username);
        await loginpage.enterPassword(password);
        await loginpage.clickSubmit();

        await expect(page.locator("#error")).toHaveText('Your username is invalid!');
        

    })

});