var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var movie_library = require("../public/videos/movies_data.json");



//Configuração das opções de salvaguarda dos ficheiros:
var storageOpts = multer.diskStorage({
    destination: function(req, file, cb) {
        var dest = __dirname + "/../public/videos/";
        cb(null, dest);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storageOpts,
    limits: {
        fileSize: 256 * 1024 * 1024 //Alterar??
    },
    fileFilter: function(req, file, cb) {
        name = file.originalname;
        console.log('Nome:' + file.originalname);
        if ((name.substring(name.length - 8, name.length)) != ".torrent") {
            console.log("File rejected: " + (name.substring(name.length - 8, name.length)));
            cb(null, false);
        } else {
            console.log("File accpted");
            cb(null, true);
        }
    }
});


//Resposta ao POST request
router.post('/torrent', upload.any(), function(req, res) {
    console.log(req.body, 'Body');
    console.log(req.files[0], 'files');
    res.end("File uploaded (maybe)");
});

module.exports = router;