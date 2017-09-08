var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');


var getLargestFile = function(torrent) {
    var file;
    var index;
    for (i = 0; i < torrent.files.length; i++) {
        if (!file || file.length < torrent.files[i].length) {
            file = torrent.files[i];
            index = i;
        }
    }
    return index;
};

router.get('/:infohash', function(req, res, next) {


    try {
        var client = req.app.client;
        var torrent = client.get(req.params.infohash)
        var index = getLargestFile(torrent);


        var command = ffmpeg('http://localhost:' + req.app.port + '/stream/' + index + '/' + req.params.infohash)
            .ffprobe(0, function(err, data) {
                res.send(data);
            });
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;