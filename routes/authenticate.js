var express = require('express');
var router = express.Router();

/* GET authentication form. */
router.get('/', function(req, res, next) {
  res.render('authenticate', { title: 'Authentication' });
});

module.exports = router;
