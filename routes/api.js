const express = require('express');
const router = express.Router();
const { ApiError } = require('../middlewares/apiErrorHandler');
const apiController = require('../controllers/apiController');
const { multerMiddleware } = require('../utils/multer');

//          PRODUCTS          //

// GET /api/product
router.get('/product/', apiController.getProductsByUser);

// GET /api/products-admin
router.get('/product-admin/', isLoggedInAdmin, apiController.getProductsByAdmin);

// GET /api/product/:id
router.get('/product/:id', apiController.getProductById);

// GET /api/product/:id/delete
router.delete('/product/:id', isLoggedInAdmin, apiController.deleteProduct);

// POST /api/product
router.post('/product/',isLoggedInAdmin, multerMiddleware.product, multerMiddleware.resizeProductImages, apiController.createProduct);

// PATCH /api/product/:id
router.patch('/product/:id',isLoggedInAdmin, multerMiddleware.product, multerMiddleware.resizeProductImages, apiController.updateProduct);

// POST /api/product/bulk
router.post('/product/bulk',isLoggedInAdmin, multerMiddleware.excel, apiController.bulkUpload);



//          CATEGORIES          //

// GET /api/category
router.get('/category', apiController.getCategories);

// GET /api/category/:id
router.get('/category/:id', apiController.getCategoryById);

// POST /api/category
router.post('/category',isLoggedInAdmin, apiController.createCategory);

// PATCH /api/category/:id
router.patch('/category/:id',isLoggedInAdmin, apiController.updateCategory);

// DELETE /api/category/:id
router.delete('/category/:id',isLoggedInAdmin, apiController.deleteCategory);



//          COMMON          //

// GET /api/login
router.post('/login', apiController.login);

// GET /api/delete
router.get('/delete',isLoggedInAdmin, apiController.deleteAllDocuments);

// GET /api/isloggedin
router.get('/loggedin', apiController.isLoggedIn);




//          USERS          //

// POST /api/register
router.post('/register', apiController.register);




//          Cart

router.post('/cart', apiController.syncCart);




function isLoggedInAdmin(req, res, next){
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    throw new ApiError(403, 'You are not authorized to access this route.', 'error');
};

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    throw new ApiError(403, 'You need to login first.', 'error');
}

module.exports = router;
