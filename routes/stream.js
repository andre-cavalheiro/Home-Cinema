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
            console.log("Pedido com range");
            var range = req.headers.range;
            console.log("Range: " + range)
            var parts = range.replace(/bytes=/, "").split("-");
            console.log("Parts[0]: " + parts[0] + " Parts[1]: " + parts[1]);
            var partialstart = parts[0];
            var partialend = parts[1];
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            console.log("start: " + start + " end: " + end)
            var chunksize = (end - start) + 1;
            console.log("chunksize= " + chunksize);
        } else {
            /*Se o HTTP request não tiver um campo "range" então não é possível enviar apenas uma porção dos dados do server para 
            o client (nas experiências ainda nao ocorreu)*/
            console.log("Pedido sem range");
            var start = 0;
            var end = total;
        }
        var stream = file.createReadStream({ start: start, end: end });
        var type = 'video/' + file.name.substring(file.name.length - 3, file.name.length);
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;