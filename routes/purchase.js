const path = require('path');

const express = require('express');

const purchaseController = require('../controllers/purchase');

const userAuth = require('../middleware/auth');

const router = express.Router();

router.get('/purchase-membership', userAuth.authenticate, purchaseController.purchaseMembership);

router.post('/update-transaction-status', userAuth.authenticate, purchaseController.postPurchaseSuccess);

router.post('/failed-transaction', userAuth.authenticate, purchaseController.postPurchaseFail);

module.exports = router;