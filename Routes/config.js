const express = require('express');
const router = express.Router();
const install = require("../Controllers/config")

router.get('/install', install);

router.get('/docs', (req, res) => {

});

module.exports = router;