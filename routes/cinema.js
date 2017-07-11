var express = require('express');
var fs = require('fs');
var router = express.Router();

var library = fs.readFileSync(__dirname + "/../public/videos/movies_data.json", "utf8")

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    res.render('cinema', { movie: library.library[req.params.id - 1] });
});

module.exports = router;