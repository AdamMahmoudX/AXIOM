const { chromium } = require('playwright');

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to the deployed site
  await page.goto('https://h4lzagwbomk2.space.minimax.io', { waitUntil: 'networkidle' });
  
  // Wait for page load
  await page.waitForTimeout(2000);
  
  // Check if Developer Mode button exists
  const devButton = await page.$('button[title*="Architecture Explorer"]');
  console.log('Developer Mode Button:', devButton ? 'FOUND' : 'NOT FOUND');
  
  // Check if there's a floating button
  const buttons = await page.$$('button');
  console.log('Total buttons found:', buttons.length);
  
  // Look for any element with data attributes
  const elementsWithData = await page.$$('[data-section-id]');
  console.log('Elements with data-section-id:', elementsWithData.length);
  
  // Check page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get page HTML snippet
  const bodyHtml = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  console.log('Body HTML snippet:', bodyHtml);
  
  await browser.close();
}

verify().catch(console.error);
