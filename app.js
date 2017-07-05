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

app.use('/', index);
app.use('/cinema', cinema);
app.post('/torrent', torrent);
app.post('/torrent_magnet', function(req, res, next) {
    var validation = -1
    if (req.body.magnetURL.length != 0) {
        validation = 1
    }
    console.log(req.body.magnetURL);
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