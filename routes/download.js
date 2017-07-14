var express = require('express');
var router = express.Router();

var getLargestFile = function (torrent) {
    var file;
    var index;
    for(i = 0; i < torrent.files.length; i++) {
        if (!file || file.length < torrent.files[i].length) {
            file = torrent.files[i];
            index=i;
        }
    }
    return index;
};


router.post('/download', function(req, res, next) {
      var magnet = req.body.magnetURI;
      var client = req.app.client;
      //Falta verificar se o torrent já esta a ser baixado ou nao!
      try{
        console.log("Iniciar proceso de Download");
        client.add(magnet,{ path: __dirname + '/../public/videos/' }, function(torrent){
            console.log('Downloading:', torrent.infoHash)
            var index=getLargestFile(torrent);
            var type = torrent.files[index].name.substring(torrent.files[index].name.length-3,torrent.files[index].name.length);
            console.log(type)
            res.render('download',{state: 1 , infohash:torrent.infoHash,index:index,type:type});
        })
      }catch (err) {
        //Falta resolver para quando o magnet não é valido!
        console.log("Error Downloading: ")
        res.render('download',{state: 0 , infohash:"unavailable"});
    }
});

module.exports = router;
