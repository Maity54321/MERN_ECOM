const { productModel } = require("../models/productModels");
const { orderModel } = require("../models/orderModel");

// Create order

exports.createOrder = async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  console.log(req.product);

  //   orderItems.name = req.product.name;
  //   orderItems.image = req.product.images.imgUrl;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).send({
    success: true,
    order,
  });
};

// Get a Single Order --Admin

exports.getSingleOrder = async (req, res) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("user", "name email");
  if (!order) return res.status(404).send("No order found with this user");
  res.status(200).json({
    success: true,
    order,
  });
};

// Get LoggedIn user order

exports.getUserOrder = async (req, res) => {
  const orders = await orderModel.find({ user: req.user._id });
  if (!orders) return res.status(404).send("No order found with this user");
  res.status(200).json({
    success: true,
    orders,
  });
};

// Get All Orders  --Admin

exports.getAllOrders = async (req, res) => {
  const orders = await orderModel.find().populate("user", "name email");
  if (!orders) return res.status(404).send("No Order Found");
  let totalAmount = 0;
  orders.forEach((price) => {
    totalAmount += price.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount: totalAmount,
  });
};

// Update Order Status  --Admin

exports.orderStatus = async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  order.orderStatus = req.body.status;
  if (order.orderStatus === "Delivered") {
    res.status(400).send("Order Already Delivered");
  }
  console.log(order.orderStatus);

  order.orderItems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  if (order.orderStatus === "Delivered") {
    order.deliverdAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
};

async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// Delete Order  --Admin

exports.deleteOrder = async (req, res) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) return res.status(404).send("No orders found with this id");
  await order.remove();

  res.status(200).json({
    success: true,
    deletedOrder: order,
  });
};
