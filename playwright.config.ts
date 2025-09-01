import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options'; // додали новий імпорт

require('dotenv').config(); // включаємо нашу бібліотеку .env

export default defineConfig<TestOptions>({ //додали сюди імпортований тип
  timeout: 40000,
  testDir: './tests',

  expect:{
    timeout: 2000, // - можна змінити час експекту
toMatchSnapshot: {maxDiffPixels: 50}, // при тестуванні зі скріншотами, можна вказати, до скількох пікселів нам ок отримувати правильне зачення
   }, 

  retries: 1,
  reporter: 
  [['json', {outputFile: 'testResult/jsonReport.json'}], // може бути 'html', 'list', 'json', [['json', {outputFile: 'testResult/jsonReport.json'}]] - це щоб файл ще в папці зберегти
  ['junit', {outputFile: 'testResult/junitReport.xml'}], // теж популярний репорт
  ['html']],

  use: {
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/', // після імпорту нового типу ми додали нове значення і нову урлу для тестів
  
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'     //ще один варіант додавання різних енвів
    //        : process.env.STAGING == '1' ? 'http://localhost:4202/'
    //        : 'http://localhost:4200/',

    trace: 'on-first-retry',
    // video: "on" // включаємо запис відео
  // video: {
  //   mode: "on",
  //   size: {width: 1920, height: 1080} // або включаємо і задаємо розмір відео, якщо нам потрібно
  // }
  },
  projects: [

    // ми додали один енвайромент, задля яких ми можемо задавати іншу урлу. Викликати так само, як і нижчі, просто додати дев або стейдж в запит на тести
  // {
  //     name: 'dev',
  //     use: { ...devices['Desktop Chrome'], 
  //     baseURL: 'http://localhost:4201/',

  //     },
  //   },

    {
      name: 'chromium',
      // use: { ...devices['Desktop Chrome'] }, - це можна не писати, бо хром дефолтний
      // fullyParallel: true - якщо хочем, шоб бігти тести тільки тут паралельно  
    },

    {
      name: 'firefox',
      use: 
      { 
        browserName: 'firefox'
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
use: {
  ...devices
}['iPhone 13 Pro']
    }
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});
