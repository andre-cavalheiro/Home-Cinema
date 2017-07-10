var express = require('express');
var router = express.Router();
var fs = require('fs');
var WebTorrent = require('webtorrent');
var library = require("../public/videos/movies_data.json");
var download = require('./download');



function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}



router.post('/torrent_magnet', function(req, res, next) {
    var validation = -1;
    if (req.body.magnetURL.length != 0) {
        validation = 1;
    }

    var client = new WebTorrent();
    var id = library.amount + 1;

    torrent_id = req.body.magnetURL;

    client.add(torrent_id, { path: __dirname + '/../public/videos/movies' }, function(torrent) {

        console.log('Downloading:', torrent.infoHash)

        //Seleção do filme:
        var index = [-1];
        var n = 0;
        var movie_index = 0;
        console.log("FICHEIROS:")
        for (var i = 0; i < torrent.files.length; i++) {
            name = torrent.files[i].name;
            console.log(name)
            if ((name.substring(name.length - 4, name.length)) == "mp4" || (name.substring(name.length - 4, name.length)) == ".mkv" || (name.substring(name.length - 4, name.length)) == ".webm" || (name.substring(name.length - 4, name.length)) == ".avi") {
                index[n] = i;
                n++;

            }
        }
        //Assumir que o maior ficheiro de video dentro da diretoria é o filme que pretendemos:
        if (index[0] >= 0) {
            movie_index = 0
            for (var i = 0; i < index.length; i++) {
                if (torrent.files[movie_index].length < torrent.files[index[i]].length) {
                    movie_index = index[i];
                }
            }
            console.log("Ficheiro selecionado: " + torrent.files[movie_index].name)
                //Streaming
            console.log("Initiating Streaming...")
            movieStream = torrent.files[movie_index].createReadStream();
            /*
            movieStream.on('open', function() {
                res.writeHead(206, {
                    "Content-Range": "bytes " + 0 + "-" + torrent.files[movie_index].length + "/" + torrent.files[movie_index].length,
                    "Accept-Ranges": "bytes",
                    "Content-Length": torrent.files[movie_index].length,
                    "Content-Type": "video/mp4"
                });
                // This just pipes the read stream to the response object (which goes 
                //to the client)
                movieStream.pipe(res);
                console.log(res.movieStream);
                */
            var path = "/videos/movies/" + torrent.files[movie_index].path;
            path = path.replace(/ /g, '%20')
            console.log("path: " + path)
            res.render('upload.ejs', { valid: validation, file: path });


            movieStream.on('error', function(err) {
                res.end(err);
            });
        } else {

        }

        torrent.on('done', function() {
            console.log('torrent download finished:' + torrent.infoHash)
                //Actualizar ficheiro de filmes
            fs.readFile(__dirname + "/../public/videos/movies_data.json", 'utf8', function(err, data) {
                var n_library = JSON.parse(data);
                n_library.amount++;
                n_library.library.push({ "id": n_library.amount, "name": torrent.files[movie_index].name, "date": getDateTime(), "magnet": torrent.URI, "size": torrent.downloaded, "path": torrent.path })
                fs.writeFile(__dirname + "/../public/videos/movies_data.json", JSON.stringify(n_library), 'utf8', function(err) {
                    if (err) throw err;
                });
            })
        })
    })



});


module.exports = router;