var express = require('express');
var router = express.Router();
var fs = require('fs');
var library = fs.readFileSync(__dirname + "/../public/videos/movies_data.json", "utf8")


router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: library });
});

module.exports = router;