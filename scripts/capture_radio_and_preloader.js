const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\deeza\\.gemini\\antigravity\\brain\\7fb3c67a-3722-4d88-8781-469d5064e82b';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Capturing new preloader...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => sessionStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // 1. Capture Preloader with letters, equalizer, and progress
  await page.waitForTimeout(1400);
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_new_preloader_modern.png'),
    fullPage: false,
  });
  console.log('New Preloader captured!');

  // Wait for preloader to exit
  try {
    const btn = page.locator('text=ENTRAR DIRECTO').first();
    await btn.waitFor({ state: 'visible', timeout: 3000 });
    await btn.click();
  } catch (e) {
    console.log('Timeout fallback proceeding');
  }
  await page.waitForTimeout(2000);

  // 2. Open Radio Modal and capture
  console.log('Opening Radio modal...');
  const radioBtn = page.locator('text=RADIO EN VIVO').first();
  await radioBtn.click();
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_new_radio_modal_pink.png'),
    fullPage: false,
  });
  console.log('Radio modal in pink captured!');

  await browser.close();
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
