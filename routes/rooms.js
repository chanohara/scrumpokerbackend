var express = require('express');
var router = express.Router();

/* GET rooms */
router.get('/', function(req, res, next) {
  res.send('list of rooms');
});

/* GET single room */
router.get('/:roomId', function(req, res, next) {
  res.send(req.params.roomId);
});

module.exports = router;
