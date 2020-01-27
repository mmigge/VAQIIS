var express = require('express');
var router = express.Router();

var path = require('path');

router.use(express.static(path.join(__dirname, '../../client_stationary/build')));
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client_stationary/build', 'index.html'));
});

module.exports = router;
