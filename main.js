require('dotenv').config();
const fs = require("fs");
const axios = require("axios");
const { GITHUB_TOKEN } = process.env;
const query="web3";
axios.get("https://api.github.com/search/code?q="+query+"+in:file+filename:package.json&access_token="+GITHUB_TOKEN)
.then(res=>{
    let total_count;
    const { data } = res;
    if (data){
        ({ total_count } = data);
    }
    if (total_count) console.log({total_count});
})
.catch(err=>console.error({err}))
