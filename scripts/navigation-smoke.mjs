import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_URL ?? "http://localhost:5177";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /enter dashboard/i }).click();
await page.waitForURL("**/dashboard");

await page.getByPlaceholder("Search pages...").fill("satellite");
await page.getByRole("button", { name: /My Satellite/i }).click();
await page.waitForURL("**/my-satellite");
await page.getByRole("heading", { name: "My Satellite" }).waitFor();

await page.getByPlaceholder("Search pages...").fill("solar");
await page.getByRole("button", { name: /Solar Events/i }).click();
await page.waitForURL("**/solar-events");
await page.getByRole("heading", { name: "Solar Events" }).waitFor();

console.log(JSON.stringify({ url: page.url(), ok: true }, null, 2));

await browser.close();
