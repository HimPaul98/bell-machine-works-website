#!/usr/bin/env node
// scripts/scroll-check.mjs
// Drives the system Chrome via puppeteer-core (no bundled Chromium) to
// screenshot a page at given scroll positions and report console/page
// errors and whether the scroll engine booted. Usage:
//   node scripts/scroll-check.mjs <url> <outDir> [scrollY...]
import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";

const [, , url, outDir, ...scrollArgs] = process.argv;
if (!url || !outDir) {
  console.error("Usage: node scripts/scroll-check.mjs <url> <outDir> [scrollY...]");
  process.exit(1);
}

const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();

const errors = [];
page.on("pageerror", (err) => errors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});

await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });

const hasScrollEngine = await page.evaluate(() => typeof window.__scrollEngine !== "undefined");
console.log("scrollEngine present:", hasScrollEngine);

const positions = scrollArgs.length ? scrollArgs.map(Number) : [0];
for (const y of positions) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await new Promise((resolve) => setTimeout(resolve, 400));
  await page.screenshot({ path: `${outDir}/scroll-${y}.png` });
}

console.log(`Captured ${positions.length} screenshot(s) in ${outDir}`);
await browser.close();

if (errors.length) {
  console.error("Console/page errors:", errors);
  process.exit(1);
}
