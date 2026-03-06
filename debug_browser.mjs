import puppeteer from 'puppeteer';
import fs from 'fs';

fs.writeFileSync('debug.log', '');

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    fs.appendFileSync('debug.log', 'LOG: ' + msg.text() + '\n');
    console.log('LOG: ' + msg.text());
  });
  page.on('pageerror', err => {
    fs.appendFileSync('debug.log', 'ERROR: ' + err.toString() + '\n');
    console.log('ERROR: ' + err.toString());
  });
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 5000 });
  } catch(e) {
    fs.appendFileSync('debug.log', 'NAV ERROR: ' + e.message + '\n');
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
  console.log('Done.');
})();
