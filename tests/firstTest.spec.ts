import {expect, test} from '@playwright/test';


test.beforeEach(async({page}) => {
await page.goto('/')
await page.getByText('Forms').click();
await page.getByText('Form Layouts').click();
})

// test('the first test', async ({page}) => {
// await page.getByText('Forms').click();
// await page.getByText('Form Layouts').click();
// } )

test('Locator syntax rules', async ({page}) => {
    //by Tag name
    await page.locator('input').first().click()

    //by ID
    page.locator('#inoutEmail');

    //by class value
    page.locator('.shape=rectangle')

    //by attribute
    page.locator('[placeholder="Email"]')

    //by Class value (full)
    page.locator('[class=input-full-width size-medium status-basic shape=rectangle nb-transitions')

    //combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    //by Xpath - not recommended
    page.locator('//*[id="inputEmail1"]')
})

test("User facing locators", async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click();
    await page.getByRole('button', {name: "Sign in"}).first().click();

    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    // await page.getByTitle("IotDashboard").click()

    await page.getByTestId('SignIn').click()
})

test("Child elements", async({page}) => {
await page.locator('nb-card nb-radio :text-is("Option 1")').click()
await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

//search by index (nth) starts from 0, so 3 -> 4th element. Better to avoid this method
await page.locator('nb-card').nth(3).getByRole('button').ckick()
})

test('Parent elements', async({page}) => {
    await page.locator("nb-card", {hasText: 'Using the Grid'}).getByRole('textbox', {name: "Email"}).click()
    await page.locator("nb-card", {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

   //filter фільтруючи по умовам відбирає дані і шукає по ним, і ще можна фільтрувати по багатьом значенням
    await page.locator("nb-card").filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator("nb-card").filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator("nb-card").filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    //('..') <- піднімається на рівень вище
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Reusing locators', async({page}) => {
const basicForm = page.locator("nb-card").filter({hasText: "Basic form"});
const emailField = basicForm.getByRole('textbox', {name: "Email"});

await emailField.fill('test@test.com');
await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123');
await basicForm.locator('nb-checkbox').click()
await basicForm.getByRole('button').click();

await expect(emailField).toHaveValue('test@test.com')
})

test('Extracting values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
   const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
   expect(allRadioButtonsLabels).toContain("Option 1")

   //input value 
   const emailField = basicForm.getByRole('textbox', {name: "Email"})
   await emailField.fill("test@test.com")
   const emailValue = await emailField.inputValue()
   expect(emailValue).toEqual("test@test.com")

   const placeholderValue = await emailField.getAttribute('placeholder')
   expect(placeholderValue).toEqual("Email")
})

test('Assertions', async({page}) => {
     
    //General assertions 
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"})

    const value = 5;
    expect(value).toEqual(5);

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //Locator assertion - чекає трохи більше ніж дженерал
    await expect(basicFormButton).toHaveText('Submit')

    //Soft assertion - soft дає тесту пройти далі, навіть якщо expect зафейлився
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})


