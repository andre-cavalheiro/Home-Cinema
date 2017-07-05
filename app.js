var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

//Myroutes
var index = require('./routes/index');
var cinema = require('./routes/cinema');
var torrent = require('./routes/torrent');
var download = require('./routes/download');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //extended=false --> req.body pode ser apenas string ou array
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //Qualquer request feito a qualquer pagina ESTÁTICA(static) vai usar aquilo que temos na /public

//------------------------------------------------------------------
/*
var library = require("./public/videos/movies_data.json");
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

eventEmitter.on('download', function(torrent_id) {

    var client = new WebTorrent();

    client.add(torrent_id, { path: __dirname + '/public/videos/movies' }, function(torrent) {

        console.log('Client is downloading:', torrent.infoHash)

        torrent.on('done', function() {
            console.log('torrent download finished:' + torrent.infoHash)
            fs.readFile(__dirname + "/public/videos/movies_data.json", 'utf8', function(err, data) {
                if (err) {
                    console.log('Error: ' + err);
                }
                var n_library = JSON.parse(data);
                n_library.amount++;
                n_library['library'].push({ "id": n_library.amount - 1, "name": "demo", "date": getDateTime(), "magnet": torrent.URI, "size": torrent.downloaded, "path": torrent.path })
                fs.writeFile(__dirname + "/public/videos/movies_data.json", JSON.stringify(n_library), 'utf8', function(err) {
                    if (err) throw err;
                    console.log('Ficheiro actualizado');
                });
            })
        })
    })

})
*/
//-------------------------------------------------------------------


app.use('/', index);
app.use('/cinema', cinema);
app.post('/torrent', torrent);
app.post('/torrent_magnet', function(req, res, next) {
    var validation = -1
    if (req.body.magnetURL.length != 0) {
        validation = 1
        download.download(req.body.magnetURL);
    }
    res.render('upload.ejs', { valid: validation });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;