var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/download', function(req, res, next) {
      var magnet = req.body.magnetURI;
      var client = req.app.client;
      //Falta verificar se o torrent já esta a ser baixado ou nao!
      try{
        console.log("Iniciar proceso de Download");
        client.add(magnet,{ path: __dirname + '/../public/videos/' }, function(torrent){
            console.log('Downloading:', torrent.infoHash)
            res.render('download',{state: 1 , infohash:torrent.infoHash});
        })
      }catch (err) {
        //Falta resolver para quando o magnet não é valido!
        console.log("Error Downloading: ")
        res.render('download',{state: 0 , infohash:"unavailable"});
    }
});

module.exports = router;
