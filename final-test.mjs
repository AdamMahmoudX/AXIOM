import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     HOR ARCHITECTURE EXPLORER v2.0 - RUNTIME VERIFICATION     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  console.log('\n🌐 Loading website...');
  await page.goto('https://rcye9zduuie5.space.minimax.io', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Remove any overlay elements
  await page.evaluate(() => {
    const overlay = document.getElementById('minimax-floating-ball');
    if (overlay) overlay.remove();
    const chatBall = document.querySelector('.minimax-floating-ball, [class*="floating-ball"]');
    if (chatBall) chatBall.remove();
  });
  
  console.log('✓ Website loaded\n');
  
  // Test 1: Developer Mode
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('TEST 1: Developer Mode Activation');
  console.log('───────────────────────────────────────────────────────────────');
  const devButton = await page.$('button[title*="Architecture Explorer"]');
  if (devButton) {
    await devButton.click({ force: true });
    await page.waitForTimeout(500);
    console.log('  ✓ Developer Mode toggle button found and clicked');
    
    const statusBar = await page.$('.fixed.bottom-6.left-6');
    console.log(statusBar ? '  ✓ Status bar visible' : '  ✗ Status bar not visible');
  } else {
    console.log('  ✗ Developer Mode button NOT found');
  }
  
  // Test 2: Element Inspection
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 2: Element Inspection - Navigation');
  console.log('───────────────────────────────────────────────────────────────');
  const nav = await page.$('nav');
  if (nav) {
    await nav.click({ force: true });
    await page.waitForTimeout(500);
    console.log('  ✓ Navigation element clicked');
    
    const panel = await page.$('.arch-panel');
    console.log(panel ? '  ✓ Inspector panel opened' : '  ✗ Inspector panel not shown');
    
    // Get data from panel
    const panelData = await page.evaluate(() => {
      const panel = document.querySelector('.arch-panel');
      return panel ? panel.textContent.substring(0, 300) : '';
    });
    console.log('  Panel preview:', panelData.substring(0, 150).replace(/\s+/g, ' '));
  }
  
  // Test 3: Tree Explorer
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 3: Tree Explorer Panel');
  console.log('───────────────────────────────────────────────────────────────');
  const treeBtn = await page.$('button:has-text("Tree")');
  if (treeBtn) {
    await treeBtn.click({ force: true });
    await page.waitForTimeout(500);
    console.log('  ✓ Tree button clicked');
    
    const treePanel = await page.$('.fixed.top-24.left-6, .fixed.left-6');
    console.log(treePanel ? '  ✓ Tree panel visible' : '  ✗ Tree panel not visible');
    
    // Check for tree nodes
    const treeNodes = await page.$$('.fixed.left-6 [class*="rounded-lg"]');
    console.log(`  Tree nodes count: ${treeNodes.length}`);
    
    // Check for search input
    const searchInput = await page.$('#arch-search');
    console.log(searchInput ? '  ✓ Search input found in tree panel' : '  ✗ Search input not in tree panel');
    
    // Test search
    if (searchInput) {
      await searchInput.fill('hero');
      await page.waitForTimeout(500);
      const searchResults = await page.$$('.arch-panel button');
      console.log(`  Search results: ${searchResults.length}`);
    }
  } else {
    console.log('  ✗ Tree button not found');
  }
  
  // Test 4: Heatmap Mode
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 4: Heatmap Mode');
  console.log('───────────────────────────────────────────────────────────────');
  const heatmapBtn = await page.$('button:has-text("Heatmap")');
  if (heatmapBtn) {
    await heatmapBtn.click({ force: true });
    await page.waitForTimeout(500);
    console.log('  ✓ Heatmap button clicked');
    
    const legend = await page.$('text=Heatmap Legend');
    console.log(legend ? '  ✓ Heatmap legend visible' : '  ✗ Heatmap legend not visible');
  } else {
    console.log('  ✗ Heatmap button not found');
  }
  
  // Test 5: Copy Functions
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 5: Copy Functions');
  console.log('───────────────────────────────────────────────────────────────');
  const copyPathBtn = await page.$('button:has-text("Copy Path")');
  const copyJsonBtn = await page.$('button:has-text("Copy JSON")');
  const fullReportBtn = await page.$('button:has-text("Full Report")');
  
  console.log(copyPathBtn ? '  ✓ Copy Path button found' : '  ✗ Copy Path button not found');
  console.log(copyJsonBtn ? '  ✓ Copy JSON button found' : '  ✗ Copy JSON button not found');
  console.log(fullReportBtn ? '  ✓ Full Report button found' : '  ✗ Full Report button not found');
  
  // Test 6: Statistics
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 6: Statistics Display');
  console.log('───────────────────────────────────────────────────────────────');
  const statsSection = await page.$('text=Statistics');
  console.log(statsSection ? '  ✓ Statistics section visible' : '  ✗ Statistics section not visible');
  
  // Get statistics values
  const statsValues = await page.evaluate(() => {
    const panel = document.querySelector('.arch-panel');
    if (!panel) return {};
    const text = panel.textContent || '';
    const totalMatch = text.match(/Total[\s\S]*?(\d+)/);
    const buttonsMatch = text.match(/Buttons[\s\S]*?(\d+)/);
    const cardsMatch = text.match(/Cards[\s\S]*?(\d+)/);
    return {
      total: totalMatch ? totalMatch[1] : 'N/A',
      buttons: buttonsMatch ? buttonsMatch[1] : 'N/A',
      cards: cardsMatch ? cardsMatch[1] : 'N/A'
    };
  });
  console.log(`  Total: ${statsValues.total}, Buttons: ${statsValues.buttons}, Cards: ${statsValues.cards}`);
  
  // Test 7: Export
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 7: Export Function');
  console.log('───────────────────────────────────────────────────────────────');
  const exportBtn = await page.$('button:has-text("Export")');
  console.log(exportBtn ? '  ✓ Export button found' : '  ✗ Export button not found');
  
  // Test 8: Mini Map
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 8: Mini Map');
  console.log('───────────────────────────────────────────────────────────────');
  const miniMap = await page.$('text=Current Position');
  console.log(miniMap ? '  ✓ Mini Map visible' : '  ✗ Mini Map not visible');
  
  // Test 9: Multiple Element Clicks
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('TEST 9: Multiple Element Inspection');
  console.log('───────────────────────────────────────────────────────────────');
  
  const sections = ['section', '[id="hero"]', '[id="services"]', 'footer'];
  for (const selector of sections) {
    const el = await page.$(selector);
    if (el) {
      await el.click({ force: true });
      await page.waitForTimeout(300);
      const panelAfterClick = await page.$('.arch-panel');
      console.log(`  ✓ ${selector} clicked - Panel: ${panelAfterClick ? 'YES' : 'NO'}`);
    }
  }
  
  // Console Errors
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('CONSOLE ERRORS');
  console.log('───────────────────────────────────────────────────────────────');
  if (errors.length === 0) {
    console.log('  ✓ No console errors detected');
  } else {
    console.log(`  ⚠ ${errors.length} errors:`);
    errors.slice(0, 3).forEach(e => console.log(`    - ${e.substring(0, 80)}`));
  }
  
  await browser.close();
  
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║              VERIFICATION COMPLETE                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
}

verify().catch(e => console.error('ERROR:', e));
