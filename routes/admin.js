var express = require('express');
var router = express.Router();
const { catchAsyncEjsErrors } = require('../middlewares/catchAsyncErrors');
const adminController = require('../controllers/adminController');
const sitemapMiddleware = require('../middlewares/sitemapMiddleware');

router.use((req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    
    res.status(403).render('error', { 
        message: 'Unauthorized access. Admin only.', 
        status: "403",
        redirect: '/login'
    });

});

router.use(sitemapMiddleware);


router.get('/', adminController.index);

router.get('/products', adminController.products);

router.get('/product/add', adminController.addProduct);

router.get('/product/bulk-add', adminController.bulkAddProduct);

router.get('/product/:id/edit', adminController.editProduct);

router.get('/categories', adminController.categories);

router.get('/category/add', adminController.addCategory);

router.get('/category/:id/edit', adminController.editCategory);



router.get('/logout', async function (req, res, next) {
    req.logout(() => {
        req.session.errorMessage = "Logout successful.";
        req.session.messageType = "success";
        res.redirect('/');
    });
});









module.exports = router;
