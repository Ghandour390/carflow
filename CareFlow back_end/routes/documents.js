const express = require('express');
const router = express.Router();
const documentcontroller = require('../controller/DocumentController');
const verifyToken = require('../medlwers/verifyToken');
const isEmailConfirmed = require('../medlwers/isEmailConfirmed');

router.get('/', verifyToken, isEmailConfirmed, documentcontroller.getDocuments);

module.exports = router;