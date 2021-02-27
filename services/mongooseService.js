const { mongoDB } = require("../loaders/");
let {mongoose} = mongoDB;
if (!mongoose) mongoDB.onReady().then(res=>mongoose=res)
.catch(err=>console.error({err}));

exports.getLinkedInCookies = () => new Promise((resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    const cookieSchema = new mongoose.Schema({
        name: String,
        stringify: String
    });
    const cookieModel = mongoose.model("Cookie", cookieSchema);
    cookieModel.findOne({name: "linkedin"}, (err, cookies)=>{
        if (err) return reject(err);
        const cookieJSON = JSON.parse(cookies.stringify);
        resolve(cookieJSON);
    });
});

exports.updateLinkedInCookies = (cookies) => new Promise((resolve, reject)=>{
    if (!mongoose) return reject("MongoDB is not loaded.");
    const cookieSchema = new mongoose.Schema({
        name: String,
        stringify: String
    });
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
