var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');
var productsRouter = require('./routes/products');
var cartsRouter = require('./routes/carts');
var categoriesRouter = require('./routes/category');
const session = require('express-session')
require('dotenv').config()
const User = require('./models/user.model')
const passport = require('passport')
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/e-commerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "secret"
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/admin', adminsRouter)
app.use('/api/product', productsRouter)
app.use('/api/cart', cartsRouter)
app.use('/api/categories', categoriesRouter)

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
