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
var torrent_magnet = require('./routes/torrent_magnet');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use->Adiciona middleware ao nosso programa seja ele geral, ou especificado(ver pagina stackoverfow nos favoritos node.js)
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //extended=false --> req.body pode ser apenas string ou array
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //Qualquer request feito a qualquer pagina vai usar aquilo que temos na /public t.q: http://localhost:3000/images


app.use('/', index);
app.use('/watch', cinema);
app.post('/torrent', torrent);
app.post('/torrent_magnet', torrent_magnet)
app.get('/stream/:magnet', function(req, res, next) {
    try {
        //var torrent = client.get(req.params.magnet);
        var torrent = client.get("magnet:?xt=urn:btih:70da62aeeafb0f28efe27dcf171fd2b87b677b21&dn=Genius+S01E01+HDTV+x264-RMTeam&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969");
        var library = fs.readFileSync(__dirname + "/../public/videos/movies_data.json", "utf8")
            //Obter maior ficheiro
        var file;
        for (i = 0; i < torrent.files.length; i++) {
            if (!file || file.length < torrent.files[i].length) {
                file = torrent.files[i];
            }
        }
        console.log("Ficheiro selecionado: " + file.name);
        var total = file.length;

        if (typeof req.headers.range != 'undefined') {
            var range = req.headers.range;
            var parts = range.replace(/bytes=/, "").split("-");
            var partialstart = parts[0];
            var partialend = parts[1];
            var start = parseInt(partialstart, 10);
            var end = partialend ? parseInt(partialend, 10) : total - 1;
            var chunksize = (end - start) + 1;
        } else {
            var start = 0;
            var end = total;
        }

        var stream = file.createReadStream({ start: start, end: end });
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });
        stream.pipe(res);
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }

})


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