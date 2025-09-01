import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options'; 

require('dotenv').config(); 

export default defineConfig<TestOptions>({
  use: {
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/', 


  },
  projects: [
    {
      name: 'chromium', 
    }
  ],
});


// файл використовується, якщо нам треба запустити якісь тести, напр на проді і щоб полешгити, створили цей файл.
// щоб його запустити: npx playwright test --config=playwrightProd.config.ts