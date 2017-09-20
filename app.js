var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webtorrent = require('webtorrent');
var rimraf = require('rimraf');

//Myroutes
var index = require('./routes/index');
var torrent = require('./routes/torrent');
var display = require('./routes/display');

var download = require('./routes/download');
var files = require('./routes/files');
var head = require('./routes/head');
var video = require('./routes/video');
var metadata = require('./routes/metadata');


var app = express();

//global varibles
app.port = 3000;
app.client = new webtorrent();
app.max_time = 60000 //1min  //3600000 // 1 hour
app.library = [{ infoHash: -1, time: -1, limit: -1 }]

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Answering requestes
app.use('/', index);
app.post('/download', download);
app.use('/torrent', torrent);
app.use('/display', display);
app.get('/boop/:infoHash', function(req, res) {
    var now = Date.now();
    for (i = 0; i < app.library.length; i++) {
        if (app.library[i].infoHash == req.params.infoHash) {
            app.library[i].time = now;
        }
    }
    res.status(200).send("Time uplouded");
})

app.use('/stream/head', head);
app.use('/stream/video', video)
app.use('/stream/metadata', metadata)
app.use('/stream/files', files);
app.use('/stream/remove/:infoHash', function(req, res) {
    var remove = app.removeTorrent(req.params.infoHash);
    if (remove == 1) {
        res.status(200).send("File removed")
    } else {
        res.status(500).send("Error deleting file")
    }
})


//Global functions
app.removeTorrent = function(infoHash) {
    var torrent = app.client.get(infoHash);
    try {
    rimraf(path.normalize(torrent.path + torrent.name), function(error) {
        console.log('Error: ', error);
    });
    for (i = 0; i < app.library.length; i++) {
        if (app.library[i].infoHash == infoHash) {
            app.library[i].infoHash = -1;
            app.library[i].time = -1;
            app.library[i].limit = -1;
        }
    }
    app.client.remove(infoHash);
    return 1;
  } catch (e) {
      console.log("Error while torrent was being removed");
      return 0;
  }
}

setInterval(function() {
    var now = Date.now();
    for (i = 0; i < app.library.length; i++) {
        //console.log(app.library)
        if (app.library[i].time > 0) {
            if ((now - app.library[i].time) > app.library[i].limit) {
                //console.log("Diff: " + (now - app.library[i].time))
                app.removeTorrent(app.library[i].infoHash);
            }
        }
    }
}, 1000);

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
