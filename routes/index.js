var express = require('express');
var router = express.Router();
var library = require("../public/videos/movies_data.json");

var concat = require('concat-stream')



router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: library });
});

module.exports = router;