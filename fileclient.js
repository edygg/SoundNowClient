var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');
var app = express();
var http = require('http');
var fs = require('fs');
var randtoken = require('rand-token');
var cors = require('cors');

var config = require('./config');

var homeRouter = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//CORS
app.use(cors());

// Socket client

var socket = require('socket.io-client')(config.server_url, { query: 'type=fileclient&server_name=' +  config.name + "&client_url=" + config.client_url });

socket.on('connect', function() {
  console.log('Conectado al master');
});

socket.on('sendfile', function(file) {
  var token = randtoken.generate(16);
  fs.writeFile("dfs/" + token + '.' + file.file_ext, file.file_content, function(err) {
    if (err) {
      console.log(err); 
    } else  {
      console.log("Guardado con éxito.");
      socket.emit('filesaved', { url:config.client_url + token + '.' + file.file_ext, dataEntry: file.dataEntry });
    }
  });
});

//Routes

homeRouter.get('/music', function(req, res, next) {
  var trackPath = path.join(__dirname, '/dfs/01 Clocks.m4a');
  res.set({'Content-Type': 'audio/mpeg'});
  var readStream = fs.createReadStream(trackPath);
  readStream.pipe(res);
});

homeRouter.get('/:file_id', function (req, res, next) {
  fs.readFile('dfs/' + req.params.file_id, function(err, data) {
    if (err) {
      console.log(err);
      res.json({ status: 'error' });
    } else {
      res.json({ status: 'ok', file_content: data.toString() });
    }
  });
});

homeRouter.post('/:file_id', function(req, res, next) {
  fs.writeFile('dfs/' + req.params.file_id, req.body.file_content, function(err, data) {
    if (err) {
      console.log(err);
      res.json({ status: 'error' });
    } else {
      res.json({ status: 'ok' });
    }
  });
});

app.use('/', homeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.PORT || 3000;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
