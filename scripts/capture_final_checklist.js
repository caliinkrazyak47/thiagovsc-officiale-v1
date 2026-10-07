const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const artifactDir = 'C:\\Users\\deeza\\.gemini\\antigravity\\brain\\7fb3c67a-3722-4d88-8781-469d5064e82b';

  console.log('Testing 1440px desktop...');
  const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // First visit to capture preloader liquid effect
  await page1440.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page1440.waitForTimeout(600);
  await page1440.screenshot({
    path: path.join(artifactDir, 'screenshot_final_preloader_liquid.png'),
    fullPage: false,
  });

  // Wait for preloader ready and click enter
  try {
    const btn = page1440.locator('text=Entrar sin sonido').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await page1440.waitForTimeout(1600);
  } catch (e) {
    console.log('Preloader auto-entered or timed out');
    await page1440.waitForTimeout(2500);
  }

  // 1. Hero at 1440px
  await page1440.screenshot({
    path: path.join(artifactDir, 'screenshot_final_1440_hero.png'),
    fullPage: false,
  });

  // 2. Full Page at 1440px
  await page1440.screenshot({
    path: path.join(artifactDir, 'screenshot_final_1440_full.png'),
    fullPage: true,
  });

  // 3. Test Navbar Menú dropdown
  const menuBtn = page1440.locator('button:has-text("Menú")').first();
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    await page1440.waitForTimeout(400);
    await page1440.screenshot({
      path: path.join(artifactDir, 'screenshot_final_menu_open.png'),
      fullPage: false,
    });
    // Test Escape key closes menu
    await page1440.keyboard.press('Escape');
    await page1440.waitForTimeout(400);
  }

  // 4. Section specific screenshots
  const tvEl = page1440.locator('#tv');
  if (await tvEl.count() > 0) {
    await tvEl.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(600);
    await tvEl.screenshot({
      path: path.join(artifactDir, 'screenshot_final_tv.png'),
    });
  }

  const ttEl = page1440.locator('#tiktok');
  if (await ttEl.count() > 0) {
    await ttEl.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(600);
    await ttEl.screenshot({
      path: path.join(artifactDir, 'screenshot_final_tiktok.png'),
    });
  }

  const infEl = page1440.locator('#zona-influencer');
  if (await infEl.count() > 0) {
    await infEl.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(600);
    await infEl.screenshot({
      path: path.join(artifactDir, 'screenshot_final_influencer.png'),
    });
  }

  const evEl = page1440.locator('#events');
  if (await evEl.count() > 0) {
    await evEl.scrollIntoViewIfNeeded();
    await page1440.waitForTimeout(600);
    await evEl.screenshot({
      path: path.join(artifactDir, 'screenshot_final_events.png'),
    });
  }

  await page1440.close();

  // 5. Test 390px Mobile
  console.log('Testing 390px mobile...');
  const page390 = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  await page390.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  try {
    const btn = page390.locator('text=Entrar sin sonido').first();
    await btn.waitFor({ state: 'visible', timeout: 5000 });
    await btn.click();
    await page390.waitForTimeout(1600);
  } catch (e) {
    await page390.waitForTimeout(2500);
  }

  await page390.screenshot({
    path: path.join(artifactDir, 'screenshot_final_390_hero.png'),
    fullPage: false,
  });

  await page390.screenshot({
    path: path.join(artifactDir, 'screenshot_final_390_full.png'),
    fullPage: true,
  });

  await page390.close();

  // 6. Test 1280px & 1920px viewports
  console.log('Testing 1280px & 1920px...');
  const page1280 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page1280.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  try {
    const btn = page1280.locator('text=Entrar sin sonido').first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
      await page1280.waitForTimeout(1500);
    }
  } catch (e) {}
  await page1280.screenshot({
    path: path.join(artifactDir, 'screenshot_final_1280.png'),
    fullPage: false,
  });
  await page1280.close();

  const page1920 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page1920.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  try {
    const btn = page1920.locator('text=Entrar sin sonido').first();
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
      await page1920.waitForTimeout(1500);
    }
  } catch (e) {}
  await page1920.screenshot({
    path: path.join(artifactDir, 'screenshot_final_1920.png'),
    fullPage: false,
  });
  await page1920.close();

  await browser.close();
  console.log('All checklist screenshots captured successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
