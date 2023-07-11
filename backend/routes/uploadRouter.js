const express = require('express');
const { upload } = require('../middleware/multer');
const { validationUpload, uploadModel } = require('../models/uploadModel');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


const router = express.Router();

router.post('/', upload.single('u_file'), auth, async(req, res)=>{
    let data = req.body;
    data.img = req.file.path;
    data.host = req.get('host')+'/'+req.file.path;
    const token = req.header('Authorization');
    const decode = jwt.decode(token);
    console.log(decode);
    data.myUser = decode._id;
    const {error} = validationUpload(data);
    if(error) return res.status(403).send(error.details[0].message);
    const updata = new uploadModel(data);
    try{
        const result = await updata.save();
        res.send(result);
    }catch(err){
        res.status(403).send(err)
    }
});

router.get('/', async(req, res)=>{
    const view = await uploadModel.find();
    if(view.length === 0) return res.status(404).send("No data Found");
    res.status(200).send(view);
});

router.delete('/:id', [auth, admin], async(req, res)=>{
    const image = await uploadModel.findById(req.params.id)
    fs.unlink(image.img, (err)=>{
        console.log(err);
        console.log(image.img + "Deleted");
    });

    const deleteFile = await uploadModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
        success:true,
        deleteFile
    })
})
module.exports = router;