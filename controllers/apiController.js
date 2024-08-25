const { catchAsyncApiErrors } = require('../middlewares/catchAsyncErrors');
const { ApiError } = require('../middlewares/apiErrorHandler');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Address = require('../models/address.model')
const xlsx = require('xlsx');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const { default: mongoose } = require('mongoose');
const { products } = require('./adminController');
const axios = require('axios')

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));




const apiController = {};


//                     COMMON CONTROLLERS                   //

// Product Controller


// GET /api/product/:id
apiController.getProductById = catchAsyncApiErrors(async (req, res, next) => {

    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Invalid product ID', 'Error');

    const product = await Product.findById(req.params.id).populate([
        {
            path: 'category',
            select: '_id name ',
        },
        {
            path: 'subcategory',
            select: '_id name',
        }
    ]);

    if (!product) {
        throw new ApiError(404, 'Product not found.', 'error');
    }

    sendSuccessResponse(res, 'Product fetched successfully.', { product });
});





// Login Controller

//POST /api/login
apiController.login = catchAsyncApiErrors(async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(new ApiError(500, 'Server error', 'error'));
        }
        if (!user) {
            return next(new ApiError(401, 'Invalid email or password.', 'error'));
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return next(new ApiError(500, 'Server error', 'error'));
            }

            const redirectUrl = user.role === 'admin' ? '/admin' : '/';

            return sendSuccessResponse(res, 'Login successful.', { redirect: redirectUrl });
        });
    })(req, res, next);
});




// isLogedIn Controller

// GET
apiController.isLoggedIn = catchAsyncApiErrors(async (req, res, next) => {
    if (req.isAuthenticated()) {
        return sendSuccessResponse(res, 'User is logged in.', { loggedIn: true, user: req.user });
    }

    sendSuccessResponse(res, 'User is not logged in.', { loggedIn: false });
});





//                      CUSTOMER CONTROLLERS                    //

// POST /api/register
apiController.register = catchAsyncApiErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
    if (!(firstName && lastName && email && phone && password, confirmPassword)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'An account with this email already exists.', 'error');
    }

    const user = new User({ firstName, lastName, email, phone });
    if (password !== confirmPassword) throw new ApiError(400, 'Password and confirm password do not match.', 'error');
    else user.setPassword(password);
    await user.save();

    sendSuccessResponse(res, 'Registration successful.', { redirect: '/login' });
});

// GET
apiController.getUsers = catchAsyncApiErrors(async (req, res, next) => {
    const users = await User.find({ role: { $ne: 'admin' } });
    if (users.length === 0) throw new ApiError(404, 'No users found.', 'error');

    sendSuccessResponse(res, 'Users fetched successfully.', { users });
});

// PATCH
apiController.updateUser = catchAsyncApiErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found.', 'error');

    const { firstName, lastName, email, phone } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    sendSuccessResponse(res, 'User updated successfully.', { user });
});

// PATCH
apiController.updateUserPassword = catchAsyncApiErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found.', 'error');

    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) throw new ApiError(400, 'Both old and new passwords are required.', 'error');

    if (oldPassword === newPassword) throw new ApiError(400, 'New password cannot be the same as old password.', 'error');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new ApiError(400, 'Old password is incorrect.', 'error');

    await user.setPassword(newPassword);
    await user.save();

    sendSuccessResponse(res, 'Password updated successfully.');
});

// PATCH
apiController.updateUserRole = catchAsyncApiErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found.', 'error');

    const { role } = req.body;
    if (!role) throw new ApiError(400, 'Role is required.', 'error');

    user.role = role;
    await user.save();

    sendSuccessResponse(res, 'User role updated successfully.', { user });
});

// DELETE
apiController.deleteUser = catchAsyncApiErrors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, 'User not found.', 'error');

    sendSuccessResponse(res, 'User deleted successfully.', { user });
});

