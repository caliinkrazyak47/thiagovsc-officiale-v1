const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const artifactDir = 'C:\\Users\\deeza\\.gemini\\antigravity\\brain\\7fb3c67a-3722-4d88-8781-469d5064e82b';

  // 1440px desktop
  const page1440 = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });
  await page1440.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // Skip preloader if shown
  try {
    const btn = page1440.locator('text=Entrar sin sonido').first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
      await page1440.waitForTimeout(1500);
    }
  } catch (e) {}

  await page1440.waitForTimeout(1000);
  await page1440.screenshot({
    path: path.join(artifactDir, 'screenshot_baseline_1440.png'),
    fullPage: false
  });
  await page1440.screenshot({
    path: path.join(artifactDir, 'screenshot_baseline_1440_full.png'),
    fullPage: true
  });
  await page1440.close();

  // 390px mobile
  const page390 = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true
  });
  await page390.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  try {
    const btn = page390.locator('text=Entrar sin sonido').first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
      await page390.waitForTimeout(1500);
    }
  } catch (e) {}

  await page390.waitForTimeout(1000);
  await page390.screenshot({
    path: path.join(artifactDir, 'screenshot_baseline_390.png'),
    fullPage: false
  });
  await page390.screenshot({
    path: path.join(artifactDir, 'screenshot_baseline_390_full.png'),
    fullPage: true
  });
  await page390.close();

  await browser.close();
  console.log('Baseline screenshots captured successfully.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
