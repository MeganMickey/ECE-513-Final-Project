var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');     // Parses JSON in body
const jwt = require('jwt-simple');

// Including the routers for use in the app.
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var physiciansRouter = require('./routes/physicians');
var patientsRouter = require('./routes/patients');
var readingsRouter = require('./routes/readings');






// // // // // // // // // // //
/* Set up mongoose connection */
// // // // // // // // // // //

// Include mongoose middleware
const mongoose = require("mongoose");

// Set up URL for the database.
const mongoDB = "mongodb://127.0.0.1/ece-513";

// Initiate the connection.
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Set db to the connection.
const db = mongoose.connection;

// Create an error if the database fails to set up.
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// // // // // // // // // // //
/* Finish mongoose connection */
// // // // // // // // // // //








var app = express();

// This is to enable cross-origin access
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/physicians', physiciansRouter);
app.use('/patients', patientsRouter);
app.use('/readings', readingsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
