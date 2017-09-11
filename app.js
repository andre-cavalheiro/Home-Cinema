var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webtorrent = require('webtorrent');

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

app.client = new webtorrent();
app.port = 3000;

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

app.use('/stream/head', head);
app.use('/stream/video', video)
app.use('/stream/metadata', metadata)
app.use('/stream/files', files);



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