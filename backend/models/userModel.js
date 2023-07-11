const Joi = require("joi");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        public_id:{
            type:String,
            // required:true
        },
        url:{
            type:String,
            // required:true
        }
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const userModel = mongoose.model("User", userSchema);

function userValidation (user){
    const schema = Joi.object({
        name:Joi.string().regex(/^[a-z A-Z]*$/).messages({"string.pattern.base":"Only alphabates are allowed in Name"}).required(),
        email:Joi.string().email().required(),
        password:Joi.string().required(),
    });

    return schema.validate(user);
}

module.exports = {userModel, userValidation};