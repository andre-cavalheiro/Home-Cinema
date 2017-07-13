var express = require('express');
var router = express.Router();

var getLargestFile = function (torrent) {
    var file;
    for(i = 0; i < torrent.files.length; i++) {
        if (!file || file.length < torrent.files[i].length) {
            file = torrent.files[i];
        }
    }
    return file;
};


/* GET home page. */
router.get('/:infohash.mkv', function(req, res, next) {
    console.log(req.params.infohash);
    var torrent = 'magnet:?xt=urn:btih:' + req.params.infohash;
    var client = req.app.client;
    try {
        var torrent = client.get(torrent);
        var file = getLargestFile(torrent);
        var total = file.length;
        if(typeof req.headers.range != 'undefined') {
          console.log("Here first");
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
        } else {
            var start = 0; var end = total;
            console.log("OR here first")
        }
        console.log("And finally here")
        var stream = file.createReadStream({start: start, end: end});
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length':
chunksize, 'Content-Type': 'video/mkv' });
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;
