/**
 * This module sets the pageController to accept
 * the browser instance and runs the application
 */
import { startBrowser } from "./browser.js";
import { scrapeAll } from "./pageController.js";
import { stdin, stdout, argv } from 'node:process';
import * as readline from 'node:readline';

/**
 * starts the browser and creates the browser instance
 */
async function runApp() {
    const userArg = `Please specify a university category to scrape and press Enter: `
    const Intro = `
    This is a web scraping application that retrieves the 
    names of all the universities in Nigeria (Federal, State, and Private) from the
    Nigerian Universities Commission (NUC) website.

    To start the application:

    - npm run start: This starts the web scraping process.
    [url]: The url specifies the category of universities you want
            to scrape; federal | private | state.
    User can either specify one url to scrape data from a category,
    or none to scrape all the universities.

    Valid urls: [federal, state, private]
    `
    console.log(Intro);
    const validUrls = ['federal', 'state', 'private'];

   
    const rl = readline.createInterface({
        input: stdin,
        output: stdout
      });
      
      rl.question(`${userArg}`, async (answer) => {
        console.log(`Checking input...`);
        if (answer.length === 0) {
            console.log('=== No url specified. Scraping all universities data...');
            const browser = startBrowser();
            await scrapeAll(browser);
        } else {
            const url = answer;
    
            if (!validUrls.includes(url.toLowerCase())) {
                console.log(`Valid values are in this list: [${validUrls.join(', ')}]`);
                rl.close()
                return;
            }
            console.log(`Input OK. url: ${url}`);
            const browser = startBrowser();
            await scrapeAll(browser, url.toLowerCase());
            rl.close();
            return;
        }
        rl.close()
      });
      
    
};

runApp();
