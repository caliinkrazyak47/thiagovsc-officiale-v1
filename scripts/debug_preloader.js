const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const h1 = document.querySelector('h1[aria-label="THIAGOVSC"]');
    if (!h1) return 'H1 NOT FOUND';
    const rect = h1.getBoundingClientRect();
    const style = window.getComputedStyle(h1);
    const spans = Array.from(h1.querySelectorAll('span')).map(s => ({
      text: s.innerText,
      rect: s.getBoundingClientRect(),
      transform: window.getComputedStyle(s).transform,
      opacity: window.getComputedStyle(s).opacity
    }));
    return {
      text: h1.innerText,
      rect,
      color: style.color,
      visibility: style.visibility,
      opacity: style.opacity,
      spans
    };
  });
  console.log('DEBUG:', JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(console.error);
