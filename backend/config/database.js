const mongoose = require('mongoose');
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URI_ON).then(()=>{
    console.log("MongoDB Connected Successfully");
}).catch((err)=>{
    console.log(err);
});
}

module.exports = connectDatabase;