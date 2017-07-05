var express = require('express');
var fs = require('fs');
var router = express.Router();
var library = require("../public/videos/movies_data.json");
var WebTorrent = require('webtorrent');
var concat = require('concat-stream')

var client = new WebTorrent();
var magnetURI = 'magnet:?xt=urn:btih:70da62aeeafb0f28efe27dcf171fd2b87b677b21&dn=Genius+S01E01+HDTV+x264-RMTeam&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969';

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

client.add(magnetURI, { path: __dirname + '/../public/videos/movies' }, function(torrent) {
    console.log('Client is downloading:', torrent.infoHash)
    torrent.on('done', function() {
        console.log('torrent download finished:' + torrent.infoHash)
        fs.readFile(__dirname + "/../public/videos/movies_data.json", 'utf8', function(err, data) {
            if (err) {
                console.log('Error: ' + err);
            }
            var n_library = JSON.parse(data);
            n_library.amount++;
            n_library['library'].push({ "id": n_library.amount - 1, "name": "demo", "date": getDateTime(), "magnet": torrent.URI, "size": torrent.downloaded, "path": torrent.path })
            fs.writeFile(__dirname + "/../public/videos/movies_data.json", JSON.stringify(n_library), 'utf8', function(err) {
                if (err) throw err;
                console.log('Ficheiro actualizado');
            });
        })
    })
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: library });
});

module.exports = router;