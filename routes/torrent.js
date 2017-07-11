var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');


//Variavel que verificará se o ficheiro é valido ou nao
var validation = -1;

//Configuração das opções de salvaguarda dos ficheiros:
var storageOpts = multer.diskStorage({
    destination: function(req, file, cb) {
        var dest = __dirname + "/../public/videos/torrent_files";
        cb(null, dest);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

//Configurações do uploud
var upload = multer({
    storage: storageOpts,
    limits: {
        fileSize: 256 * 1024 * 1024 //Alterar??
    },
    fileFilter: function(req, file, cb) {
        name = file.originalname;
        if ((name.substring(name.length - 8, name.length)) != ".torrent") {
            validation = 0;
            console.log("File rejected: " + (name.substring(name.length - 8, name.length)));
            cb(null, false);
        } else {
            validation = 1;
            console.log("File accepted");
            cb(null, true);
        }
    }
});


//Resposta ao POST request (uploud e render)
router.post('/torrent', upload.any(), function(req, res) {
    //console.log(req.files[0]);
    res.render('upload.ejs', { valid: validation });
});

module.exports = router;