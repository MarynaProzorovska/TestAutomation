import {expect, test} from '@playwright/test';


test.beforeEach(async({page}) => {
await page.goto('/');
await page.getByText('Forms').click();
await page.getByText('Form Layouts').click();

})

