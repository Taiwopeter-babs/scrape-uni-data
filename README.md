# scrape-uni-data

This is a Javascript web scraping application that works on the command line interface.
It scrapes data from the Nigerian Universities Commision (NUC) [website](https://www.nuc.edu.ng/) based on the `url` entered by the user.

## Usage

If no url is specified, the names of all universities in all the categories are retrieved.

```
PS C:\Users\INVENTAR\Desktop\scrape_schools> npm run start

> scrape_schools@1.0.0 start
> node index.js


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

Please specify a university category to scrape and press Enter:
Checking input...
=== No url specified. Scraping all universities data...
Opening the browser...
Naviagting to https://www.nuc.edu.ng/...
Retrieving data from https://www.nuc.edu.ng/nigerian-univerisities/federal-univeristies/...
Retrieving data from https://www.nuc.edu.ng/nigerian-univerisities/state-univerisity/...
Retrieving data from https://www.nuc.edu.ng/nigerian-univerisities/private-univeristies/...
Data has been scraped and saved to schools.json
```

If the user specifies a url, the application retrieves only the names of universities in that category, otherwise
The data retrived is saved to a file `schools.json`

## Notes

This application was tested on Windows OS using powershell cli.

I tried testing on the Windows Subsysytem for Linux (WSL), but I ran into a lot of dependency problems.
