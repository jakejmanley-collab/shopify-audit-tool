import { NextResponse } from 'next/server';

// We use 'let' because we will dynamically import these libraries
let chromium: any;
let puppeteer: any;

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // 1. DETERMINE ENVIRONMENT
    // If we are in "Production" (Vercel), use the diet libraries
    if (process.env.NODE_ENV === 'production') {
      chromium = await import('@sparticuz/chromium').then(mod => mod.default);
      puppeteer = await import('puppeteer-core').then(mod => mod.default);
    } else {
      // If we are "Local" (Your Laptop), use the full heavy library
      puppeteer = await import('puppeteer').then(mod => mod.default);
    }

    console.log(`🤖 ROBOT STARTING on ${process.env.NODE_ENV || 'local'}...`);

    // 2. CONFIGURE BROWSER
    let browser;
    if (process.env.NODE_ENV === 'production') {
      // Vercel Configuration (Diet Mode)
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      // Local Configuration (Full Mode)
      browser = await puppeteer.launch({
        headless: true, // Change to false if you want to see the window
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });

    const errors: string[] = [];

    // 3. LISTEN FOR ERRORS
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // 4. VISIT PAGE
    // We increase timeout to 20s because serverless functions can be slow starting up
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    
    await browser.close();

    return NextResponse.json({ 
      success: true, 
      errorCount: errors.length, 
      errors: errors.slice(0, 3) 
    });

  } catch (error) {
    console.error('🔥 ROBOT CRASHED:', error);
    return NextResponse.json({ success: false, message: 'Scan failed' }, { status: 500 });
  }
}