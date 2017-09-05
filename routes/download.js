var express = require('express');
var router = express.Router();

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


router.post('/download', function(req, res, next) {
    var magnet = req.body.magnetURI;
    var client = req.app.client;
    var exists = 0;
    //Verify if the requested torrent is already being downloaded
    for (var i = 0; i < client.torrents.length; i++) {
        if (magnet.indexOf(client.torrents[i].infoHash) != -1) {
            torrent = client.torrents[i];
            exists = 1;
            res.status(200).send({ infoHash: torrent.infoHash });
            break;
        }
    }
    //If not then download it
    if (exists == 0) {
        //Download
        client.add(magnet, { path: __dirname + '/../public/videos/' }, function(torrent) {
                console.log('Downloading:', torrent.infoHash)
                res.status(200).send({ infoHash: torrent.infoHash });
            })
            //Error handling:
        client.on('error', function(err) {
            res.status(500).send('Error Downloading:' + err);
        })
    }
});

module.exports = router;