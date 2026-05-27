const express = require('express');
const router = express.Router();
const productController = require('../../controllers/client/product.controller');

router.get('/', productController.list);
router.get('/search', productController.search);
router.get('/filter', productController.filter);
router.get('/:id', productController.detail);

module.exports = router;
