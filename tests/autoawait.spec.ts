import {expect, test} from '@playwright/test';


test.beforeEach(async({page}, testInfo) => {
await page.goto(process.env.URL) // ще один приклад, створили файл, додали туди урлу і використали тут. але нам треба для цього бібліотека .env
await page.getByText('Button Triggering AJAX Request').click();
testInfo.setTimeout(testInfo.timeout + 2000)  // Додасть 2 секунди до кожного тесту

})

test("Auto waiting", async({page}) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()'

    // const text = await successButton.textContent()

    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

   await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})
})

test.skip("Alternative waits", async({page}) => {
 const successButton = page.locator('.bg-success')

//___ wait for element
await page.waitForSelector('.bg-success')

// wait for particular response
await page.waitForResponse('http://www.uitestingplayground.com/ajax')

//wait for network calls to be completed ('NOT RECOMMENDED') - 'networkidle' означає, що система заспокоїлась і не відбуваються нові http запити
await page.waitForLoadState('networkidle')

 const text = await successButton.allTextContents()
 expect(text).toContain('Data loaded with AJAX get request.')

})

test.skip("Timeouts", async({page}) => {
    test.setTimeout(10000)  // можна також вказати в самому тесті таймаут

    test.slow() //increased the test in 3 times

    const successButton = page.locator('.bg-success')

 await successButton.click({timeout: 60000})  // можна додавати таймаути прямо в екшені, як тут {timeout: 60000}

})
// таймаут можна засетапити в файлі plawrigt.config.ts 
//   timeout: 10000 - single test timeout
// globalTimeout - global test timeout (for the whole test)
// можна додати actionTimeout i navigationTimeout в тому ж файлі, але у блоці use{}