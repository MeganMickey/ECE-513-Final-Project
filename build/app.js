// // // // // // // // // // /
/* Include general libraries */
// // // // // // // // // // /
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// // // // // // // // /
/* Include other files */
// // // // // // // // /
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

var app = express();


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




// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view options', {
    layout: false
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) { // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
