import { chromium } from "playwright";

const baseUrl = process.env.GLOBE_SMOKE_URL ?? "http://localhost:5174";
const screenshotPath = "/tmp/space-object-globe.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /enter dashboard/i }).click();
await page.waitForURL("**/dashboard");
await page.goto(`${baseUrl}/globe`, { waitUntil: "networkidle" });
await page.locator("canvas").waitFor({ state: "visible" });
await page.waitForTimeout(1200);

const canvasSignal = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  const gl =
    canvas instanceof HTMLCanvasElement
      ? canvas.getContext("webgl2") ?? canvas.getContext("webgl")
      : null;

  if (!canvas || !gl) {
    return { nonBlankSamples: 0, width: 0, height: 0 };
  }

  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  const samples = [
    [Math.floor(width * 0.5), Math.floor(height * 0.5)],
    [Math.floor(width * 0.42), Math.floor(height * 0.44)],
    [Math.floor(width * 0.58), Math.floor(height * 0.48)],
    [Math.floor(width * 0.48), Math.floor(height * 0.62)],
  ];

  let nonBlankSamples = 0;
  for (const [x, y] of samples) {
    const pixel = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    if (pixel[0] + pixel[1] + pixel[2] > 10) {
      nonBlankSamples += 1;
    }
  }

  return { nonBlankSamples, width, height };
});

if (canvasSignal.nonBlankSamples < 1) {
  throw new Error(`Globe canvas appears blank: ${JSON.stringify(canvasSignal)}`);
}

await page.screenshot({ fullPage: true, path: screenshotPath });
const firstSatellite = page
  .getByRole("button", { name: /International Space Station|Aurora-17 Relay/i })
  .first();
await firstSatellite.click();
await page.waitForURL(/\/satellites\/.+/);
await page.getByText("Latest images").waitFor();

console.log(
  JSON.stringify(
    {
      canvasSignal,
      screenshotPath,
      detailUrl: page.url(),
    },
    null,
    2,
  ),
);

await browser.close();
