<<<<<<< HEAD
import { test, expect, Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import urls from '../fixture/url.json'
import loginData from '../fixture/Data.json'

dotenv.config({ override: true })


// 1: Data Driven by JSON

test.describe('Login - Data Driven by JSON', () => {

    for (const user of loginData.users) {
        test(`should log in successfully — ${user.description}`, async ({ page }) => {
            await navigateToLoginPage(page)
            await fillLoginForm(page, user.username, user.password)
            await submitLoginForm(page)
            await verifySuccessfulLogin(page)
        })
    }

})

// 2: Data Driven by ENV

test.describe('Login - Data Driven by ENV', () => {

    test('should log in successfully using ENV credentials', async ({ page }) => {
        await navigateToLoginPage(page)
        await fillLoginForm(page, process.env.USERNAME!, process.env.PASSWORD!)
        await submitLoginForm(page)
        await verifySuccessfulLogin(page)
    })

})


//3: Functions

async function navigateToLoginPage(page: Page) {
    await page.goto(`${urls.baseUrl}${urls.loginUrl}`)
}

async function fillLoginForm(page: Page, username: string, password: string) {
    await page.getByRole('textbox', { name: 'Username' }).fill(username)
    await page.getByRole('textbox', { name: 'Password' }).fill(password)
}

async function submitLoginForm(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click()
}


async function verifySuccessfulLogin(page: Page) {
    await expect(page.getByRole('heading', { name: 'Logged In Successfully' })).toBeVisible()
=======
import { test, expect, Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import urls from '../fixture/url.json'
import loginData from '../fixture/Data.json'

dotenv.config({ override: true })


// 1: Data Driven by JSON

test.describe('Login - Data Driven by JSON', () => {

    for (const user of loginData.users) {
        test(`should log in successfully — ${user.description}`, async ({ page }) => {
            await navigateToLoginPage(page)
            await fillLoginForm(page, user.username, user.password)
            await submitLoginForm(page)
            await verifySuccessfulLogin(page)
        })
    }

})

// 2: Data Driven by ENV

test.describe('Login - Data Driven by ENV', () => {

    test('should log in successfully using ENV credentials', async ({ page }) => {
        await navigateToLoginPage(page)
        await fillLoginForm(page, process.env.USERNAME!, process.env.PASSWORD!)
        await submitLoginForm(page)
        await verifySuccessfulLogin(page)
    })

})


//3: Functions

async function navigateToLoginPage(page: Page) {
    await page.goto(`${urls.baseUrl}${urls.loginUrl}`)
}

async function fillLoginForm(page: Page, username: string, password: string) {
    await page.getByRole('textbox', { name: 'Username' }).fill(username)
    await page.getByRole('textbox', { name: 'Password' }).fill(password)
}

async function submitLoginForm(page: Page) {
    await page.getByRole('button', { name: 'Submit' }).click()
}


async function verifySuccessfulLogin(page: Page) {
    await expect(page.getByRole('heading', { name: 'Logged In Successfully' })).toBeVisible()
>>>>>>> 3336d42670e4206a8e7c6e9fc06b2b2ba8b57651
}