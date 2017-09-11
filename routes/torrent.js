var express = require('express');
var router = express.Router();

router.get('/:infoHash', function(req, res, next) {
    res.status(200).render('torrent');
});

module.exports = router;