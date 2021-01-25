const puppeteer = require('puppeteer-extra')
const Xvfb = require('xvfb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const Scraper = {
    init: () => new Promise(async (resolve, reject)=>{
        var xvfb = new Xvfb({
            silent: true,
            xvfb_args: ["-screen", "0", '1280x720x24', "-ac"],
        });
        xvfb.start((err)=>{if (err) console.error(err)})
        const browser = Scraper.browser = await puppeteer.launch({
            headless: false,
            stealth: true,
            defaultViewport: null,
            args: ['--no-sandbox', '--start-fullscreen', '--display='+xvfb._display]
        })
        .catch(err=>{console.error({err});reject(err)});
        const page = Scraper.page = await browser.newPage()
        .catch(err=>{console.error({err});reject(err)});
        console.log("browser:", !!browser, "page:", !!page);
        if (browser && page) resolve(true);
    }),
    browser: null,
    page: null,
    goto: (url) => new Promise(async (resolve, reject)=>{
        if (url.search(/^https?:\/\//i)<0) url="http://"+url;
        const page = await Scraper.page.goto(url)
        .catch(err=>{console.error({err});reject(err)});
        resolve(page);
    }),
    setQueryOptions: (data={}) => {
        const { query, location } = data;
        if (query) Scraper.data.queryOptions.query = query;
        if (location) Scraper.data.queryOptions.location = location;
        console.log({queryOptions: Scraper.data.queryOptions});
    },
    getQueryOptions: () => Scraper.data.queryOptions,
    data: {
        queryOptions: {
            query: "",
            location: "worldwide"
        }
    },
    linkedInJobSearch: () => new Promise(async (resolve, reject)=>{
        const { query, location } = Scraper.getQueryOptions();
        const url = `https://www.linkedin.com/jobs/search?keywords=${query}&location=${location}`
        const page = await Scraper.goto(url)
        .catch(err=>{console.error({err});reject(err)});
        resolve(page);
    }),
    getJobCount: () => new Promise(async (resolve, reject)=>{
        const resultJobCountElem = (await Scraper.page.$$(".results-context-header__job-count"))[0];
        const result = await (await resultJobCountElem.getProperty('textContent')).jsonValue();
        if (!result) return reject("There is no result");
        resolve(result);
    }),
    close: () => new Promise(async (resolve, reject)=>{
        let result;
        try {
            result = Scraper.browser.process().kill('SIGINT');
            xvfb.stop();
        } catch(err) {
            reject(err);
        }
        // await Scraper.browser.close()
        // .catch(err=>{
        //     console.error({err});
        //     reject(err);
        // });
        if (result) resolve(result);
    }),
}

module.exports = Scraper;
