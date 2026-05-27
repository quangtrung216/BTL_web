const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/auth.controller');
const { requireAuth } = require('../../middlewares/auth.middleware');

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/register', authController.showRegister);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/change-password', requireAuth, authController.showChangePassword);
router.post('/change-password', requireAuth, authController.changePassword);

module.exports = router;
