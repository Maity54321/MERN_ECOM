const {createCart, viewCart, showCart, deleteCartItem} = require('../controller/cartController');
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.post("/", auth, createCart);
router.get("/", auth, showCart);
router.delete("/:id", auth, deleteCartItem)

module.exports = router;

