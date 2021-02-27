require('dotenv').config();
const fs = require("fs");
const { utils } = require("./helpers/");
const { mongooseService } = require("./services/");
const puppeteer = require('puppeteer-extra')
const Xvfb = require('xvfb');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { resolve } = require('path');
const { LINKEDIN_EMAIL, LINKEDIN_PASSWORD } = process.env;
const getCookies = async () => {
    // const cookiesStringify = fs.readFileSync("cookies.json");
    // const cookies = JSON.parse(cookiesStringify, null, 2);
    const cookies = await mongooseService.getLinkedInCookies();

    return cookies;
}
puppeteer.use(StealthPlugin())
const Scraper = {
    init: function(){
        return new Promise(async (resolve, reject)=>{
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
        //Load cookies
        const resOfLoad = await this.loadCookie().catch(err=>{
            console.log("Error in loadCookie");
            console.log({err});
            reject(err);
        });
        if (!resOfLoad) return;
        //--
        if (browser && page) resolve(true);
    })},
    browser: null,
    page: null,
    goto: (url) => new Promise(async (resolve, reject)=>{
        if (url.search(/^https?:\/\//i)<0) url="http://"+url;
        const page = await Scraper.page.goto(url)
        .catch(err=>{console.error({err});reject(err)});
        resolve(page);
    }),
    getLogin: async function(){
        await this.goto("https://www.linkedin.com/login").catch(err=>console.error({err}));
        const data = await Scraper.page.evaluate(() => document.querySelector('*').outerHTML);
        console.log({data});
        await utils.waitSec(5);
        await this.page.click("input#username");
        await utils.waitSec(1);
        await this.page.keyboard.type(LINKEDIN_EMAIL, {delay: 100});
        await this.page.click("input#password");
        await utils.waitSec(1);
        await this.page.keyboard.type(LINKEDIN_PASSWORD, {delay: 100});
        await utils.waitSec(1);
        await this.page.click('button[class^="btn"]');
        resolve(this.page);
    },
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
        const data = await Scraper.page.evaluate(() => document.querySelector('*').outerHTML);
        fs.writeFileSync("html.html", data);
        resolve(page);
    }),
    getJobCount: () => new Promise(async (resolve, reject)=>{
        // const resultJobCountElem = (await Scraper.page.$$(".results-context-header__job-count"))[0];
        // if (!resultJobCountElem) return reject("undefined resultJobCountElem");
        // const result = await (await resultJobCountElem.getProperty('textContent')).jsonValue();
        // if (!result) return reject("There is no result");
        const data = await Scraper.page.evaluate(() => document.querySelector('*').outerHTML);
        let result;
        result = utils.getAllMatches(data, /[0-9]+(?=\ results)/ig)[0] || utils.getAllMatches(data, /(?<=\>)[0-9]+(?=\<)/g)[0];
        console.log({result})
        if (!result) return reject("undefined result");
        resolve(result);
    }),
    loadCookie: function(){
        return new Promise(async (resolve, _)=>{
        //Get cookies
        const cookies = (await getCookies().catch(()=>{}) || []);
        await this.page.setCookie(...cookies);
        console.log("cookies are loaded.");
        resolve(true);
    })},
    downloadCookie: async function(){
        const cookies = await this.page.cookies();
        //-----Save Cookies
        // fs.writeFileSync("./cookies.json", JSON.stringify(cookies, null, 2));
        await mongooseService.updateLinkedInCookies(cookies).catch(err=>console.error({err}));
        //<<<<<Save Cookies
        return cookies;
    },
    close: function(){
        return new Promise(async (resolve, reject)=>{
        let result;
        //-----------Upload cookies
        await this.downloadCookie();
        console.log("Cookies are uploaded.");
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
    });
},
}


module.exports = Scraper;
