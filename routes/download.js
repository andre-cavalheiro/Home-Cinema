var express = require('express');
var router = express.Router();


router.post('/download', function(req, res, next) {
    var magnet = req.body.magnetURI;
    var client = req.app.client;
    var exists = 0;
    var now = Date.now();
    //Verify if the requested torrent is already being downloaded    
    if ((torrent = client.get(magnet)) != null) {
        exists = 1;
        res.status(200).send({ infoHash: torrent.infoHash });
    }
    //If not then download it
    if (exists == 0) {
        //Download
        client.add(magnet, { path: __dirname + '/../public/videos/' }, function(torrent) {
                console.log('Downloading:', torrent.infoHash)

                var index = -1;
                for (i = 0; i < req.app.library.length; i++) {
                    if (req.app.library[i].infoHash < 0) {
                        index = i;
                        break;
                    }
                }
                if (index < 0) {
                    req.app.library.push({ infoHash: torrent.infoHash, time: now, limit: req.app.max_time });
                } else {
                    req.app.library[i].infoHash = torrent.infoHash;
                    req.app.library[i].time = now;
                    req.app.library[i].limit = req.app.max_time;
                }
                res.status(200).send({ infoHash: torrent.infoHash });
            })
            //Error handling:
        client.on('error', function(err) {
            res.status(500).send('Error Downloading:' + err);
        })
    }
});

module.exports = router;