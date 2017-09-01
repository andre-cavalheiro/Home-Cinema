var express = require('express');
var router = express.Router();

const ExtraTorrentAPI = require('extratorrent-api').Website;

const extraTorrentAPI = new ExtraTorrentAPI();

router.post('/search', function(req, res, next) {
    extraTorrentAPI.search("game")
        .then(res => console.log(res))
        .catch(err => console.error(err));
});
module.exports = router;