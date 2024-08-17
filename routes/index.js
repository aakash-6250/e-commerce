var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

const Category = require('../models/category.model');

router.get('/', indexController.index);

router.get('/shop', indexController.shop);

router.get('/product/:id', indexController.product);

router.get('/login', indexController.login);

router.get('/register', indexController.register);

router.get('/account', indexController.account);

router.get('/cart', indexController.cart);

router.get('/terms-of-use', indexController.terms);

router.get('/privacy-policy', indexController.privacy);

router.get('/shipping-policy', indexController.shipping);

router.get('/cookie-policy', indexController.cookie)



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

function isLoggedInAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  req.session.errorMessage = "Unauthorized access. Admin only.";
  req.session.messageType = "error";
  res.redirect('/login');
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
