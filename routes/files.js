var express = require('express');
var router = express.Router();

router.get('/:infoHash', function(req, res, next) {
    try {
        var torrent = req.app.client.get(req.params.infoHash);
        var files = []
        for (i = 0; i < torrent.files.length; i++) {
            files[i] = torrent.files[i].name;
        }
        res.status(200).send({ title: torrent.name, files: files });
    } catch (err) {
        console.log("Error while submiting files " + err)
        res.status(500).send('Error: ' + err.toString());
    }

});

module.exports = router;
