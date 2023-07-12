const express = require("express");
const config = require("config");
const productRouter = require("./routes/productRouter");
const auth = require("./auth/auth");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const uploadRouter = require("./routes/uploadRouter");
const bodyParser = require("body-parser");
// const fileUpload = require('express-fileupload');
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const paymentRouter = require("./routes/paymentRoutes");
const dotenv = require("dotenv");

const app = express();
if (!config.get("jwtPrivateKey")) {
  console.log("Fatal Error: JWT private Key Not Set");
  process.exit(0);
}

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

dotenv.config({ path: "backend/myConfig/config.env" });

app.use("/api/v1/products", productRouter);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/upd", uploadRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    status: "Server is running",
  });
});

module.exports = app;
