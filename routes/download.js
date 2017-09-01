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
            exists = 1;
            torrent = client.torrents[i];
            var index = getLargestFile(torrent);
            var type = torrent.files[index].name.substring(torrent.files[index].name.length - 3, torrent.files[index].name.length);
            console.log(type)
            res.render('download', { state: 1, infohash: torrent.infoHash, index: index, type: type });
            break;
        }
    }
    //If not then download it
    if (exists == 0) {
        //Download
        client.add(magnet, { path: __dirname + '/../public/videos/' }, function(torrent) {
                console.log('Downloading:', torrent.infoHash)
                var index = getLargestFile(torrent);
                var type = torrent.files[index].name.substring(torrent.files[index].name.length - 3, torrent.files[index].name.length);
                console.log(type)
                    //Falta verificar se é o tipo de um video! E se não parar o download!
                res.render('download', { state: 1, infohash: torrent.infoHash, index: index, type: type });
            })
            //Error handling:
        client.on('error', function(err) {
            console.log("Error Downloading: ")
            res.render('download', { state: 0, infohash: "unavailable" });
        })
    }
});

module.exports = router;