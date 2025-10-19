const express = require('express');
const router = express.Router();
const documentcontroller = require('../controller/DocumentController');

router.get('/', documentcontroller.getDocuments);

module.exports = router;