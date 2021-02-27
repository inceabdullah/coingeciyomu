const { mongoDB } = require("../loaders/");
let mongoose;
mongoDB.onReady().then(res=>mongoose=res)
.catch(err=>console.error({err}));

exports.getLinkedInCookies = () => new Promise((resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    const cookieSchema = new mongoose.Schema({
        name: String,
        stringify: String
    }, { timestamps: { createdAt: 'created_at' } });
    const cookieModel = mongoose.model("Cookie", cookieSchema);
    cookieModel.findOne({name: "linkedin"}, (err, cookies)=>{
        if (err) return reject(err);
        const cookieJSON = JSON.parse(cookies.stringify);
        resolve(cookieJSON);
    });
});

exports.updateLinkedInCookies = (cookies) => new Promise(async (resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    const cookieSchema = new mongoose.Schema({
        name: String,
        stringify: String
    }, { timestamps: { createdAt: 'created_at' } });
    const cookieModel = mongoose.model("Cookie", cookieSchema);
    const updated = await cookieModel.updateOne({name: "linkedin"}, {
        $set: {
            stringify: JSON.stringify(cookies, null, 2)
        }
    }).catch(err=>{
        console.error({err});
        reject(err);
    });
    if (!updated) return;
    resolve(updated);
});

exports.postC1Logs = (githubCount=0, linkedinCount=0, log={}) => new Promise((resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    // C1: web3, nodejs
    const _C1Schema = new mongoose.Schema({
        name: String,
        github: Number,
        linkedin: Number,
        log: String
    }, { timestamps: { createdAt: 'created_at' } });
    const _C1Model = mongoose.model("C1", _C1Schema);
    const _C1 = new _C1Model({
        name: "C1",
        github: githubCount,
        linkedin: linkedinCount,
        log: JSON.stringify(log, null, 2)
    });
    _C1.save((err, _C1)=>{
        if (err) return reject(err);
        resolve(_C1);
    });
});

exports.getC1Logs = () => new Promise((resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    // C1: web3, nodejs
    const _C1Schema = new mongoose.Schema({
        name: String,
        github: Number,
        linkedin: Number,
        log: String
    }, { timestamps: { createdAt: 'created_at' } });
    const _C1Model = mongoose.model("C1", _C1Schema);
    _C1Model.find({name: "C1"}, (err, _C1)=>{
        if (err) return reject(err);
        resolve(_C1);
    });
});
