import {test, expect} from '@playwright/test'

test.describe('Login scenarios',{tag:'@login'},()=>{
    test.beforeEach(async ({page}) =>{
        await page.goto("https://www.saucedemo.com/");
    })

    test('successful login',async ({page}) =>{
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test('login using creds of a locked out user',async ({page})=>{
        await page.locator('#user-name').fill('locked_out_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        const errorMesage = page.locator('[data-test="error"]');
        await expect(errorMesage).toHaveText("Epic sadface: Sorry, this user has been locked out.");
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    })

    test('login using incorrect creds',async ({page})=>{
        await page.locator('#user-name').fill('incorrect_username');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        const errorMesage = await page.locator('[data-test="error"]');
        await expect(errorMesage).toHaveText("Epic sadface: Username and password do not match any user in this service");
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    })

})








