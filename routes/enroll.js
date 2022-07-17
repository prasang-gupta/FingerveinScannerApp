var express = require('express');
var router = express.Router();

/* GET Enrollment Form. */
router.get('/', function(req, res, next) {
  res.render('enroll', { title: 'Enrollment' });
});

module.exports = router;
