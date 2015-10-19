'use strict';

var express   = require('express');
var router    = express.Router();


router.use('/local', require('./local'));

router.use('/facebook', require('./facebook'));



module.exports = router;
