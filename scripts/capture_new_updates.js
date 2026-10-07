const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\deeza\\.gemini\\antigravity\\brain\\7fb3c67a-3722-4d88-8781-469d5064e82b';

async function run() {
  const browser = await chromium.launch();

  console.log('Testing 1440px desktop...');
  const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Clear session storage to show preloader
  await page1440.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page1440.evaluate(() => sessionStorage.clear());
  await page1440.reload({ waitUntil: 'domcontentloaded' });
  
  // 1. Capture Preloader in full glory (letters visible, progress ~60-70%)
  await page1440.waitForTimeout(1500);
  await page1440.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_update_preloader_thiagovsc.png'),
    fullPage: false,
  });
  console.log('Preloader screenshot captured');

  // 2. Wait for preloader to finish, click enter or let timeout exit
  try {
    const btn = page1440.locator('text=ENTRAR DIRECTO').first();
    await btn.waitFor({ state: 'visible', timeout: 3000 });
    await btn.click();
  } catch (e) {
    console.log('Timeout fallback proceeding');
  }

  await page1440.waitForTimeout(2000);
  await page1440.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_update_hero_new_video.png'),
    fullPage: false,
  });
  console.log('Hero screenshot captured');

  // 3. Scroll to TV Online
  await page1440.evaluate(() => {
    const el = document.getElementById('tv');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page1440.waitForTimeout(1800);
  await page1440.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_update_tv_youtube.png'),
    fullPage: false,
  });
  console.log('TV Online screenshot captured');

  // 4. Mobile 390
  console.log('Testing 390px mobile...');
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  try {
    const btnMobile = pageMobile.locator('text=ENTRAR DIRECTO').first();
    await btnMobile.waitFor({ state: 'visible', timeout: 3500 });
    await btnMobile.click();
  } catch (e) {}

  await pageMobile.waitForTimeout(2000);
  await pageMobile.screenshot({
    path: path.join(ARTIFACTS_DIR, 'screenshot_update_mobile_hero.png'),
    fullPage: false,
  });
  console.log('Mobile Hero screenshot captured');

  await browser.close();
  console.log('All updates captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
