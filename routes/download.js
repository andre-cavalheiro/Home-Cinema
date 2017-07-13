var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:infohash', function(req, res, next) {
      var magnet = 'magnet:?xt=urn:btih:' + req.params.infohash;
      var client = req.app.client;

      //Falta verificar se o torrent ja esta a ser baixado ou nao!
      try{
        client.add(magnet,{ path: __dirname + '/../public/videos/' }, function(torrent){
        console.log('Downloading:', torrent.infoHash)
        res.status(200).send('Added torrent!');
      })
    } catch (err) {
        res.status(500).send('>>Error: ' + err.toString());
    }
});

module.exports = router;
