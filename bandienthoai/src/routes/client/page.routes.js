const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/client/page.controller');

router.get('/about', pageController.about);

module.exports = router;
