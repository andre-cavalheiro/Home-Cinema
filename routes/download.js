var express = require('express');
var fs = require('fs');


var library = require("../public/videos/movies_data.json");
var WebTorrent = require('webtorrent');


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

module.exports = {

    download: function(torrent_id) {

        var client = new WebTorrent();
        var id;

        client.add(torrent_id, { path: __dirname + '/../public/videos/movies' }, function(torrent) {

            console.log('Downloading:', torrent.infoHash)
                //Actualizar ficheiro de filmes
            fs.readFile(__dirname + "/../public/videos/movies_data.json", 'utf8', function(err, data) {
                var n_library = JSON.parse(data);
                n_library.amount++;
                id = library.amount;
                n_library.library.push({ "id": n_library.amount, "name": "demo", "date": getDateTime(), "magnet": torrent.URI, "size": "downloading...", "path": torrent.path })
                fs.writeFile(__dirname + "/../public/videos/movies_data.json", JSON.stringify(n_library), 'utf8', function(err) {
                    if (err) throw err;
                });
            })

            torrent.on('done', function() {
                console.log('torrent download finished:' + torrent.infoHash)
                    //Guardar tamanho do torrent no ficheiro de filmes
                fs.readFile(__dirname + "/../public/videos/movies_data.json", 'utf8', function(err, data) {
                    var n_library = JSON.parse(data);
                    n_library.library[id].size = torrent.downloaded;
                    fs.writeFile(__dirname + "/../public/videos/movies_data.json", JSON.stringify(n_library), 'utf8', function(err) {
                        if (err) throw err;
                    });
                })

            })
        })

    }

}