require('dotenv').config();
const { utils } = require("./helpers/");
const { mongooseService } = require("./services/");
const fs = require("fs");
const axios = require("axios");
const Scraper = require("./linkedInScraper");
const { waitSec } = require('./helpers/utils');
const { GITHUB_TOKEN } = process.env;
const counts = {
    github: 0,
    linkedIn: 0
}
console.log({
    C1:{
        github: "web3 in package.json",
        linkedin: "web3 nodejs"
    }
})
const getGithub = async () => {
    const query="web3";
    const result = await axios.get("https://api.github.com/search/code?q="+query+"+in:file+filename:package.json",{
        headers:{
            "Authorization": "Bearer " + GITHUB_TOKEN
        }
    })
    .catch(err=>console.error({err}));

    let total_count;
    const { data } = result;
    if (data){
        ({ total_count } = data);
    }
    if (Number.isInteger(total_count)) {console.log({total_count});counts.github=total_count}
}

const getLinkedIn = async () => {
    await Scraper.init();
    await waitSec(5);
    Scraper.setQueryOptions({query: "ethereum web3"})
    await Scraper.linkedInJobSearch();
    // await waitSec(5);
    // await Scraper.getLogin().catch(err=>{
    //     console.log("Error in Scraper.getLogin()");
    //     console.log(err)
    // });
    await waitSec(10);
    await utils.waitSec(5);
    const count = parseInt((await Scraper.getJobCount()).replace(/\,|\+$/g, ""));
    counts.linkedIn = count;
    await Scraper.close();
}

const getCounts = async () => {
    await getGithub();
    await getLinkedIn()
    .catch(err=>console.error({err}));
    return counts;
}

getCounts()
.then(res=>{
    console.log({res});
    const {
        github: githubCount,
        linkedIn: linkedinCount
    } = res;
    mongooseService.postC1Logs(githubCount, linkedinCount).then(res=>{
        console.log({postC1Logs_res: res});
    })
    .catch(err=>{
        console.error({postC1Logs_err: err});
    });
})
.catch(err=>console.error({err}));

// const puppeteer = require('puppeteer')
// const Xvfb = require('xvfb');

// (async () => {
//     var xvfb = new Xvfb({
//         silent: true,
//         xvfb_args: ["-screen", "0", '1280x720x24', "-ac"],
//     });
//     xvfb.start((err)=>{if (err) console.error(err)})
//     const browser = await puppeteer.launch({
//         headless: true,
//         defaultViewport: null,
//         args: ['--no-sandbox', '--start-fullscreen', '--display='+xvfb._display]
//         });
//     const page = await browser.newPage();
//     await page.goto(`https://wikipedia.org`,{waitUntil: 'networkidle2'});
//     await page.screenshot({path: 'result.png'});
//     await browser.close()
//     xvfb.stop();
// })();
