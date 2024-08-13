const { catchAsyncEjsErrors } = require('../middlewares/catchAsyncErrors');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');

const adminController = {};




//                  ADMIN ROUTES CONTROLLER                    //

// GET /admin/dashboard
adminController.index = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/dashboard');
});

// GET /admin/products
adminController.products = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/product/products');
});

// GET /admin/product/add
adminController.addProduct = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/product/addProduct');
});

// GET /admin/product/bulk-add
adminController.bulkAddProduct = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/product/bulkAddProduct');
});

// GET /admin/product/:id
// adminController.getProductById = catchAsyncEjsErrors(async (req, res, next) => {
//     const product = await Product.findById(req.params.id).exec();
//     res.render('admin/product/product', { product });
// });

// GET /admin/product/:id/edit
adminController.editProduct = catchAsyncEjsErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category subcategory');
    const categories = await Category.find();
    const subcategories = await Subcategory.find();
    res.render('admin/product/editProduct', { product, categories, subcategories });
});






module.exports = adminController;