// GET /api/product
apiController.getProductsByUser = catchAsyncApiErrors(async (req, res, next) => {
    let { page = 1, limit = 10, cat, subcat, featured, search } = req.query;

    // Parse and validate pagination parameters
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 30) limit = 30;

    // Build the query object
    const query = {};

    query.published = true;

    if (subcat) {
        query.subcategory = subcat;
    }

    if (cat) {
        query.category = cat;
    }

    if (featured !== undefined) {
        query.featured = featured === 'true';
    }

    if (search) {
        // Replace "+" with space in the search string
        search = search.replace(/\+/g, ' ');

        // Handle search with spaces
        const searchTerms = search.trim().split(/\s+/); // Split by spaces and remove extra spaces
        const searchRegexArray = searchTerms.map(term => new RegExp(term, 'i'));

        query.$and = searchRegexArray.map(regex => ({
            $or: [
                { name: regex },
                { description: regex },
                { brand: regex }
            ]
        }));
    }

    // Count the total number of products matching the query
    const totalProducts = await Product.countDocuments(query);

    if (totalProducts === 0) throw new ApiError(404, 'No products found.', 'error');

    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) page = totalPages;

    // Fetch products with pagination and applied query
    const products = await Product.find(query)
        .populate([
            {
                path: 'category',
                select: '_id name',
            },
            {
                path: 'subcategory',
                select: '_id name',
            }
        ])
        .skip((page - 1) * limit)
        .limit(limit);

    // Send the success response with the products and pagination data
    sendSuccessResponse(res, 'Products fetched successfully.', {
        products,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            pageSize: limit,
        }
    });
});





//                      ADMIN CONTROLLERS                    //

// POST
apiController.createProduct = catchAsyncApiErrors(async (req, res, next) => {
    const { name, description, price, discountedPrice, category, subcategory, stock, brand, featured, trending, published } = req.body;

    const descriptionArray = description.split('\n').map(point => point.trim()).filter(point => point);

    const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ApiError(400, `The following fields are required: ${missingFields.join(', ')}.`, 'error');
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) throw new ApiError(400, 'A product with this name already exists.', 'error');

    const product = new Product({ name, description: descriptionArray, price, discountedPrice, stock, brand });

    const categoryExist = await Category.findById(category);
    if (!categoryExist) throw new ApiError(400, 'Category not found.', 'error');

    const subcategoryExist = await Subcategory.findById(subcategory);
    if (!subcategoryExist) throw new ApiError(400, 'Subcategory not found.', 'error');

    product.category = categoryExist._id;
    product.subcategory = subcategoryExist._id;

    subcategoryExist.products.push(product._id);

    await subcategoryExist.save();


    if (req.files && req.files.length > 0) {

        const newImages = req.files.map(file => file.filename).slice(0, 5);


        const unusedImages = req.files.map(file => file.filename).filter(filename => !newImages.includes(filename));


        unusedImages.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'public', 'product', image);
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error(`Failed to delete unused image ${image}:`, err);
            }
        });

        product.images = newImages;
    }

    product.published = published == 'true' ? true : false;

    product.trending = trending == 'true' ? true : false;

    product.featured = featured == 'true' ? true : false;

    await product.save();

    sendSuccessResponse(res, 'Product created successfully.', { product, redirect: '/admin/products' });
});

// GET /api/product
apiController.getProductsByAdmin = catchAsyncApiErrors(async (req, res, next) => {
    let { page = 1, limit = 10, cat, subcat, featured, search } = req.query;

    // Parse and validate pagination parameters
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 30) limit = 30;

    // Build the query object
    const query = {};

    if (subcat) {
        query.subcategory = subcat;
    }

    if (cat) {
        query.category = cat;
    }

    if (featured !== undefined) {
        query.featured = featured === 'true';
    }

    if (search) {
        // Replace "+" with space in the search string
        search = search.replace(/\+/g, ' ');

        // Handle search with spaces
        const searchTerms = search.trim().split(/\s+/); // Split by spaces and remove extra spaces
        const searchRegexArray = searchTerms.map(term => new RegExp(term, 'i'));

        query.$and = searchRegexArray.map(regex => ({
            $or: [
                { name: regex },
                { description: regex },
                { brand: regex }
            ]
        }));
    }

    // Count the total number of products matching the query
    const totalProducts = await Product.countDocuments(query);

    if (totalProducts === 0) throw new ApiError(404, 'No products found.', 'error');

    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) page = totalPages;

    // Fetch products with pagination and applied query
    const products = await Product.find(query)
        .populate([
            {
                path: 'category',
                select: '_id name',
            },
            {
                path: 'subcategory',
                select: '_id name',
            }
        ])
        .select('+order')
        .skip((page - 1) * limit)
        .limit(limit);

    // Send the success response with the products and pagination data
    sendSuccessResponse(res, 'Products fetched successfully.', {
        products,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            pageSize: limit,
        }
    });
});

