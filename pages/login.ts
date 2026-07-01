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

<<<<<<< HEAD
export default LoginPage;
=======
export default LoginPage;
>>>>>>> 3336d42670e4206a8e7c6e9fc06b2b2ba8b57651
