var express = require('express');
var router = express.Router();
var library = require("../public/videos/movies_data.json");

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    res.render('cinema', { movie: library.library[req.params.id - 1] });
});

module.exports = router;