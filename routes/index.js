var express = require('express');
var router = express.Router();
const indexController = require('../controllers/indexController');

const Category = require('../models/category.model');

router.get('/', indexController.index);

router.get('/products', indexController.shop);

router.get('/product/:id', indexController.product);

router.get('/login', isLogedOut, indexController.login);

router.get('/register',isLogedOut, indexController.register);

router.get('/account', isLoggedIn, indexController.account);

router.get('/contact', indexController.contact);

router.get('/cart', indexController.cart);

router.get('/terms-and-conditions', indexController.terms);

router.get('/privacy-policy', indexController.privacy);

router.get('/shipping-policy', indexController.shipping);

router.get('/cookie-policy', indexController.cookie)

router.get('/cancelation-and-refund', indexController.cancelation);

router.get('/address',isLoggedIn, indexController.address);

router.get('/shipping', indexController.shippingOptions);




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

  res.redirect('/');
  
}

function isLogedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
  
}

module.exports = router;
