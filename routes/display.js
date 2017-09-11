var express = require('express');
var router = express.Router();

router.get('/:infohash/:index', function(req, res, next) {
    res.status(200).render('display');
});

module.exports = router;