// POST
apiController.bulkUpload = catchAsyncApiErrors(async (req, res, next) => {
    if (!req.file) {
        throw new ApiError(400, 'Please upload an Excel file.', 'error');
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Remove the uploaded file after processing
    await fs.promises.unlink(filePath);

    if (data.length === 0) {
        throw new ApiError(400, 'No data found in the file.', 'error');
    }

    if (data.length > 101) {
        throw new ApiError(400, 'You can only upload 100 products at a time.', 'error');
    }

    const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
    const invalidRows = data.filter(product => !requiredFields.every(field => product[field]));

    if (invalidRows.length > 0) {
        throw new ApiError(400, 'Some columns are missing required fields.', 'error');
    }

    let somethingAdded = false;

    for (let productData of data) {
        const { name, description, price, discountedPrice, category, subcategory, stock, brand, featured, published, trending } = productData;

        // Check if the product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) continue;

        somethingAdded = true;

        const descriptionArray = description.split(';').map(point => point.trim()).filter(point => point);

        // Create new product instance
        const product = new Product({ name, description: descriptionArray, price, stock, brand });

        // Check and create category
        let categoryExist = await Category.findOne({ name: category });

        if (!categoryExist) {
            categoryExist = new Category({ name: category });
            await categoryExist.save();
        }

        // Check and create subcategory
        let subcategoryExist = await Subcategory.findOne({ name: subcategory, category: categoryExist._id });

        if (!subcategoryExist) {
            subcategoryExist = new Subcategory({ name: subcategory, category: categoryExist._id });
            subcategoryExist.products.push(product._id);
            await subcategoryExist.save();
            categoryExist.subcategories.push(subcategoryExist._id);
            await categoryExist.save();
        } else {
            subcategoryExist.products.push(product._id);
            await subcategoryExist.save();
        }

        // Assign category and subcategory to product
        product.category = categoryExist._id;
        product.subcategory = subcategoryExist._id;

        if (discountedPrice) product.discountedPrice = discountedPrice;

        // Set additional properties
        if (featured) product.featured = featured === 'TRUE' ? true : false;

        if (published) product.published = published === 'TRUE' ? true : false;

        if (trending) product.trending = trending === 'TRUE' ? true : false;

        await product.save();
    }

    const redirect = somethingAdded ? '/admin/products' : '/admin/products/upload';

    if (somethingAdded) {
        sendSuccessResponse(res, 'Products uploaded successfully.', { redirect });
    } else {
        throw new ApiError(400, 'All products already exist.', 'error', { redirect });
    }

});


// PATCH
apiController.updateProduct = catchAsyncApiErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found.', 'error');

    const { name, description, price, discountedPrice, category, subcategory, stock, brand, featured, published, trending, imagesToDelete } = req.body;

    const descriptionArray = description.split('\n').map(point => point.trim()).filter(point => point);

    if (name && name !== product.name) product.name = name;
    if (descriptionArray && descriptionArray !== product.description) product.description = descriptionArray;
    if (price && price !== product.price) product.price = price;
    if (discountedPrice && discountedPrice !== product.discountedPrice) product.discountedPrice = discountedPrice;
    if (stock && stock !== product.stock) product.stock = stock;
    if (brand && brand !== product.brand) product.brand = brand;
    if (trending && trending !== product.trending) product.trending = trending === 'true' ? true : false;
    if (featured && featured !== product.featured) product.featured = featured === 'true' ? true : false;
    if (published && published !== product.published) product.published = published === 'true' ? true : false;

    if (category && subcategory && category !== product.category) {

        const categoryExist = await Category.findById(category);
        if (!categoryExist) throw new ApiError(400, 'Category not found.', 'error');

        const subcategoryExist = await Subcategory.findById(subcategory);
        if (!subcategoryExist) throw new ApiError(400, 'Subcategory not found.', 'error');

        await Subcategory.findByIdAndUpdate(product.subcategory, { $pull: { products: product._id } });

        product.category = categoryExist._id;
        product.subcategory = subcategoryExist._id;

        subcategoryExist.products.push(product._id);

        await subcategoryExist.save();

    }

    if (category && subcategory && category === product.category && subcategory !== product.subcategory) {

        const subcategoryExist = await Subcategory.findById(subcategory);
        if (!subcategoryExist) throw new ApiError(400, 'Subcategory not found.', 'error');

        await Subcategory.findByIdAndUpdate(product.subcategory, { $pull: { products: product._id } });

        product.subcategory = subcategoryExist._id;

        subcategoryExist.products.push(product._id);

        await subcategoryExist.save();
    }

    if (imagesToDelete && imagesToDelete.length > 0) {
        product.images = product.images.filter(image => {
            if (imagesToDelete.includes(image)) {
                const imagePath = path.join(__dirname, '..', 'public', 'images', 'product', image);
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error(`Failed to delete image ${image}:`, err);
                }
                return false;
            }
            return true;
        });
    }

    if (req.files && req.files.length > 0) {

        const currentImageCount = product.images.length;
        const newImages = req.files.map(file => file.filename).slice(0, 5 - currentImageCount);

        if (newImages.length === 0) throw new ApiError(400, 'Product can have maximum 5 images.', 'error');


        const imagesToKeep = product.images.concat(newImages).slice(0, 5);


        const unusedImages = req.files.map(file => file.filename).filter(filename => !imagesToKeep.includes(filename));


        unusedImages.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'public', 'images', 'product', image);
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error(`Failed to delete unused image ${image}:`, err);
            }
        });


        product.images = imagesToKeep;
    }

    await product.save();

    sendSuccessResponse(res, 'Product updated successfully.', { product, redirect: '/admin/products' });
});

