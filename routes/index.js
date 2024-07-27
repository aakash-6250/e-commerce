var express = require('express');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
var router = express.Router();
const errorHandler = require('../middleware/errorHandler');

router.use(errorHandler);

let views = 0;


router.get('/', async function (req, res, next) {
  try {
    const categories = await Category.find();
    const featured = await Product.find({ featured: true})
    .sort({ updatedAt: -1 })
    .limit(8)
    .populate('category')
    .exec();

    console.log('views :', views++)

    res.render('index', { user: req.user, categories, featured });
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
    
    res.render('shop', { user: "", categories:"" });
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



// admin routes

router.get('/admin/dashboard', isLoggedInAdmin, async (req, res, next) => {
  try {
      res.render('admin/dashboard', { user: req.user });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      req.session.messageType = "error";
      res.redirect(req.headers.referer || '/');
  }
});

router.get('/admin/products/', isLoggedInAdmin, async (req, res, next) => {
  try {
      res.render('admin/product/products', { user: req.user });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      req.session.messageType = "error";
      res.redirect(req.headers.referer || '/');
  }
});

router.get('/admin/product/add', isLoggedInAdmin, async (req, res, next) => {
  try {
      res.render('admin/product/addProduct', { user: req.user });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      req.session.messageType = "error";
      res.redirect(req.headers.referer || '/');
  }
});

router.get('/admin/product/bulk-add', isLoggedInAdmin, async (req, res, next) => {
  try {
      res.render('admin/product/addProductExcel', { user: req.user });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      req.session.messageType = "error";
      res.redirect(req.headers.referer || '/');
  }
});

router.get('/admin/category/add', isLoggedInAdmin, async (req, res, next) => {
  try {
      const categories = await Category.find();
      res.render('admin/category/addCategory', { user: req.user, categories });
  } catch (error) {
      console.error(error);
      req.session.errorMessage = error.message;
      req.session.messageType = "error";
      res.redirect(req.headers.referer || '/');
  }
});

router.get('/admin/categories', isLoggedInAdmin, async (req, res, next) => {
  try {
      res.render('admin/category/categories', { user: req.user });
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

function isLoggedInAdmin(req, res, next) {
  if (!req.isAuthenticated() || req.user.role === 'admin') {
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
