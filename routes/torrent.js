var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: '/tmp/' });

router.post('/torrent', upload.any(), function(req, res) {
    console.log(req.body, 'Body');
    console.log(req.files, 'files');
    res.end();
});

module.exports = router;