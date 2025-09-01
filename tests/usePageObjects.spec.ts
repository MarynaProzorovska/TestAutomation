import { expect, test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Navigate to form page @smoke @regression", async ({ page }) => {  // you can add tags exatly to the test name 
  const pm = new PageManager(page) // creating new instance of this page object inside of the test
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("Parametrized methods", async ({ page }) => {
const pm = new PageManager(page)
const randomFullName = faker.person.fullName()
const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` // використали реплейс, бо в імені є пропуск, а в мейлі його не можна. пробіл - на без пробілу

await pm.navigateTo().formLayoutsPage();
await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, "Option 1");
await page.screenshot({path: 'screenshot/formLayoutsPage.png'}) // зробить скріншот після попереднього степу
const buffer = await page.screenshot() // отримуємо скріншот в змінну
console.log(buffer.toString('base64')) // виводимо цю змінну і можемо відправити цей скрін у вигляді коду
await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
await page.locator('nb-card', { hasText: "Inline form",}).screenshot({path: 'screenshot/Inline.png' }) // зробить скріншот якоїсь area
  await pm.navigateTo().datePickerPage()
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(20)
  await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(5, 1)
});

test.only("testing with argos CI", async ({ page }) => {  // you can add tags exatly to the test name 
  const pm = new PageManager(page) // creating new instance of this page object inside of the test
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().datePickerPage();
});


