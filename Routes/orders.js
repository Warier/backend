const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const materialController = require('../Controllers/material');


router.post('/orders', (req, res) => {

});

router.get('/orders', (req, res) => {

});

router.get('/orders/:id', (req, res) => {

});

router.put('/orders/:id', (req, res) => {

});

router.delete('/orders/:id', (req, res) => {

});


router.post('/orders/:orderId/items', (req, res) => {

});

router.put('/orders/:orderId/items/:itemId', (req, res) => {

});

router.delete('/orders/:orderId/items/:itemId', (req, res) => {

});


router.get('/materials', authController.validateAccess, materialController.getAllMaterials)

router.post('/materials', authController.validateAccess, materialController.createMaterial);

router.put('/materials/:id', authController.validateAccess, materialController.updateMaterial);

router.delete('/materials/:id', authController.validateAccess, materialController.deleteMaterial);

module.exports = router;