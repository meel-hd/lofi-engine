import { test, expect } from "@playwright/test";

test("has context menu", async ({ page }) => {
  await page.goto("http://localhost:1420");
  const defaultPrevented = await page.evaluate(() => {
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 2,
    });
    document.dispatchEvent(event);
    return event.defaultPrevented;
  });

  expect(defaultPrevented).toBe(false);
});
