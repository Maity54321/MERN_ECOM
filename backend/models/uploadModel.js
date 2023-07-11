const Joi = require('joi');
const mongoose = require('mongoose');


const uploadSchema = mongoose.Schema({
    description:String,
    img:String,
    host:String,
    myUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

const uploadModel = mongoose.model("Upload", uploadSchema);

function validationUpload(upd){
    const schema = Joi.object({
        description:Joi.string().required(),
        img:Joi.string().required(),
        host:Joi.string().required(),
        myUser:Joi.required()
    });

    return schema.validate(upd);
}

module.exports = {uploadModel, validationUpload}