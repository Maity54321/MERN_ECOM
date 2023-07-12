const app = require("./backend/app");
const dotenv = require("dotenv");
const connectDatabase = require("./backend/config/database");
const cloudinary = require("cloudinary");
const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

dotenv.config({ path: "backend/config/config.env" });

// connectDatabase();
// const connectDatabase = ()=>{
mongoose
  .connect(process.env.DB_URI_ON)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
// }

module.exports = connectDatabase;

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// if(process.env.NODE_ENV == "production"){
//     const path = require('path');
//     app.use(express.ststic(path.resolve(__dirname, 'frontend', 'build')));
//     app.get('/', (req, res)=>{
//         res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//     })
// }

app.listen(process.env.PORT, () => {
  console.log(`Server started at localhost:${process.env.PORT}`);
});

// module.exports = instance;
exports.instance = instance;
