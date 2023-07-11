const express = require('express');
const { checksout, getKey, paymentVerification } = require('../controller/paymentController');


const router = express.Router();

router.post('/checkout', checksout);
router.post('/paymentverification', paymentVerification);
router.get('/getKey', getKey)

module.exports = router;