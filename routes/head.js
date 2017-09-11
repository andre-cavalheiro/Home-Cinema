var express = require('express');
var router = express.Router();


router.get('/:infohash/:index/', function(req, res, next) {
    var torrent = 'magnet:?xt=urn:btih:' + req.params.infohash;
    var client = req.app.client;
    try {
        var torrent = client.get(torrent);
        var file = torrent.files[req.params.index]
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
            /*Se o HTTP request não tiver um campo "range" então não é possível enviar apenas uma porção dos dados do server para 
            o client (nas experiências ainda nao ocorreu)*/
            var start = 0;
            var end = total;
            var chunksize = total;
        }
        var stream = file.createReadStream({ start: start, end: end });
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'application/octet-stream'
        });
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;