// DELETE
apiController.deleteProduct = catchAsyncApiErrors(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found.', 'error');

    if (product.images.length > 0) {
        if (product.images[0] !== "product.jpg") {
            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', 'public', 'images', 'product', image);
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error(`Failed to delete image ${image}:`, err);
                }
            });
        }
    }

    await Subcategory.findByIdAndUpdate(product.subcategory, { $pull: { products: product._id } });

    sendSuccessResponse(res, 'Product deleted successfully.', { product, redirect: '/admin/products' });
});

// GET 
apiController.deleteAllDocuments = catchAsyncApiErrors(async (req, res, next) => {

    const products = await Product.find().select('images -_id');

    await Product.deleteMany();
    await Category.deleteMany();
    await Subcategory.deleteMany();

    products.forEach(product => {
        product.images.forEach(image => {
            try {
                fs.unlinkSync(path.join(__dirname, '..', 'public', 'images', 'product', image));
            } catch (error) {
                console.error(`Error deleting image ${image}: ${error.message}`);
            }
        });
    });

    sendSuccessResponse(res, 'All documents deleted successfully.');
});





//                         Categories Controller

// GET
apiController.getCategories = catchAsyncApiErrors(async (req, res, next) => {
    const categories = await Category.find().populate('subcategories');
    if (categories.length === 0) throw new ApiError(404, 'No categories found.', 'error');

    sendSuccessResponse(res, 'Categories fetched successfully.', { categories });
});

// GET
apiController.getCategoryById = catchAsyncApiErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id).populate('subcategories');
    if (!category) throw new ApiError(404, 'Category not found.', 'error');

    sendSuccessResponse(res, 'Category fetched successfully.', { category });
});

// POST
apiController.createCategory = catchAsyncApiErrors(async (req, res, next) => {

    const { category, subcategories } = req.body;
    if (!category) throw new ApiError(400, 'Category name is required.', 'error');

    const existingCategory = await Category.findOne({ name: category });

    if (existingCategory) throw new ApiError(400, 'Category already exists.', 'error');

    const newCategory = new Category({ name: category });

    if (subcategories.length > 0) {

        const newSubcategories = [];

        for (let i = 0; i < subcategories.length; i++) {
            const subcategory = new Subcategory({ name: subcategories[i], category: newCategory._id });
            newSubcategories.push(subcategory);
        }

        await Subcategory.insertMany(newSubcategories);

        newCategory.subcategories = newSubcategories.map(subcategory => subcategory._id);

    }

    await newCategory.save();

    sendSuccessResponse(res, 'Category created successfully.', { category: newCategory, redirect: '/admin/categories' });

});

