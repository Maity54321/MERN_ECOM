const Joi = require('joi');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    ratings:{
        type:Number,
        default:0
    },
    // images:[{
    //     public_id:String,
    //     url:String,
    //     host:String
    // }],
    images:{
        description:String,
        imgId:String,
        imgUrl:String,
        myUser:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            name:String,
            rating:Number,
            comment:String
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const productModel = mongoose.model("Product", productSchema);

function validateProduct(product){
    const schema = Joi.object({
        // name:Joi.string().regex(/^[a-z A-Z]*$/).messages({"string.pattern.base":"Only Alphabates are allowed in Name"}).required(),
        name:Joi.string(),
        description:Joi.string(),
        price:Joi.number().integer().min(1),
        rating:Joi.number(),
        // images:[{
        //     public_id:Joi.string().required(),
        //     url:Joi.string().required(),
        //     host:Joi.string().required()
        // }],
        images:Joi.object({
            description:Joi.string().required(),
        img:Joi.string().required(),
        host:Joi.string().required(),
        myUser:Joi.required()
        }),
        category:Joi.string(),
        stock:Joi.number(),
        numOfReviews:Joi.number(),
        reviews:[{
            name:Joi.string().regex(/^[a-z A-Z]*$/).messages({"string.pattern.base":"Only alphabates are allowed in Name"}),
            rating:Joi.number(),
            comment:Joi.string()
        }]
    });

    return schema.validate(product);
}

module.exports = {productModel, validateProduct};