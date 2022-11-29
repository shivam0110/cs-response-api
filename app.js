/* Importing required pakages */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const config = require('config');
const mysql = require("mysql2/promise");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Importing various endpoint routes */
var Question = require('./routes/questionRouter');
var Response = require('./routes/responseRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Using the imported pakages. */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Using the imported routes */
app.use('/question', Question);
app.use('/response', Response);

app.use(function(req, res, next) {
/** catch 404 and forward to error handler */
  next(createError(404));
});

app.use(function(err, req, res, next) {
  /** Error handler, set locals, only providing error in development and render the error page */
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
