import {test, expect} from '@playwright/test'
import { LoginPage } from '../page-objects/login-page';

let loginPage;

test.describe('Login scenarios',{tag:'@login'},()=>{
    test.beforeAll(async({page})=>{
        loginPage = new LoginPage(page);
    })
    test.beforeEach(async ({page}) =>{
        await loginPage.goto();
    })

    test('successful login',async ({page}) =>{
        loginPage.login('standard_user','secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    })

    test('login using creds of a locked out user',async ({page})=>{
        loginPage.login('locked_out_user','secret_sauce');
        await expect(page.locator('[data-test="error"]'))
            .toHaveText("Epic sadface: Sorry, this user has been locked out.");
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    })

    test('login using incorrect creds',async ({page})=>{
        loginPage.login('incorrect_username','secret_sauce');
        await expect(page.locator('[data-test="error"]'))
            .toHaveText("Epic sadface: Username and password do not match any user in this service");
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    })

})








