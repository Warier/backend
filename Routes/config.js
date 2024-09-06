const express = require('express');
const router = express.Router();
const config = require("../Controllers/config")

router.get('/install', config.install);

router.get('/docs', (req, res) => {

});

module.exports = router;