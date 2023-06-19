/**
 * This main scraping module
 * It contains the url and methods
 */
 
export class ScraperObject {
    defaultUrl = 'http://books.toscrape.com'
    #allUrls = {
        "mainSite": "https://www.nuc.edu.ng/",
        "state": "https://www.nuc.edu.ng/nigerian-univerisities/state-univerisity/",
        "federal": "https://www.nuc.edu.ng/nigerian-univerisities/federal-univeristies/",
        "private": "https://www.nuc.edu.ng/nigerian-univerisities/private-univeristies/"
    }

    mainUrl = this.#allUrls.mainSite;

    constructor (url) {
        if (!url) {
            this.url = this.mainUrl;
        } else {
            this.url = this.#allUrls[url];
        }
    }

    /**
     * Main scraper method of the object.
     * @param {*} browser 
     * @returns Data scraped from the website
     */
    async scraper(browser) {
        const page = await browser.newPage();
        console.log(`Naviagting to ${this.url}...`);
        await page.goto(this.url, { waitUntil: 'load', timeout: 0 });
        const scrapedData = {};
        const pageUrl = this.url;
        const mUrl = this.mainUrl;
        
        /**
         * scrapeCurrentPage - Retrieves data from the current page.
         * It also checks for pagination
         */
        async function scrapeCurrentPage () {
            
            let uniLinks;
            let currentPageData;
            
            // check if a url was specified, if not, it defaults to mainUrl
            if (pageUrl === mUrl) {
                // Wait for the required DOM to be rendered
                await page.waitForSelector('#page-container');
                // Get all the links to the Universities
                const urls = await page.$$eval('li#menu-item-178 > ul.sub-menu li', (links) => {
                // Scrape links of Universities
                links = links.map((schoolLink) => schoolLink.querySelector('a').href);
                return links;
                });
                uniLinks = urls.slice(0, 3); // Array
            } else {
                uniLinks = pageUrl; // string
            }
            
        
            /**
            * Loop through each link, get relevant information from them
            */
            const pagePromise = (link) => new Promise(async (resolve, reject) => {
                const dataObj = {};
                const newPage = await browser.newPage();
                await newPage.goto(link, { waitUntil: 'networkidle0', timeout: 0 });
                
                await newPage.waitForSelector('#main-content');
                // Get Universities type; State, Federal, Private
                const uniType = await newPage.$eval('thead th.column-2', (text) => text.textContent);
                const schoolNames = [];

                /**
                 * Iterate through the data on each row of the university table,
                 * get the name of the school, then navigate to the next page of the table
                 */
                while (true) {
                    const tableRows = await newPage.$$eval('tbody tr', (rows) => {
                        return rows.map((row) => row.querySelector('td.column-2').textContent);
                        
                    });
                    schoolNames.push(...tableRows);
                
                    const nextButton = await newPage.$('a.paginate_button.next');
                    if (!nextButton) {
                        break;
                    }
                    const isNextButtonDisabled = await newPage.evaluate((btn) => btn.classList.contains('disabled'), nextButton);

                    if (isNextButtonDisabled) {
                        break;
                    }
                    
                    await newPage.click('a.paginate_button.next');
                    continue;
                
                }
                dataObj[uniType.toLowerCase()] = schoolNames;          
                resolve(dataObj);
                await newPage.close();
            });
            
            try {
                // A 'string' type means a category was specified
                if (typeof uniLinks === 'string') {
                    console.log(`Retrieving data from ${uniLinks}...`);
                    currentPageData = await pagePromise(uniLinks);
                    Object.keys(currentPageData).forEach((key) => {
                        scrapedData[key] = currentPageData[key];
                    });
                } else {
                    
                    for(let i = 0; i < uniLinks.length; i++) {
                        console.log(`Retrieving data from ${uniLinks[i]}...`);
                        currentPageData = await pagePromise(uniLinks[i]);
                        Object.keys(currentPageData).forEach((key) => {
                            scrapedData[key] = currentPageData[key];
                        });         
                    }
                   
                }
            } catch (error) {
                throw new Error(`Invalid url: ${error}`);
            }  
        }
        await scrapeCurrentPage();

        await page.close();
        return scrapedData;
    }
        
}