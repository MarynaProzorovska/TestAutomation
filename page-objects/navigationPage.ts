import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{
  // readonly page: Page; - видалили це, тому що додали хелпер і тепер в нас супер пейдж

  // readonly formLayoutsMenuItem: Locator; // в плейрайті краще виносити локатори з методів, тому ми тут винесли їх назви і надали їм тип локатор, якщо потім хочемо винести їх окремо в конструктор, як нижче закоментовано
  // readonly datepickerMenuItem: Locator;
  // readonly smartTableMenuItem: Locator;
  // readonly toasterMenuItem: Locator;
  // readonly tooltipMenuItem: Locator;

  constructor(page: Page) {  //page: Page - переймаємо тип Page через ":"
         super(page) //додали хелпер, тому маємо тепер так використовувати пейдж
    // this.formLayoutsMenuItem = page.getByText("Form Layouts"); // а тут ми прописали їм шлях до циз локаторів
    // this.datepickerMenuItem = page.getByText("Datepicker");
    // this.smartTableMenuItem = page.getByText("Smart Table");
    // this.toasterMenuItem = page.getByText("Toastr");
    // this.tooltipMenuItem = page.getByText("Tooltip");
  }
  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
    await this.waitForNumberOfSeconds(2)
  }

  async datePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Datepicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & data");
    await this.page.getByText("Smart Table").click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click()
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  private async selectGroupMenuItem(groupItemTitle: string) {
    const groupMenuTitle = this.page.getByTitle(groupItemTitle);
    const expandedState = await groupMenuTitle.getAttribute("aria-expanded");
    if (expandedState == "false") {
      await groupMenuTitle.click();
    }
  }
}
