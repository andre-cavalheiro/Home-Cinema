var express = require('express');
var router = express.Router();


router.get('/:index/:infohash', function(req, res, next) {
    var torrent = 'magnet:?xt=urn:btih:' + req.params.infohash;
    var client = req.app.client;
    try {
        var torrent = client.get(torrent);
        var file = torrent.files[req.params.index]

        console.log("Ficheiro escolhido: " + file.name);
        var total = file.length;
        if (typeof req.headers.range != 'undefined') {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
        } else {
            var start = 0;
            var end = total;
        }
        var stream = file.createReadStream({ start: start, end: end });
        var type = 'video/' + file.name.substring(file.name.length - 3, file.name.length);
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': type
        });
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;