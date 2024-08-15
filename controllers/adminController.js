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
    const categories = await Category.find();

    res.render('admin/product/addProduct' , { categories });
});

// GET /admin/product/bulk-add
adminController.bulkAddProduct = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/product/addProductExcel');
});

// GET /admin/product/:id/edit
adminController.editProduct = catchAsyncEjsErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category subcategory');
    const categories = await Category.find();
    res.render('admin/product/editProduct', { product, categories });
});

// GET /admin/category
adminController.categories = catchAsyncEjsErrors(async (req, res, next) => {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: 'category',
                as: 'subcategories'
            }
        },
        // Step 2: Add a field to count the number of subcategories
        {
            $addFields: {
                num_subcategories: { $size: '$subcategories' }
            }
        },
        // Step 3: Unwind subcategories for product lookup
        { $unwind: { path: '$subcategories', preserveNullAndEmptyArrays: true } },
        // Step 4: Lookup products for each subcategory
        {
            $lookup: {
                from: 'products',
                localField: 'subcategories.products',
                foreignField: '_id',
                as: 'products'
            }
        },
        // Step 5: Group by category to count the number of products
        {
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                num_subcategories: { $first: '$num_subcategories' },
                num_products: { $sum: { $size: '$products' } }
            }
        },
        // Step 6: Project the desired fields
        {
            $project: {
                _id: 1,
                name: 1,
                num_subcategories: 1,
                num_products: 1
            }
        }
    ]);
    
    
    res.render('admin/category/categories', { categories });
});

// GET /admin/category/add
adminController.addCategory = catchAsyncEjsErrors(async (req, res, next) => {
    res.render('admin/category/addCategory');
});

// GET /admin/category/:id/edit
adminController.editCategory = catchAsyncEjsErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate('subcategories');

    res.render('admin/category/editCategory', { category });
});






module.exports = adminController;
