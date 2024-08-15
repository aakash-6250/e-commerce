const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');
const { catchAsyncEjsErrors } = require('../middlewares/catchAsyncErrors');
let views = 0;
const indexController = {};


//                  CUSTOMER ROUTES CONTROLLER                  //

// GET /
indexController.index = catchAsyncEjsErrors(async (req, res, next) => {
    const categories = await Category.find().populate('subcategories').exec();
    const featured = await Product.find({ featured: true })
        .sort({ updatedAt: -1 })
        .limit(8)
        .populate('category')
        .exec();

    res.render('index', { categories, featured });
})

// GET /shop
indexController.shop = catchAsyncEjsErrors(async (req, res, next) => {
    const categories = await Category.find().populate('subcategories').exec();

    res.render('shop', { categories });
});

// GET /product/:id
indexController.product = catchAsyncEjsErrors(async (req, res, next) => {
    const categories = await Category.find().populate('subcategories').exec();
    const product = await Product.findById(req.params.id).populate('category subcategory');

    if (product) {
        product.views = product.views + 1;
        product.save();
    }

    res.render('product', { categories, product });
});

// GET /login
indexController.login = catchAsyncEjsErrors(async (req, res, next) =>{
    const categories = await Category.find().populate('subcategories').exec();

    res.render('login', { categories });
});

// GET /register
indexController.register = catchAsyncEjsErrors(async (req, res, next) =>{
    const categories = await Category.find().populate('subcategories').exec();

    res.render('register', { categories });
});

// GET /account
indexController.account = catchAsyncEjsErrors(async (req, res, next) =>{
    const categories = await Category.find().populate('subcategories').exec();

    res.render('account',);
});







module.exports = indexController;
