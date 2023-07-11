const Joi = require("joi");
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    myUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    cartItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true
            }
        }
    ]
})

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = {cartModel}