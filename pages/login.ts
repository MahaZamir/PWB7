import { Page, Locator } from "@playwright/test";

class LoginPage {

    //field locators define 
    readonly loginfield: Locator;
    readonly passwordfield: Locator;
    readonly submitbutton: Locator;


    constructor(page: Page) { 
        this.loginfield = page.getByRole('textbox', { name: 'Username' })
        this.passwordfield = page.getByRole('textbox', { name: 'Password' })
        this.submitbutton = page.getByRole('button', { name: 'Submit' })    
    }
//define function
    async enterUsername(username: string) {
        await this.loginfield.fill(username)
    }

    async enterPassword(password: string) {
        await this.passwordfield.fill(password)
    }

    async clickSubmit() {
        await this.submitbutton.click()
    }
}

export default LoginPage;