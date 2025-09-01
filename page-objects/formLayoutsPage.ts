import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {
  // private readonly page: Page;

  constructor(page: Page) {
    super(page);
  }

  async submitUsingTheGridFormWithCredentialsAndSelectOption( email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator("nb-card", { hasText: "Using the Grid",});
    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm.getByRole("textbox", { name: "Password" }).fill(password);
    await usingTheGridForm.getByRole("radio", { name: optionText }).check({ force: true });
    await usingTheGridForm.getByRole("button").click();
  }

  // /**
  //  * This method is used for submitting Inline form 
  //  * @param name - should be name and last name
  //  * @param email - should be email
  //  * @param rememberMe - should be true or false for saving session
  //  */
  async submitInLineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
       const inlineForm = this.page.locator("nb-card", { hasText: "Inline form",});
    await inlineForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await inlineForm.getByRole("textbox", { name: "Email" }).fill(email);
    if(rememberMe) {
await inlineForm.getByRole("checkbox").check({force: true})
    await inlineForm.getByRole("button").click();

    }
  }
}
