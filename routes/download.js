var express = require('express');
var router = express.Router();


router.post('/download', function(req, res, next) {
    var magnet = req.body.magnetURI;
    var client = req.app.client;
    var exists = 0;
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
                res.status(200).send({ infoHash: torrent.infoHash });
            })
            //Error handling:
        client.on('error', function(err) {
            res.status(500).send('Error Downloading:' + err);
        })
    }
});

module.exports = router;