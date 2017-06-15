var express = require('express');
var router = express.Router();
var movie_library = require("../public/videos/movies_data.json");
var WebTorrent = require('webtorrent');
var concat = require('concat-stream')

var client = new WebTorrent();

var magnetURI = 'magnet:?xt=urn:btih:70da62aeeafb0f28efe27dcf171fd2b87b677b21&dn=Genius+S01E01+HDTV+x264-RMTeam&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969';

client.add(magnetURI, { path: '/tmp/' }, function(torrent) {
    console.log('Client is downloading:', torrent.infoHash)

    torrent.files.forEach(function(file) {
        file.appendTo('body');
        /*
        // Get the file data as a Buffer (Uint8Array typed array)
        file.createReadStream().pipe(concat(function(buf) {

            // Append a link to download the file
            var a = document.createElement('a')
            a.download = file.name
            a.href = URL.createObjectURL(new Blob([buf]))
            a.textContent = 'download ' + file.name
            document.body.appendChild(a)
        }))
         */

    });


    torrent.on('done', function() {
        console.log('torrent download finished:' + torrent.infoHash)
    })
})




/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index.ejs', { movies: movie_library });
});

module.exports = router;