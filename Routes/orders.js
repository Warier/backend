const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth');
const materialController = require('../Controllers/material');
const ordersController = require('../Controllers/order');


router.post('/orders', authController.validateAccess, ordersController.createOrder);

router.get('/orders', authController.validateAccess, ordersController.getOrders);

router.get('/orders/:id', authController.validateAccess, ordersController.getOrderById);

router.put('/orders/:id', authController.validateAccess, ordersController.updateOrder);

router.delete('/orders/:id', authController.validateAccess, ordersController.deleteOrder);


router.post('/orders/:orderId/items', authController.validateAccess, ordersController.createItem);

router.put('/orders/:orderId/items/:itemId', authController.validateAccess, ordersController.updateItem);

router.delete('/orders/:orderId/items/:itemId', authController.validateAccess, ordersController.deleteItem);


router.get('/materials', authController.validateAccess, materialController.getAllMaterials);

router.post('/materials', authController.validateAccess, materialController.createMaterial);

router.put('/materials/:id', authController.validateAccess, materialController.updateMaterial);

router.delete('/materials/:id', authController.validateAccess, materialController.deleteMaterial);

router.get('/usedMaterials', authController.validateAccess, materialController.listMaterialsUsed);


module.exports = router;