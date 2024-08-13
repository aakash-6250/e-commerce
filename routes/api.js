const express = require('express');
const router = express.Router();
const { ApiError } = require('../middlewares/apiErrorHandler');
const apiController = require('../controllers/apiController');
const { multerMiddleware } = require('../utils/multer');

//          PRODUCTS          //

// GET /api/product
router.get('/product/', apiController.getProducts);

// GET /api/product/:id
router.get('/product/:id', apiController.getProductById);

// GET /api/product/:id/delete
router.get('/product/:id/delete', apiController.deleteProduct);

// POST /api/product
router.post('/product/', multerMiddleware.product, apiController.createProduct);

// POST /api/product/bulk
router.post('/product/bulk', multerMiddleware.excel, apiController.bulkUpload);



//          CATEGORIES          //

// GET /api/category
router.get('/category', apiController.getCategories);

// GET /api/category/:id
router.get('/category/:id', apiController.getCategoryById);



//          COMMON          //

// GET /api/login
router.post('/login', apiController.login);




//          USERS          //

// POST /api/register
router.post('/register', apiController.register);






function isLoggedInAdmin(req, res, next){
    if (!req.isAuthenticated() || req.user.role === 'admin') {
        return next();
    }
    throw new ApiError(403, 'You are not authorized to access this route.', 'error');
};

module.exports = router;
