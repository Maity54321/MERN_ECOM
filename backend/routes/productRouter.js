const express = require('express');
const auth = require('../middleware/auth');
const { createProduct, viewProducts, updateProduct, deleteProduct, getProduct, createProductRatings, getAllReviews, deleteReview } = require('../controller/productController');
const admin = require('../middleware/admin');
const { upload } = require('../middleware/multer');
const { productUpload } = require('../middleware/profileMulter');

const router = express.Router();

router.post('/', productUpload, auth, createProduct);

router.get('/', viewProducts);

router.get('/:id', getProduct);

router.put('/:id',  updateProduct);

router.delete('/:id', auth, deleteProduct);

router.put('/review/:id', auth, createProductRatings);

router.get('/review/:id', getAllReviews);

router.delete('/review/:id', auth, deleteReview);

module.exports = router;