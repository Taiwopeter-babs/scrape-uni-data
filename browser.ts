import puppeteer from 'puppeteer';

/**
 * starts a browser instance in google chrome
 */
export async function startBrowser() {
    let browser;

    try {
        console.log('Opening the browser...');

        browser = await puppeteer.launch({
            /**
             * setting headless to false makes sure puppeteer 
             * runs with an interface
             */
            headless: "new",
            args: ['--disable-setuid-sandbox', '--no-sandbox'],
            'ignoreHTTPSErrors': true,
            ignoreDefaultArgs: ['--disable-extensions']
        });
    } catch (error) {
        throw new Error(`${error}: puppeteer Could not start browser`);
    }

    return browser;
}
