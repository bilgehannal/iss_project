

const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose')
const expressWs = require('express-ws')(app);
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const cryptoRouter = require('./routes/crypto');
const imageRouter = require('./routes/image');
const socketRouter = require('./routes/socket');
const upload = require('express-fileupload');

const crypto = require('crypto');
var encryptor = require('file-encryptor');

// Database
mongoose.connect('mongodb://localhost/iss', { useNewUrlParser: true }).then(() => {
  console.log('mongo connection is active now');
}).catch((err) => {
  console.log('DB Error!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(upload())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', userRouter);
app.use('/', cryptoRouter);
app.use('/', imageRouter);
app.use('/', socketRouter);
//...

const md5File = require('md5-file/promise')
app.post('/helper/fileUpload', function(req, res) {
  if(req.files) {
    const file = req.files.image;
    // const filename = file.filename;
    console.log(file);
    file.mv("./upload/" + file.name, (err) => {
      if(err) {
        res.json({status: 0});
      } else {
        md5File("./upload/" + file.name).then(hash => {
          res.json({
            status: 1,
            extras: {
              hash: hash
            }
          });
        });
      }
    });
  }
});

app.get('/helper/filedownload', function(req, res) {
  const name = req.query.name;
  res.sendFile(__dirname + '/upload/'+name);
});

app.post('/helper/encryptFile', (req, res, next) => {
  const name = req.body.name;
  var key = req.body.key;
  encryptor.encryptFile('./upload/'+name, './upload/'+name+'1.dat', key, function(err) {
    if(err) {
      res.json({
        status:0
      });
    }
    res.json({
      status:1,
      extras: {
        fileName: name+ '1.dat',
      }
    });
  });
});

app.post('/helper/decryptFile', (req, res, next) => {
  const name = req.body.name;
  var key = req.body.key;
  console.log('heyy')
  console.log(req.body)
  encryptor.decryptFile('./upload/'+name, './upload/'+name+'2.png', key, function(err) {
    if(err) {
      res.json({
        status:0
      });
    }
    res.json({
      status:1,
      extras: {
        fileName: name+ '2.png',
      }
    });
  });
});


app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;