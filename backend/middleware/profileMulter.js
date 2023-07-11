const multer = require("multer");

const proStorage = multer.memoryStorage();

const profileUpload = multer({ proStorage }).single("images");
const productUpload = multer({ proStorage }).single("productImage");

module.exports = { profileUpload, productUpload };
