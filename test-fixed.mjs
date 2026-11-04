import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  // Navigate to the deployed site
  console.log('\n=== LOADING PAGE ===');
  await page.goto('https://h4lzagwbomk2.space.minimax.io', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Remove any overlay elements that block clicks
  await page.evaluate(() => {
    const overlay = document.getElementById('minimax-floating-ball');
    if (overlay) overlay.remove();
    const chatBall = document.querySelector('.minimax-floating-ball, [class*="floating-ball"]');
    if (chatBall) chatBall.remove();
  });
  
  console.log('\n=== TEST 1: Developer Mode Toggle ===');
  // Use force click to bypass any overlays
  const devButton = await page.$('button[title*="Architecture Explorer"]');
  if (devButton) {
    await devButton.click({ force: true });
    await page.waitForTimeout(500);
    console.log('Developer Mode activated!');
    
    // Check if status bar appears
    const statusBar = await page.$('.fixed.bottom-6.left-6');
    console.log('Status Bar:', statusBar ? 'VISIBLE' : 'NOT VISIBLE');
    
    // Check if inspector panel is present
    const inspectorPanel = await page.$('.arch-panel');
    console.log('Inspector Panel:', inspectorPanel ? 'FOUND' : 'NOT FOUND');
  } else {
    console.log('ERROR: Developer Mode button not found!');
  }
  
  console.log('\n=== TEST 2: Click on Navigation Element ===');
  // Find and click navigation
  const nav = await page.$('nav');
  if (nav) {
    await nav.click({ force: true });
    await page.waitForTimeout(500);
    console.log('Navigation clicked!');
    
    const panel = await page.$('.arch-panel');
    console.log('Inspector Panel After Click:', panel ? 'VISIBLE' : 'HIDDEN');
  }
  
  console.log('\n=== TEST 3: Click on Hero Section ===');
  const hero = await page.$('[id="hero"]');
  if (hero) {
    await hero.click({ force: true });
    await page.waitForTimeout(500);
    console.log('Hero section clicked!');
  }
  
  console.log('\n=== TEST 4: Check Tree Explorer Button ===');
  const treeBtn = await page.$('button:has-text("Tree")');
  console.log('Tree Explorer Button:', treeBtn ? 'FOUND' : 'NOT FOUND');
  if (treeBtn) {
    await treeBtn.click({ force: true });
    await page.waitForTimeout(500);
    const treePanel = await page.$('.fixed.top-24.left-6');
    console.log('Tree Panel:', treePanel ? 'VISIBLE' : 'HIDDEN');
  }
  
  console.log('\n=== TEST 5: Check Heatmap Button ===');
  const heatmapBtn = await page.$('button:has-text("Heatmap")');
  console.log('Heatmap Button:', heatmapBtn ? 'FOUND' : 'NOT FOUND');
  if (heatmapBtn) {
    await heatmapBtn.click({ force: true });
    await page.waitForTimeout(500);
    console.log('Heatmap mode toggled!');
  }
  
  console.log('\n=== TEST 6: Check Export Button ===');
  const exportBtn = await page.$('button:has-text("Export")');
  console.log('Export Button:', exportBtn ? 'FOUND' : 'NOT FOUND');
  
  console.log('\n=== TEST 7: Check Search Input ===');
  const searchInput = await page.$('#arch-search');
  console.log('Search Input:', searchInput ? 'FOUND' : 'NOT FOUND');
  if (searchInput) {
    await searchInput.fill('hero');
    await page.waitForTimeout(500);
    const searchResults = await page.$$('.arch-panel button');
    console.log('Search Results Found:', searchResults.length);
  }
  
  console.log('\n=== TEST 8: Check Copy Buttons ===');
  const copyPathBtn = await page.$('button:has-text("Copy Path")');
  console.log('Copy Path Button:', copyPathBtn ? 'FOUND' : 'NOT FOUND');
  
  const copyJsonBtn = await page.$('button:has-text("Copy JSON")');
  console.log('Copy JSON Button:', copyJsonBtn ? 'FOUND' : 'NOT FOUND');
  
  const fullReportBtn = await page.$('button:has-text("Full Report")');
  console.log('Full Report Button:', fullReportBtn ? 'FOUND' : 'NOT FOUND');
  
  console.log('\n=== TEST 9: Statistics Display ===');
  const statsSection = await page.$('text=Statistics');
  console.log('Statistics Section:', statsSection ? 'FOUND' : 'NOT FOUND');
  
  console.log('\n=== TEST 10: Mini Map ===');
  const miniMap = await page.$('text=Current Position');
  console.log('Mini Map:', miniMap ? 'FOUND' : 'NOT FOUND');
  
  console.log('\n=== VERIFICATION COMPLETE ===');
  
  await browser.close();
}

verify().catch(e => console.error('VERIFICATION ERROR:', e));
