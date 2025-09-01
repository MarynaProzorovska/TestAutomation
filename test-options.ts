import {test as base} from '@playwright/test'
import { PageManager } from "../pw-practice-app-master/page-objects/pageManager";


export type TestOptions = {
    globalsQaURL: string 
    formLayoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions> ({
    globalsQaURL: ["", {option: true}],

    formLayoutsPage: async ({page}, use) => {
      await page.goto('/')    
     await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
    await use('')
    }, //{auto: true}], // цим налаштуванням кажемо, що ця фікстура має ранитись на самому початку, навіть до before.each

    pageManager: async ({page, formLayoutsPage}, use) => { // додали сюди formLayoutsPage і тепер вони залежні між собою і pageManager буде трігерить formLayoutsPage
        const pm = new PageManager(page)
        await use(pm)
    }
})