// PATCH
apiController.updateCategory = catchAsyncApiErrors(async (req, res, next) => {
    // Fetch the existing category with subcategories
    const categoryExist = await Category.findById(req.params.id).populate('subcategories');
    if (!categoryExist) throw new ApiError(404, 'Category not found.', 'error');

    // Extract data from request body
    const { categoryName, newSubcategories, subcategories } = req.body;
    console.log(req.body);

    // Update category name if it has changed
    if (categoryName && categoryName !== categoryExist.name) categoryExist.name = categoryName;

    // Add new subcategories if any
    if (newSubcategories && newSubcategories.length > 0) {
        const newSubcategory = newSubcategories.map(name => new Subcategory({ name, category: categoryExist._id }));
        await Subcategory.insertMany(newSubcategory);
        categoryExist.subcategories.push(...newSubcategory.map(subcategory => subcategory._id));
    }

    // Process existing subcategories
    await Promise.all(subcategories.map(async subcategory => {
        if (subcategory.delete) {
            const subcategoryHasProduct = await Product.findOne({ subcategory: subcategory.id });
            if (subcategoryHasProduct) throw new ApiError(400, 'Subcategory has products.', 'error');

            await Subcategory.findByIdAndDelete(subcategory.id);
            categoryExist.subcategories.pull(subcategory.id);
        } else {
            const subcategoryExist = await Subcategory.findById(subcategory.id);
            if (!subcategoryExist) throw new ApiError(404, 'Subcategory not found.', 'error');

            // Update subcategory name if it has changed
            if (subcategoryExist.name !== subcategory.name) {
                subcategoryExist.name = subcategory.name;
                await subcategoryExist.save();
            }
        }
    }));

    // Save the updated category
    await categoryExist.save();

    // Send success response
    sendSuccessResponse(res, 'Category updated successfully.', { redirect: `/admin/category/${req.params.id}/edit` });
});


// DELETE
apiController.deleteCategory = catchAsyncApiErrors(async (req, res, next) => {

    // check category doest not have any product in subcategory
    const categoryExist = await Category.findById(req.params.id);
    if (!categoryExist) throw new ApiError(404, 'Category not found.', 'error');

    if (categoryExist.subcategories.length > 0) throw new ApiError(400, 'Category has subcategories.', 'error');

    const category = await Category.findByIdAndDelete(req.params.id);

    sendSuccessResponse(res, 'Category deleted successfully.', { category, redirect: '/admin/categories' });
});









//                         Address Controller

// POST
apiController.checkPincode = catchAsyncApiErrors(async (req, res, next) => {
    const { pincode } = req.body;

    const data = await checkPincodeServiceability(pincode);
    const serviceable = isPincodeServiceable(data, pincode);

    sendSuccessResponse(res, 'success', {serviceable})

})

