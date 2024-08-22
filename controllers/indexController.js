const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');
const { catchAsyncEjsErrors } = require('../middlewares/catchAsyncErrors');
let views = 0;
const indexController = {};


//                  CUSTOMER ROUTES CONTROLLER                  //

// GET /
indexController.index = catchAsyncEjsErrors(async (req, res, next) => {

    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );



    const featured = await Product.find({ featured: true, published: true })
        .sort({ updatedAt: -1 })
        .limit(8)
        .populate('category')
        .exec();

    const trending = await Product.find({ trending: true, published: true })

    res.render('index', { categories, featured, trending });

})

// GET /shop
indexController.shop = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('shop', { categories });
});

// GET /product/:id
indexController.product = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    const product = await Product.findById(req.params.id).populate('category subcategory');

    if (product) {
        product.views = product.views + 1;
        product.save();
    }

    res.render('product', { categories, product });
});

// GET /login
indexController.login = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('login', { categories });
});

// GET /register
indexController.register = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('register', { categories });
});

// GET /account
indexController.account = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('account',);
});

// GET /cart
indexController.cart = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('cart', { categories });
});

// GET /terms-of-use
indexController.terms = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('termsOfUse', { categories });
});

// GET /privacy-policy
indexController.privacy = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('privacyPolicy', { categories });
});

// GET /shipping-policy
indexController.shipping = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('shippingPolicy', { categories });
});

// GET /cookie-policy
indexController.cookie = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('cookiePolicy', { categories });
});

// GET /cancelation-refund-policy
indexController.cancelation = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('cancelationRefund', { categories });
});

// GET /contact
indexController.contact = catchAsyncEjsErrors(async (req, res, next) => {
    const categoriesWithFeaturedProducts = await Category.find({})
        .populate({
            path: 'subcategories',
            populate: {
                path: 'products',
                match: { published: true },
            }
        })
        .lean(); 

    const categories = categoriesWithFeaturedProducts.filter(category =>
        category.subcategories.some(subcategory =>
            subcategory.products && subcategory.products.length > 0
        )
    );

    res.render('contact', { categories });
});






module.exports = indexController;
