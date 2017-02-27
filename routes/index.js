var express = require('express');
var router = express.Router();
var movie_library = require("../public/videos/movies_data.json");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: movie_library });
});

module.exports = router;

//      document.getElementById('form_id').action;