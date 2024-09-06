const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const userController = require('../Controllers/user');


router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/users', authController.validateAccess , userController.listUser);

router.put('/users/:id', authController.validateAccess , userController.updateUser)

router.delete('/users/:id', authController.validateAccess , userController.deleteUser);


router.post('/users/admin', authController.validateAccess , userController.createAdmin);

router.put('/users/:id/admin', authController.validateAccess , userController.promoteUser);

module.exports = router;