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

var socket = require('socket.io-client')(config.server_url + "/", { query: 'type=fileclient&server_name=' +  config.name + "&client_url=" + config.client_url });

socket.on('connect', function() {
  console.log('Connected to master');
});

socket.on('sendfile', function(file) {
  var token = randtoken.generate(16);
  var filePath = "dfs/" + token + '.' + file.file_ext;

  fs.writeFile(filePath, file.file_content, { encoding: 'binary' }, function(err) {
    if (err) {
      console.log(err);
    } else  {
      console.log("File saved. Name: <" + filePath + ">.");
      var fileURL = config.client_url + "/music/" + token + '.' + file.file_ext;
      socket.emit('filesaved', { url: fileURL, songId: file.songId });
    }
  });
});

//Routes

homeRouter.get('/music/:file', function(req, res, next) {
  var trackPath = path.join(__dirname, '/dfs/' + req.params.file);
  res.set({'Content-Type': 'audio/mpeg'});
  var readStream = fs.createReadStream(trackPath);
  readStream.pipe(res);
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