// POST
apiController.createAddress = catchAsyncApiErrors(async (req, res, next) => {

    if (!req.user) throw new ApiError(403, 'User must be logged-in', 'error')

    const user = await User.findById(req.user._id);
    if (user.addresses.length === 3) throw new ApiError(403, 'Only three address is allowed to save', 'error')

    const { firstName, lastName, address, city, state, country, zip, phone } = req.body;
    if (!(firstName && lastName && phone && address && city && state && country && zip)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    console.log(address);

    const addressObj = new Address({ user: req.user._id, firstName, lastName, address, city, state, country, zip, phone });
    await addressObj.save();

    user.addresses.push(addressObj);

    user.save();

    sendSuccessResponse(res, 'Address created successfully.', { redirect: '/address' });
});


// DELETE
apiController.deleteAddress = catchAsyncApiErrors(async (req, res, next) => {

    if (!req.user) throw new ApiError(403, 'login to access this endpoint', 'error')

    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(403, 'Invalid url', 'error');

    const user = await User.findById(req.user._id);

    if (!user.addresses.includes(req.params.id)) throw new ApiError(403, 'You are not authorized to delete this address', 'error')

    const address = await Address.findByIdAndDelete(req.params.id);

    if (!address) throw new ApiError(404, 'Address not found.', 'error');

    user.addresses.pull(address._id);

    user.save();

    sendSuccessResponse(res, 'Address deleted successfully.', { redirect: '/address' });
});

// POST
apiController.selectedAddress = catchAsyncApiErrors(async (req, res, next) => {

    if (!mongoose.isValidObjectId(req.body.address)) throw new ApiError(403, 'Invalid address provided', 'error');
    const user = await User.findOne({ email: "aakash@gmail.com" });

    if (!user.addresses.includes(req.body.address)) throw new ApiError(403, 'Address does not exist', 'error')

    if (!user.addresses.includes(req.body.address)) throw new ApiError(403, 'Address does not exist', 'error');

    // Fetch the address details
    const address = await Address.findById(req.body.address);
    if (!address) throw new ApiError(404, 'Address not found', 'error');


    const originPin = "462043"; 
    const destinationPin = address.zip;
    const weight = 500; 
    const status = 'Delivered';

    const response = await axios.get('https://track.delhivery.com/api/kinko/v1/invoice/charges/.json', {
        params: {
            md: 'E',
            cgm: weight,
            o_pin: originPin,
            d_pin: destinationPin,
            ss: status
        },
        headers: {
            'Authorization': 'Token 3fdc80153c93e4e4b589663d4841a8b5e3bc725e',
            'Content-Type': 'application/json'
        }
    });

    console.log(response.data);


    sendSuccessResponse(res, 'Address selected', {})
})


//                         Cart Controller

apiController.syncCart = catchAsyncApiErrors(async (req, res, next) => {

    if (!req.user) throw new ApiError(401, "User not authenticated", "error")

    const clientCart = req.body.cart;

    if (!clientCart || !Array.isArray(clientCart.items) || !clientCart.items.length === 0) throw new ApiError(409, "Invalid cart", "error")


    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) cart = new Cart({ user: req.user._id });

    cart.items = clientCart.items.map(item => ({
        product: item._id,
        quantity: item.quantity > 0 && item.quantity < 21 ? item.quantity : 1
    }))

    cart.subTotalAmount = 0;
    cart.totalAmount = 0;


    for (item of cart.items) {
        const product = await Product.findById(item.product);
        const price = product.discountedPrice > 0 ? product.discountedPrice : product.price;
        cart.subTotalAmount += price * item.quantity;
    }


    if (cart.subTotalAmount !== clientCart.subTotalAmount) throw new ApiError(409, 'Incorrect cart subtotal', 'error')

    cart.totalAmount = cart.subTotalAmount + cart.shippingAmount;

    cart.save();

    sendSuccessResponse(res, 'Cart synced to database')

});


//                         Orders Controller


// GET
apiController.getOrders = catchAsyncApiErrors(async (req, res, next) => {
    const orders = await Order.find().populate('user address items.product').exec();
    if (orders.length === 0) throw new ApiError(404, 'No orders found.', 'error');

    sendSuccessResponse(res, 'Orders fetched successfully.', { orders });

});

// POST
apiController.createOrder = catchAsyncApiErrors(async (req, res, next) => {
    const { user, address, items, total, paymentMethod } = req.body;
    if (!(user && address && items && total && paymentMethod)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    const order = new Order({ user, address, items, total, paymentMethod });
    await order.save();

    sendSuccessResponse(res, 'Order created successfully.', { order });
});

// PATCH
apiController.updateOrder = catchAsyncApiErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found.', 'error');

    const { status } = req.body;
    if (status) order.status = status;

    await order.save();

    sendSuccessResponse(res, 'Order updated successfully.', { order });
});

// DELETE
apiController.deleteOrder = catchAsyncApiErrors(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found.', 'error');

    sendSuccessResponse(res, 'Order deleted successfully.', { order });
});















//                        Helper Functions

// Send success response
sendSuccessResponse = (res, message, data = {}) => {
    res.json({
        status: true,
        type: 'success',
        message,
        data
    });
};


const checkPincodeServiceability = async (pincode) => {
    try {
        const response = await axios.get(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token 3fdc80153c93e4e4b589663d4841a8b5e3bc725e'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error checking pincode serviceability:", error);
        return null;
    }
};

const isPincodeServiceable = (data, pincode) => {
    if (!data || !data.delivery_codes) {
        console.log(data)
        return false;
    }

    const serviceable = data.delivery_codes.some(code => code.postal_code.pin == pincode);
    return serviceable;
};





// Export the controller
module.exports = apiController;
