import { NextResponse } from 'next/server';

// Define variables for dynamic imports
let chromium: any;
let puppeteer: any;

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // 1. DETERMINE ENVIRONMENT (Cloud vs Local)
    if (process.env.NODE_ENV === 'production') {
      // Vercel (Cloud): Use compressed Chromium
      chromium = await import('@sparticuz/chromium').then(mod => mod.default);
      puppeteer = await import('puppeteer-core').then(mod => mod.default);
    } else {
      // Local (Laptop): Use full Puppeteer
      puppeteer = await import('puppeteer').then(mod => mod.default);
    }

    // 2. LAUNCH BROWSER
    let browser;
    if (process.env.NODE_ENV === 'production') {
      // Vercel Configuration
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local Configuration
      browser = await puppeteer.launch({
        headless: true, // Set to false if you want to watch it work
      });
    }

    const page = await browser.newPage();
    // Simulate an iPhone X to catch mobile-only errors
    await page.setViewport({ width: 375, height: 812 });

    const errors: string[] = [];

    // 3. LISTEN FOR CONSOLE ERRORS
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 4. VISIT PAGE & MEASURE LOAD SPEED
    const start = Date.now();
    // 20s timeout to prevent hanging
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    const duration = Date.now() - start; // Load time in milliseconds

    // 5. COUNT SCRIPTS (The "Bloat" Metric)
    const scriptCount = await page.evaluate(() => {
      return document.getElementsByTagName('script').length;
    });

    await browser.close();

    // 6. RETURN DATA
    return NextResponse.json({ 
      success: true, 
      errorCount: errors.length,
      // Convert ms to seconds (e.g., "4.2s")
      loadTime: (duration / 1000).toFixed(2), 
      scriptCount: scriptCount,
      // Return top 3 errors for the manual report later
      errors: errors.slice(0, 3) 
    });

  } catch (error) {
    console.error('ROBOT CRASHED:', error);
    return NextResponse.json({ success: false, message: 'Scan failed' }, { status: 500 });
  }
}