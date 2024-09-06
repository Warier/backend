const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');


router.post('/register', authController.login)

router.post('/login', authController.login);


router.get('/users', (req, res) => {

});

router.put('/users/:id', (req, res) => {

});

router.delete('/users/:id', (req, res) => {

});


router.post('/users/admin', (req, res) => {

});

router.put('/users/:id/admin', (req, res) => {

});

module.exports = router;