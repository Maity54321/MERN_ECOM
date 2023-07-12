const {productModel, validateProduct} = require('../models/productModels');
const ApiFeatures = require('../utils/apiFeatures');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { upload } = require('../middleware/multer');
const getDataUri = require('../utils/datUri');
const cloudinary = require("cloudinary")


// Create Product


exports.createProduct = async (req, res)=>{
    const product = new productModel(req.body);
    const {error} = new validateProduct(req.body);
    // product.images.img = req.file.path;
    // product.images.host = req.get('host')+'/'+req.file.path;

    const productImage = req.file;
    const imageUri = getDataUri(productImage);
    const cloudUpload = await cloudinary.v2.uploader.upload(imageUri.content, {folder:"Products Images"});
    product.images.imgId = cloudUpload.public_id;
    product.images.imgUrl = cloudUpload.secure_url;

    const token = req.header('Authorization');
    const decode = jwt.decode(token);
    product.images.myUser = decode._id;

    if(error) return res.status(403).send(error.details[0].message);
    try{
        const result = await product.save();
        res.status(200).send(result);
    }
    catch(err){
        res.status(403).send(err);
    }
}

// Get All Products

exports.viewProducts = async (req, res)=>{

    const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();

    const showProducts = await apiFeatures.query;

    if(showProducts.length === 0) return res.status(404).send("No Data found");
    res.status(200).send(showProducts);
}

// Get a Particular Product

exports.getProduct = async(req, res, next)=>{
    const product = await productModel.findById(req.params.id);

     try {
    if (!product)
      return res.status(500).json({
        success: false,
        message: "Product Not Found",
      });

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(201).json({
      error: error,
    });
  }
}

// Update Product

exports.updateProduct = async (req, res)=>{
    const {error} = new validateProduct(req.body);
    if(error) return res.status(403).send(error.details[0].message);
    const product = await productModel.findByIdAndUpdate(req.params.id, req.body,
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        });

        if(!product) res.status(404).send("Product Not Found");
        res.status(200).json({
            success:true,
            product
        });
}

// Delete Product

exports.deleteProduct = async (req, res)=>{
    // const image = await productModel.findById
    const products = await productModel.findById(req.params.id);
    // fs.unlink(products.images.img, (err)=>{
    //     // console.log(err);
    //     // console.log(products.images.img + "Deleted");
    // })
    const product = await productModel.findByIdAndRemove(req.params.id);
    if(!product) return res.status(404).send("Product Not Found");
    await cloudinary.v2.uploader.destroy(product.images.imgId, {invalidate:true})
    res.status(200).json({
        message:"Product Deleted",
        product
    });
}

// Create Product Ratings
exports.createProductRatings = async(req, res)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await productModel.findById(req.params.id);

    const isReviewed = product.reviews.find((rev) =>rev.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avge = 0;
    product.reviews.forEach((item)=>{
        avge += item.rating
    });
    product.ratings = avge/ product.reviews.length
    console.log(product.ratings);
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success:true,

    })

}

// Get all reviews of a Product

exports.getAllReviews = async(req, res)=>{
    const product = await productModel.findById(req.params.id);
    if(!product) return res.status(404).send("Product not Found");
    res.status(200).json({
        success:true,
        reviews: product.reviews
    });
}

// Delete a Review

exports.deleteReview = async(req, res)=>{
    const product = await productModel.findById(req.params.id);
    // const product = await productModel.findById(req.query.productId)
    if(!product) return res.status(404).send("Product Not Found");
    
    const reviews = product.reviews.filter((rev)=>rev._id.toString() !== req.query.id.toString());

    let avge = 0;
    product.reviews.forEach((item)=>{
        avge += item.rating
    });
    const ratings = product.ratings = avge/ reviews.length;
    const numOfReviews = product.numOfReviews = reviews.length;
    await productModel.findByIdAndUpdate(req.params.id, {
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
}
