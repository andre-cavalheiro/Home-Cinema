var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var webtorrent = require('webtorrent');

//Myroutes
var index = require('./routes/index');
var download = require('./routes/download');
var display = require('./routes/display');
var stream = require('./routes/stream');

var app = express();

app.client = new webtorrent();


// Allow Cross-Origin requests
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  //extended=false --> req.body pode ser apenas string ou array
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  //Qualquer request feito a qualquer pagina vai usar aquilo que temos na /public t.q: http://localhost:3000/images



app.use('/', index);
app.use('/download', download);
app.use('/display',display);
app.use('/stream',stream);


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
