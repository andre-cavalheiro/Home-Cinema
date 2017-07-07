var express = require('express');
var router = express.Router();
var library = require("../public/videos/movies_data.json");

var concat = require('concat-stream')

/*magnet:?xt=urn:btih:70da62aeeafb0f28efe27dcf171fd2b87b677b21&dn=Genius+S01E01+HDTV+x264-RMTeam&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969*/

router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: library });
});

module.exports = router;