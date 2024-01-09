import Scraper from "./pageScraper.js";
import { createWriteStream } from 'node:fs';
/**
 * This function controls the scraping process. It uses
 * the browser instance to control the page
 */
export async function scrapeAll(arg) {
    const { browser, url } = arg;
    const fileName = 'schools.json';
    const writableStream = createWriteStream(fileName, 'utf-8')
        .on('finish', () => console.log('Write finished'));
    try {
        const newScraper = new Scraper(url);
        const scrapedData = await newScraper.getUrlData(browser);
        await browser.close();
        writableStream.write(JSON.stringify(scrapedData));
        writableStream.end();
        console.log(`Data has been scraped and saved to ${fileName}`);
    }
    catch (error) {
        // switch (error.message) {
        //     case 
        // }
        console.log(`${error}: Could not resolve browser instance`);
        return;
    }
}
