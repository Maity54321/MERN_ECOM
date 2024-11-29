const { cartModel } = require("../models/cartModel");
// const { productModel } = require("../models/productModels");

// Create a cart for User

exports.createCart = async (req, res) => {
  const isCart = await cartModel.findOne({ myUser: req.user._id });
  // console.log(isCart);
  if (isCart) {
    const isItem = isCart.cartItems.find(
      (item) => item.product == req.body.cartItems.product
    );
    // console.log(isItem);
    if (isItem) {
      const updateItem = await cartModel.findOneAndUpdate(
        {
          myUser: req.user._id,
          "cartItems.product": req.body.cartItems.product,
        },
        {
          $set: {
            "cartItems.$": {
              ...req.body.cartItems,
              quantity: isItem.quantity + req.body.cartItems.quantity,
            },
          },
        }
      );
      // console.log(updateItem);
      res.status(200).json("Cart Updated");
    } else {
      const updateCart = await cartModel.findOneAndUpdate(
        { myUser: req.user._id },
        {
          $push: {
            cartItems: req.body.cartItems,
          },
        }
      );
      res.status(200).json({ cart: updateCart });
    }
  } else {
    const cart = new cartModel();
    cart.myUser = req.user._id;
    cart.cartItems = [req.body.cartItems];
    console.log(cart.myUser);
    await cart.save(cart);
    res.status(200).send(cart);
  }
};

// Get Cart of the User

exports.showCart = async (req, res) => {
  const cart = await cartModel.find({ myUser: req.user._id }).populate({
    path: "cartItems",
    populate: {
      path: "product",
    },
  });
  if (cart.length === 0) return res.status(404).send("Your Cart is Empty");
  res.status(200).send(cart);
};

// Delete Cart item

exports.deleteCartItem = async (req, res) => {
  const cart = await cartModel.findOne({ myUser: req.user._id });
  // const item = cart.cartItems.map((item) => item.product);
  // const isItem = cart.cartItems.find((item) => item.product == req.params.id);

  const del = await cartModel.findOneAndUpdate(
    { myUser: req.user._id },
    {
      $pull: {
        cartItems: { _id: req.params.id },
      },
    }
  );

  // console.log(del);
  res.send({ ind: del });
};
