const express = require('express');
const router = express.Router();


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


router.get('/materials', (req, res) => {

});

router.post('/materials', (req, res) => {

});

router.put('/materials/:id', (req, res) => {

});

router.delete('/materials/:id', (req, res) => {

});

module.exports = router;