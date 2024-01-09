/**
 * This main scraping module
 * It contains the url and methods
 */
export default class Scraper {
    allUrls = {
        "homeSite": "https://www.nuc.edu.ng/",
        "state": "https://www.nuc.edu.ng/nigerian-univerisities/state-univerisity/",
        "federal": "https://www.nuc.edu.ng/nigerian-univerisities/federal-univeristies/",
        "private": "https://www.nuc.edu.ng/nigerian-univerisities/private-univeristies/"
    };
    _url;
    constructor(url) {
        if (!url) {
            this._url = this.allUrls.homeSite;
        }
        else {
            this._url = this.allUrls[url];
        }
    }
    /**
     * Main scraper method of the object.
     */
    async getUrlData(browser) {
        const page = await browser.newPage();
        console.log(`Naviagting to ${this._url}...`);
        await page.goto(this._url, { waitUntil: 'load', timeout: 0 });
        const scrapedData = await this.getPageData(this._url, page, browser);
        return scrapedData;
    }
    /**
     * scrapeCurrentPage - Retrieves data from the current page.
     * It also checks for pagination
     */
    async getPageData(pageUrl, page, browser) {
        let uniLinks;
        let currentPageData = {};
        let finalPageData = {};
        // check if a url was specified, if not, it defaults to mainUrl
        if (pageUrl === this.allUrls.homeSite) {
            // Wait for the required DOM to be rendered
            await page.waitForSelector('#page-container');
            // Get all the links to the Universities
            const urls = await page.$$eval('li#menu-item-178 > ul.sub-menu li', (links) => {
                // Scrape links of Universities
                return links.map((schoolLink) => schoolLink.querySelector('a')?.href);
            });
            uniLinks = urls.slice(0, 3); // Array
        }
        else {
            uniLinks = pageUrl; // string
        }
        try {
            // A 'string' type means a category was specified
            if (typeof uniLinks === 'string') {
                console.log(`Retrieving data from ${uniLinks}...`);
                currentPageData = await this.getLinkData(browser, uniLinks);
                finalPageData = Object.assign(finalPageData, currentPageData);
            }
            else {
                for (let i = 0; i < uniLinks.length; i++) {
                    console.log(`Retrieving data from ${uniLinks[i]}...`);
                    currentPageData = await this.getLinkData(browser, uniLinks[i]);
                    finalPageData = Object.assign(finalPageData, currentPageData);
                }
            }
        }
        catch (error) {
            throw new Error(`Invalid url: ${error}`);
        }
        return finalPageData;
    }
    /**
    * Loop through each link, get relevant information from them
    */
    async getLinkData(browser, link) {
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
                return rows.map((row) => row.querySelector('td.column-2')?.textContent)
                    .filter(res => typeof res === 'string');
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
        await newPage.close();
        return dataObj;
    }
}
