var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/', adminController.index);

router.get('/products', adminController.products);

router.get('/product/add', adminController.addProduct);

router.get('/product/bulk-add', adminController.bulkAddProduct);

router.get('/product/:id/edit', adminController.editProduct);



router.get('/logout', async function (req, res, next) {
    req.logout(() => {
        req.session.errorMessage = "Logout successful.";
        req.session.messageType = "success";
        res.redirect('/');
    });
});




// router.get('/admin/dashboard', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         res.render('admin/dashboard', { user: req.user });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });

// router.get('/admin/products/', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         res.render('admin/product/products', { user: req.user });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });

// router.get('/admin/product/add', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         res.render('admin/product/addProduct', { user: req.user });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });

// router.get('/admin/product/bulk-add', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         res.render('admin/product/addProductExcel', { user: req.user });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });

// router.get('/admin/category/add', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         const categories = await Category.find();
//         res.render('admin/category/addCategory', { user: req.user, categories });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });

// router.get('/admin/categories', isLoggedInAdmin, async (req, res, next) => {
//     try {
//         res.render('admin/category/categories', { user: req.user });
//     } catch (error) {
//         console.error(error);
//         req.session.errorMessage = error.message;
//         req.session.messageType = "error";
//         res.redirect(req.headers.referer || '/');
//     }
// });




module.exports = router;
