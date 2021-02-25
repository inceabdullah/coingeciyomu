const { utils } = require("../helpers/");
require("dotenv").config({path: utils.pathJoin(__dirname + "/../.env")});
const mongoose = require('mongoose');
const { MONGODB_CREDENTIAL } = process.env;
const connection = mongoose.connect('mongodb+srv://' + MONGODB_CREDENTIAL +'.0ggwm.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

const modules = {
    mongoose: null,
    onReady: function (){
        return new Promise((resolve, reject)=>{
            db.on('error', (err)=>{
                console.error({err: "connection has not been."});
                reject(err);
            });
            db.once('open', () => {
                console.log("connected");
                this.mongoose = mongoose;
                resolve(mongoose);
            });
        })
    }
};
modules.onReady();
module.exports = modules;
