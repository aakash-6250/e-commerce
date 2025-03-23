const Category = require('../models/category.model');
const User = require('../models/user.model');
const Address = require('../models/address.model');
const Cart = require('../models/cart.model')
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

    res.render('product', { categories, product ,title: product.name, description: product.description});
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

indexController.address = catchAsyncEjsErrors(async (req, res, next) => {
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

    const user = await User.findById(req.user._id).populate('addresses');
    const cart = await Cart.findOne({user: user._id});


    res.render('address', {categories, user:user, cart: cart})
})

indexController.shippingOptions = catchAsyncEjsErrors(async (req, res, next) => {
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

    const user = await User.findOne({email: "aakash@gmail.com"}).populate('addresses');
    const cart = await Cart.findOne({user: user._id});


    res.render('shipping', {categories, user:user, cart: cart})
})








module.exports = indexController;
