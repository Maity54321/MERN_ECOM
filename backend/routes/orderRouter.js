const express = require("express");
const {
  createOrder,
  getUserOrder,
  getSingleOrder,
  getAllOrders,
  orderStatus,
  deleteOrder,
} = require("../controller/orderController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.post("/new", auth, createOrder);
router.get("/", auth, getUserOrder);
router.get("/singleOrder/:id", auth, getSingleOrder);
router.get("/allOrders", [auth, admin], getAllOrders);
router.put("/:id", [auth, admin], orderStatus);
router.delete("/:id", [auth, admin], deleteOrder);

module.exports = router;
