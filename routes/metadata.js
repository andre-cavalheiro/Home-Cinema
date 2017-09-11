var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');


router.get('/:infohash/:index', function(req, res, next) {
    try {
        var client = req.app.client;
        var torrent = client.get(req.params.infohash)
        var index = req.params.index;
        var command = ffmpeg('http://localhost:' + req.app.port + '/stream/head/' + req.params.infohash + '/' + index)
            .ffprobe(0, function(err, data) {
                console.log(data)
                res.send(data);
            });
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;