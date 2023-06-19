import { ScraperObject } from "./pageScraper.js";
import * as fs from 'node:fs';

/**
 * This function controls the scraping process. It uses
 * the browser instance to control the page
 * @param {*} browserInstance - A currently opened page
 */
export async function scrapeAll(browserInstance, url) {

    const fileName = 'schools.json';

    try {
        const browser = await browserInstance;

        const newScraper = new ScraperObject(url);
        const scrapedData = await newScraper.scraper(browser);
        await browser.close();

        fs.writeFile(fileName, JSON.stringify(scrapedData), (err) => {
            if (err) {
                throw new Error(`Error when trying to write: ${err}`);
            }
            console.log(`Data has been scraped and saved to ${fileName}`);
        })

    } catch (error) {
        console.log(`${error}: Could not resolve browser instance`);
        return;
    }
}
