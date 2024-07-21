var express = require('express');
const Category = require('../models/category.model');
var router = express.Router();
const errorHandler = require('../middleware/errorHandler');

router.use(errorHandler);


router.get('/', async function (req, res, next) {
  try {
    const categories = await Category.find();

    res.render('index', { user: req.user, categories });
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
});

router.get('/shop', async function (req, res, next) {
  try {
    const categories = await Category.find();
    
    res.render('shop', { user: "", categories });
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
});

router.get('/login', isLogedOut, async function (req, res, next) {
  try {
    const categories = await Category.find();
    res.render('login', { user: "", categories });
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
});

router.get('/register', isLogedOut, async function (req, res, next) {
  try {
    const categories = await Category.find();

    res.render('register', { user: "", categories });
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
});

router.get('/account', isLoggedIn, async function (req, res, next) {
  try {
    const categories = await Category.find();

    res.render('account', { user: req.user, categories });
  } catch (error) {
    console.error(error);
    req.session.errorMessage = error.message;
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
  }
});

router.get('/logout', isLoggedIn, async function (req, res, next) {
  req.logout(()=> {
    req.session.errorMessage = "Logout successful.";
    req.session.messageType = "success";
    res.redirect('/');
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.errorMessage = "You need to login first";
  req.session.messageType = "error";
  res.redirect(req.headers.referer || '/');
}

function isLogedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  req.session.errorMessage = "You are already logged in.";
  req.session.messageType = "error";
  res.redirect(req.headers.referer || '/');
}

module.exports = router;
