import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_URL ?? "http://localhost:5176";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /enter dashboard/i }).click();
await page.waitForURL("**/dashboard");
await page.getByText(/High-risk solar event detected|Space Object Dashboard/).first().waitFor();

await page.goto(`${baseUrl}/solar-events`, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: "Solar Events" }).waitFor();
await page.getByText("Event timeline").waitFor();
await page.getByText("Estimated satellite effect").first().waitFor();

const eventCount = await page.locator("ol li").count();
if (eventCount < 1) {
  throw new Error("Expected at least one DONKI event in the timeline.");
}

console.log(
  JSON.stringify(
    {
      url: page.url(),
      eventCount,
      hasHighRiskSection: await page.getByText("High-risk events detected").isVisible(),
    },
    null,
    2,
  ),
);

await browser.close();
