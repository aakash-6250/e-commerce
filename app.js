var createError = require('http-errors');
var express = require('express');
var app = express();
require('dotenv').config()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const User = require('./models/user.model');
const passport = require('passport');
let indexRouter = require('./routes/index');
let adminsRouter = require('./routes/admin');
let apiRouter = require('./routes/api');
const localsMiddleware = require('./middlewares/localsMiddleware');


const { apiErrorHandler } = require('./middlewares/apiErrorHandler');
const ejsErrorHandler = require('./middlewares/ejsErrorHandler');
const generalErrorHandler = require('./middlewares/generalErrorHandler');

// Database connection
require('./models/database').connectDatabase();

// Logger
app.use(logger('tiny'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.SESSION_SECRET || 'default_secret', // Use an environment variable for the session secret
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Apply the user middleware
app.use(localsMiddleware);

// Routes
app.use('/', indexRouter);
app.use('/admin', adminsRouter);
app.use('/api', apiRouter);
// Uncomment and use these routes if needed
// app.use('/api/user', usersRouter);
// app.use('/api/product', productsRouter);
// app.use('/api/cart', cartsRouter);
// app.use('/api/categories', categoriesRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Use EJS error handler for non-API routes
app.use(ejsErrorHandler);

// Use API error handler for API routes
app.use(apiErrorHandler);

// Use general error handler as a fallback
app.use(generalErrorHandler);


module.exports = app;
