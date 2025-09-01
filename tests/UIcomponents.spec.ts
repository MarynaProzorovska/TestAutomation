import {expect, test} from '@playwright/test';
import { serialize } from 'v8';

test.beforeEach(async({page}) => {
await page.goto('/')

})

// test.describe.configure({mode: 'parallel'}) - паралельний перебіг тестів
// test.describe.configure({mode: 'serial'}) - тести будуть бігти один за одним

test.describe("Locator syntacs rules @block", () => { // or you can add tags to describe
    //можна додати .parallel до describe і будуть тести по дескрайбу бігти паралельно
test.describe.configure({retries: 0}) // буде ретраїть два рази

    test.beforeEach( async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('Input fields', async ({page}, testInfo) => {
      if(testInfo.retry) {  // можна змінювати дані після для ретраю
    //do something
}

        test.slow()
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com') // заповнити поле
        await usingTheGridEmailInput.clear() // прибере текст
        await usingTheGridEmailInput.pressSequentially('test@test.com',) //{delay: 500}) //simulating slower typing of text like from a keyboard, але можна без delay його використовувати, тодф буде швидше
        
        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test@test.com')

        //locator assertion

        await expect(usingTheGridEmailInput).toHaveValue('test@test.com')

    })

    test.only('Radio buttons', async({page}) => {
    const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
 
    // await usingTheGridForm.getByLabel('Option 1').check({force: true}) // check() використовується, щоб відмітити радіо кнопки або чекбокси. але в цьому проекті вони hidden, force: true — означає: "виконати дію навіть якщо елемент не є видимим або неактивним".
    await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
    const radioStatus =  await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked() // generic assertion
    await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels: 250}) // порівнюємо юайку зі скріншотом який зробили вперше. тут до 250 pxls похибка, тому він пройде
    // expect(radioStatus).toBeTruthy();
    // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked() // locator assertion

    // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
    // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
    // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
})
})

test('Checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', {name: "Hide on click"}).click({force: true}) // click просто клікає, check() - вибирає, uncheck() - робить не вибраним

    const allBoxesTrue = page.getByRole('checkbox')
    for(const box of await allBoxesTrue.all()){ // створємо array, щоб пройтись по всім чекбоксам. .all - створює array i .all - promise, тому нам треба await
     await box.check({force: true})              // чЕкаємо всі чекбокси
     expect(await box.isChecked()).toBeTruthy()
    }

    const allBoxesFalse = page.getByRole('checkbox')
    for(const box of await allBoxesFalse.all()){ 
     await box.uncheck({force: true})              
     expect(await box.isChecked()).toBeFalsy()
    }
})

test("Lists and dropdowns", async({page}) => {
    const dropMenuButton = page.locator('ngx-header nb-select')
    await dropMenuButton.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has a LI tag

    //const optionList = page.getByRole('list').locator('nb-option') або нижній варіант
    const optionList = page.locator('nb-option-list nb-option') 
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) //перевіряємо чи всі значення є в листі
    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)",
    }

    await dropMenuButton.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if(color != "Corporate")
         await dropMenuButton.click()

    }
})

test("Tooltips", async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    // page.getByRole('tooltip') //працюватиме, тільки якщо в коді вказаний як тултіп, а тут не вказано так, тому: 

    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test("Dialog boxes", async({page}) => {
    await page.getByText('Tables & data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click() //в цьому випадку вспливаючий меседж (browser dialog) закриється і ми не встигнемо нічого клікнути, тому вище ми створюємо listener
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('Web tables', async({page}) => {
     await page.getByText('Tables & data').click();
    await page.getByText('Smart Table').click();

    //1 get  the row by any text in the row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'}) // але мейл пізніше стане з HTML -> input value, тому далі ми будемо ще раз шукати поле в строці
    await targetRow.locator('.nb-edit').click() //натискаємо на олівець який в межах нашої строки
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()


    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowByID = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')}) // page.getByRole('row', {name: '11'}) - знайде всі рядки, де є 11; .filter({has: page.locator('td') - отримаємо всі колонки; .nth(1).getByText('11')}) - беремо індекс 1 - першу колонку - і фільтруємо в ній по значенню 11
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table

    const ages =['20', '30', '40', '200']
    for(let age of ages) { 
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')          //дасть нам всі строки після пошуку

        for(let row of await ageRows.all()) {             //.all створить нам array значень
            const cellValue = await row.locator('td').last().textContent() // дасть нам останню колонку із знайденими значеннями

            if(age == "200") {
              expect( await page.getByRole("table").textContent()).toContain("No data found")
            } else {
                  await expect(cellValue).toEqual(age)
            }
            

        } 
    }
})

test("Datepicker 1", async({page}) => { 
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder("Form Picker")
    await calendarInputField.click()
    await page.locator('[class = "day-cell ng-star-inserted"]').getByText('1', {exact: true}).click() //потрібно додати {exact: true} щоб не знаходило числа, що містить цифру 1, а тільки конкретно 1
    await expect(calendarInputField).toHaveValue('Jul 1, 2025')
})

test("Datepicker 2", async({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder("Form Picker")
    await calendarInputField.click()

    const date = new Date()

    date.setDate(date.getDate() + 14) // отримаємо майбутній день
    const expectedDay = date.getDate().toString() // отримуємо майбутній день і робимо його стрінгою
    const expectedMonthShort = date.toLocaleString('En-US', {month: "short"})
    const expectedMonthFull = date.toLocaleString('En-US', {month: "long"})

    const expectedYear = date.getFullYear()
    const dateToAseert = `${expectedMonthShort} ${expectedDay}, ${expectedYear}` // проте воно шукає тільки в рамках одного місяця, якщо +1 день це наступний місяць - тест впаде. тому додаємо наступне

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() // отримує тест, який відображається в датапікері
    const expectedMonthAdnYear = ` ${expectedMonthFull} ${expectedYear} `                // формуємо очікувані дані
    while(!calendarMonthAndYear.includes(expectedMonthAdnYear)) {                        // перевіряємо чи очікувана дата співпадає з реальною
       await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()  // якщо не співпадає, клікаємо вправо
       calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()          // і ще раз отримуємо текст з датою
    }

    await page.locator('[class = "day-cell ng-star-inserted"]').getByText(expectedDay, {exact: true}).click()   
    await expect(calendarInputField).toHaveValue(dateToAseert)

}) 

test("Sliders", async({page}) => {
    //Update attribute 
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute("cx", "232.630")
        node.setAttribute("cy", "232.630")
       })

        await tempGauge.click() // потрібно клікнути, інакше просто повзунок змінить положення, а значення не зміниться

    //mouse movement 
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() // перевірить чи наш бокс є візібил в браузері
    const box = await tempBox.boundingBox() // boundingBox це межіквадрату нашої areа, де ми щось автоматизуємо. Воно виміряється х(-) і у(|) по довжині і висоті і ми можемо клікати по різним значенням вказуючи х і у
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2 // там ми будемо стояти повередині boundingBox
    await page.mouse.move(x, y) 
    await page.mouse.down() // simulates the click on the left button on mouse
    await page.mouse.move(x+100, y) //миша совається вправо
    await page.mouse.move(x+100, y+100) // миша їде вниз з тієї точки, куди ми пересунули перед цим
    await page.mouse.up() // відпускає кнопку миші
    await expect(tempBox).toContainText("30")

})