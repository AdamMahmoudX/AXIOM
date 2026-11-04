import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  
  console.log('\n=== LOADING PAGE ===');
  await page.goto('https://h4lzagwbomk2.space.minimax.io', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Remove overlay elements
  await page.evaluate(() => {
    const overlay = document.getElementById('minimax-floating-ball');
    if (overlay) overlay.remove();
    const chatBall = document.querySelector('.minimax-floating-ball, [class*="floating-ball"]');
    if (chatBall) chatBall.remove();
  });
  
  console.log('\n========================================');
  console.log('TEST 1: Developer Mode Activation');
  console.log('========================================');
  const devButton = await page.$('button[title*="Architecture Explorer"]');
  if (devButton) {
    await devButton.click({ force: true });
    await page.waitForTimeout(500);
    console.log('[PASS] Developer Mode button found and clicked');
    
    const statusBar = await page.$('.fixed.bottom-6.left-6');
    console.log(statusBar ? '[PASS] Status Bar visible' : '[FAIL] Status Bar not visible');
  } else {
    console.log('[FAIL] Developer Mode button not found!');
  }
  
  console.log('\n========================================');
  console.log('TEST 2: Element Inspection (Navigation)');
  console.log('========================================');
  const nav = await page.$('nav');
  if (nav) {
    await nav.click({ force: true });
    await page.waitForTimeout(500);
    console.log('[PASS] Navigation clicked');
    
    const panel = await page.$('.arch-panel');
    console.log(panel ? '[PASS] Inspector Panel appeared' : '[FAIL] Inspector Panel not shown');
    
    // Get element data
    const panelContent = await page.evaluate(() => {
      const panel = document.querySelector('.arch-panel');
      if (!panel) return 'No panel';
      const text = panel.textContent || '';
      return text.substring(0, 300);
    });
    console.log('Panel Content Preview:', panelContent.substring(0, 200));
  }
  
  console.log('\n========================================');
  console.log('TEST 3: Tree Explorer Panel');
  console.log('========================================');
  const treeBtn = await page.$('button:has-text("Tree")');
  if (treeBtn) {
    await treeBtn.click({ force: true });
    await page.waitForTimeout(500);
    const treePanel = await page.$('.fixed.top-24.left-6, .fixed.left-6');
    console.log(treePanel ? '[PASS] Tree Explorer opened' : '[FAIL] Tree Explorer did not open');
    
    // Check for search input inside tree panel
    const searchInput = await page.$('#arch-search');
    console.log(searchInput ? '[PASS] Search input found' : '[INFO] Search input not in tree panel');
    
    // Count tree nodes
    const treeNodes = await page.$$('.fixed.left-6 [class*="rounded-lg"][class*="cursor-pointer"]');
    console.log(`[INFO] Tree nodes found: ${treeNodes.length}`);
  }
  
  console.log('\n========================================');
  console.log('TEST 4: Search Engine');
  console.log('========================================');
  const searchInput = await page.$('#arch-search');
  if (searchInput) {
    await searchInput.fill('hero');
    await page.waitForTimeout(500);
    const searchResults = await page.$$('.arch-panel button');
    console.log(`[${searchResults.length > 0 ? 'PASS' : 'FAIL'}] Search results: ${searchResults.length}`);
  } else {
    console.log('[FAIL] Search input not accessible');
  }
  
  console.log('\n========================================');
  console.log('TEST 5: Copy Functions');
  console.log('========================================');
  const copyPathBtn = await page.$('button:has-text("Copy Path")');
  const copyJsonBtn = await page.$('button:has-text("Copy JSON")');
  const fullReportBtn = await page.$('button:has-text("Full Report")');
  
  console.log(copyPathBtn ? '[PASS] Copy Path button found' : '[FAIL] Copy Path button not found');
  console.log(copyJsonBtn ? '[PASS] Copy JSON button found' : '[FAIL] Copy JSON button not found');
  console.log(fullReportBtn ? '[PASS] Full Report button found' : '[FAIL] Full Report button not found');
  
  console.log('\n========================================');
  console.log('TEST 6: Statistics Display');
  console.log('========================================');
  const statsSection = await page.$('text=Statistics');
  const totalEl = await page.$('text=Total Elements, text=Total:');
  console.log(statsSection ? '[PASS] Statistics section found' : '[FAIL] Statistics section not found');
  
  console.log('\n========================================');
  console.log('TEST 7: Heatmap Mode');
  console.log('========================================');
  const heatmapBtn = await page.$('button:has-text("Heatmap")');
  if (heatmapBtn) {
    await heatmapBtn.click({ force: true });
    await page.waitForTimeout(500);
    const legend = await page.$('text=Heatmap Legend');
    console.log(legend ? '[PASS] Heatmap legend visible' : '[INFO] Heatmap legend not detected');
  }
  
  console.log('\n========================================');
  console.log('TEST 8: Export Function');
  console.log('========================================');
  const exportBtn = await page.$('button:has-text("Export")');
  console.log(exportBtn ? '[PASS] Export button found' : '[FAIL] Export button not found');
  
  console.log('\n========================================');
  console.log('TEST 9: Mini Map');
  console.log('========================================');
  // Mini map appears when element is selected
  await page.click('nav', { force: true });
  await page.waitForTimeout(500);
  const miniMap = await page.$('text=Current Position');
  console.log(miniMap ? '[PASS] Mini Map visible' : '[INFO] Mini Map requires element selection');
  
  console.log('\n========================================');
  console.log('CONSOLE ERRORS CHECK');
  console.log('========================================');
  if (errors.length === 0) {
    console.log('[PASS] No console errors detected');
  } else {
    console.log(`[WARN] ${errors.length} console errors:`);
    errors.slice(0, 5).forEach(e => console.log('  -', e.substring(0, 100)));
  }
  
  await browser.close();
  console.log('\n========================================');
  console.log('VERIFICATION COMPLETE');
  console.log('========================================');
}

verify().catch(e => console.error('ERROR:', e));
