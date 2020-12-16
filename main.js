require('dotenv').config();
const fs = require("fs");
const axios = require("axios");
const { GITHUB_TOKEN, LINKEDIN_ID, LINKEDIN_SECRET } = process.env;
const query="web3";
axios.get("https://api.github.com/search/code?q="+query+"+in:file+filename:package.json",
{
    headers:{
        "Authorization": "Bearer " + GITHUB_TOKEN
    }
})
.then(res=>{
    let total_count;
    const { data } = res;
    if (data){
        ({ total_count } = data);
    }
    if (total_count) console.log({total_count});
})
.catch(err=>console.error({err}))
