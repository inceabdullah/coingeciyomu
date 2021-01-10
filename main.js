require('dotenv').config();
const { utils } = require("./helpers/");
const fs = require("fs");
const axios = require("axios");
const Scraper = require("./linkedInScraper");
const { GITHUB_TOKEN } = process.env;
const counts = {
    github: 0,
    linkedIn: 0
}
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
    Scraper.setQueryOptions({query: "ethereum web3"})
    await Scraper.linkedInJobSearch();
    await utils.waitSec(15);
    const count = parseInt((await Scraper.getJobCount()).replace(/\,|\+$/g, ""));
    counts.linkedIn = count;
    await Scraper.close();
}

const getCounts = async () => {
    console.log("getting github");
    await getGithub();
    console.log("getting linkedin");
    await getLinkedIn()
    .catch(err=>console.error({err}));
    return counts;
}

getCounts()
.then(res=>console.log({res}))
.catch(err=>console.error({err}));


