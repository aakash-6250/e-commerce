const { catchAsyncApiErrors } = require('../middlewares/catchAsyncErrors');
const { ApiError } = require('../middlewares/apiErrorHandler');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const Product = require('../models/product.model');
const xlsx = require('xlsx');
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));




const apiController = {};


//                     COMMON CONTROLLERS                   //

// Product Controller

// GET /api/product
apiController.getProducts = catchAsyncApiErrors(async (req, res, next) => {
    let { page = 1, limit = 10, cat, subcat, featured, sale, search } = req.query;

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

    if (sale !== undefined) {
        query.sale = sale === 'true';
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

// GET /api/product/:id
apiController.getProductById = catchAsyncApiErrors(async (req, res, next) => {
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

            

            const redirectPath = user.role === 'admin' ? '/admin' : '/';
            return sendSuccessResponse(res, 'Login successful.', { redirect: redirectPath });
        });
    })(req, res, next);
});





// Address Controller

// GET
apiController.getAddressByUser = catchAsyncApiErrors(async (req, res, next) => {
    const addresses = await Address.find({ user: req.params.id });
    if (addresses.length === 0) throw new ApiError(404, 'No addresses found.', 'error');

    sendSuccessResponse(res, 'Addresses fetched successfully.', { addresses });
});

// POST
apiController.createAddress = catchAsyncApiErrors(async (req, res, next) => {
    const { user, name, phone, address, city, state, country, zipCode } = req.body;
    if (!(user && name && phone && address && city && state && country && zipCode)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    const addressObj = new Address({ user, name, phone, address, city, state, country, zipCode });
    await addressObj.save();

    await User.findByIdAndUpdate(user, { $push: { addresses: addressObj._id } });

    sendSuccessResponse(res, 'Address created successfully.', { address: addressObj });
});

// PATCH
apiController.updateAddress = catchAsyncApiErrors(async (req, res, next) => {
    const address = await Address.findById(req.params.id);
    if (!address) throw new ApiError(404, 'Address not found.', 'error');

    const { name, phone, address: addr, city, state, country, zipCode } = req.body;
    if (name) address.name = name;


});





//                      CUSTOMER CONTROLLERS                    //

// POST /api/register
apiController.register = catchAsyncApiErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!(firstName && lastName && email && phone && password)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'An account with this email already exists.', 'error');
    }

    const user = new User({ firstName, lastName, email, phone });
    await user.setPassword(password);
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

    if(oldPassword === newPassword) throw new ApiError(400, 'New password cannot be the same as old password.', 'error');

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





//                      ADMIN CONTROLLERS                    //

// POST
apiController.createProduct = catchAsyncApiErrors(async (req, res, next) => {
    const { name, description, price, category, subcategory, stock, brand, sale, featured } = req.body;

    const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        throw new ApiError(400, `The following fields are required: ${missingFields.join(', ')}.`, 'error');
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        throw new ApiError(400, 'A product with this name already exists.', 'error');
    }

    const product = new Product({ name, description, price, stock, brand, sale, featured });

    let categoryExist = await Category.findOne({ name: category });

    if (!categoryExist) {
        categoryExist = new Category({ name: category });
        await categoryExist.save();
    }

    let subcategoryExist = await Subcategory.findOne({ name: subcategory, category: categoryExist._id });

    if (!subcategoryExist) {
        subcategoryExist = new Subcategory({ name: subcategory, category: categoryExist._id, products: [product._id] });
        await subcategoryExist.save();

        if (!categoryExist.subcategories.includes(subcategoryExist._id)) {
            categoryExist.subcategories.push(subcategoryExist._id);
            await categoryExist.save();
        }
    } else {
        subcategoryExist.products.push(product._id);
        await subcategoryExist.save();
    }

    product.category = categoryExist._id;
    product.subcategory = subcategoryExist._id;

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

    await product.save();

    sendSuccessResponse(res, 'Product created successfully.', { product });
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
    await fs.promises.unlink(filePath);

    if (data.length === 0) {
        throw new ApiError(400, 'No data found in the file.', 'error');
    }

    if (data.length > 101) {
        throw new ApiError(400, 'You can only upload 100 products at a time.', 'error');
    }

    const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
    const invalidRows = data.filter(product => !requiredFields.every(field => product[field] !== undefined));

    if (invalidRows.length > 0) {
        throw new ApiError(400, 'The following rows are missing required fields: ' + invalidRows.map(row => row._id).join(', '), 'error');
    }

    let somethingAdded = false;
    for (let i = 0; i < data.length; i++) {
        const { name, description, price, category, subcategory, stock, brand, featured, sale } = data[i];

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) continue;
        somethingAdded = true;

        const product = new Product({ name, description, price, stock, brand });

        let categoryExist = await Category.findOne({ name: category });

        if (!categoryExist) {
            categoryExist = new Category({ name: category });
            await categoryExist.save();
        }

        let subcategoryExist = await Subcategory.findOne({ name: subcategory, category: categoryExist._id });

        if (!subcategoryExist) {
            subcategoryExist = new Subcategory({ name: subcategory, category: categoryExist._id, products: [product._id] });
            await subcategoryExist.save();

            
            if (!categoryExist.subcategories.includes(subcategoryExist._id)) {
                categoryExist.subcategories.push(subcategoryExist._id);
                await categoryExist.save();
            }
        } else {
            
            subcategoryExist.products.push(product._id);
            await subcategoryExist.save();
        }

        
        product.category = categoryExist._id;
        product.subcategory = subcategoryExist._id;

        
        if (featured) product.featured = featured === true;
        if (sale) product.sale = sale;

        await product.save();
    }

    if (somethingAdded) {
        sendSuccessResponse(res, 'Products uploaded successfully.');
    } else {
        throw new ApiError(400, 'All products already exist.', 'error');
    }
});

// PATCH
apiController.updateProduct = catchAsyncApiErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found.', 'error');

    const { name, description, price, category, subcategory, stock, brand, sale, featured, imagesToDelete } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (brand) product.brand = brand;
    if (sale) product.sale = sale;
    if (featured) product.featured = featured;

    if (category || subcategory) {
        if (!(category && subcategory)) throw new ApiError(400, 'Both category and subcategory are required.', 'error');

        const productCategory = await Category.findById(product.category);
        const productSubcategory = await Subcategory.findById(product.subcategory);

        if (productSubcategory.products.length === 1) {
            await Subcategory.findByIdAndDelete(productSubcategory._id);
            productCategory.subcategories.pull(productSubcategory._id);
            await productCategory.save();
        } else {
            productSubcategory.products.pull(product._id);
            await productSubcategory.save();
        }

        if (productCategory.subcategories.length === 0) {
            await Category.findByIdAndDelete(productCategory._id);
        } else {
            productCategory.subcategories.pull(productSubcategory._id);
            await productCategory.save();
        }

        let categoryExist = await Category.findOne({ name: category });

        if (!categoryExist) {
            categoryExist = new Category({ name: category });
            await categoryExist.save();
        }

        let subcategoryExist = await Subcategory.findOne({ name: subcategory, category: categoryExist._id });

        if (!subcategoryExist) {
            subcategoryExist = new Subcategory({ name: subcategory, category: categoryExist._id, products: [product._id] });
            await subcategoryExist.save();

            
            if (!categoryExist.subcategories.includes(subcategoryExist._id)) {
                categoryExist.subcategories.push(subcategoryExist._id);
                await categoryExist.save();
            }
        } else {
            
            subcategoryExist.products.push(product._id);
            await subcategoryExist.save();
        }

        
        product.category = categoryExist._id;
        product.subcategory = subcategoryExist._id;
    }

    if (imagesToDelete && imagesToDelete.length > 0) {
        product.images = product.images.filter(image => {
            if (imagesToDelete.includes(image)) {
                const imagePath = path.join(__dirname, '..', 'public', 'product', image);
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


        const imagesToKeep = product.images.concat(newImages).slice(0, 5);


        const unusedImages = req.files.map(file => file.filename).filter(filename => !imagesToKeep.includes(filename));


        unusedImages.forEach(image => {
            const imagePath = path.join(__dirname, '..', 'public', 'product', image);
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error(`Failed to delete unused image ${image}:`, err);
            }
        });


        product.images = imagesToKeep;
    }

    await product.save();

    sendSuccessResponse(res, 'Product updated successfully.', { product });
});

// DELETE
apiController.deleteProduct = catchAsyncApiErrors(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found.', 'error');

    if (product.images.length > 0) {
        if (product.images[0] !== "product.jpg") {
            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', 'public', 'product', image);
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error(`Failed to delete image ${image}:`, err);
                }
            });
        }
    }

    const category = await Category.findById(product.category);
    const subcategory = await Subcategory.findById(product.subcategory);

    if (subcategory) {
        if (subcategory.products.length === 1) {
            await Subcategory.findByIdAndDelete(subcategory._id);
            if (category) {
                category.subcategories.pull(subcategory._id);
            }
        } else {
            subcategory.products.pull(product._id);
            await subcategory.save();
        }
    }

    if (category) {
        if (category.subcategories.length === 0) {
            await Category.findByIdAndDelete(category._id);
        } else {
            await category.save();
        }
    }

    sendSuccessResponse(res, 'Product deleted successfully.', { product });
});





//                         Categories Controller

// GET
apiController.getCategories = catchAsyncApiErrors(async (req, res, next) =>{
    const categories = await Category.find().populate('subcategories');
    if (categories.length === 0) throw new ApiError(404, 'No categories found.', 'error');

    sendSuccessResponse(res, 'Categories fetched successfully.', { categories });
});

// GET
apiController.getCategoryById = catchAsyncApiErrors(async (req, res, next) =>{
    const category = await Category.findById(req.params.id).populate('subcategories');
    if (!category) throw new ApiError(404, 'Category not found.', 'error');

    sendSuccessResponse(res, 'Category fetched successfully.', { category });
});

// POST
apiController.createCategory = catchAsyncApiErrors(async (req, res, next) => {
    const { name } = req.body;
    if (!name) throw new ApiError(400, 'Category name is required.', 'error');

    const category = new Category({ name });
    await category.save();

    sendSuccessResponse(res, 'Category created successfully.', { category });
});

// PATCH
apiController.updateCategory = catchAsyncApiErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found.', 'error');

    const { name } = req.body;
    if (name) category.name = name;

    await category.save();

    sendSuccessResponse(res, 'Category updated successfully.', { category });
});

// DELETE
apiController.deleteCategory = catchAsyncApiErrors(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found.', 'error');

    sendSuccessResponse(res, 'Category deleted successfully.', { category });
});









//                         Address Controller

// GET
apiController.getAddressByUser = catchAsyncApiErrors(async (req, res, next) => {
    const addresses = await Address.find({ user: req.params.id });
    if (addresses.length === 0) throw new ApiError(404, 'No addresses found.', 'error');

    sendSuccessResponse(res, 'Addresses fetched successfully.', { addresses });
});

// POST
apiController.createAddress = catchAsyncApiErrors(async (req, res, next) => {
    const { user, name, phone, address, city, state, country, zipCode } = req.body;
    if (!(user && name && phone && address && city && state && country && zipCode)) {
        throw new ApiError(400, 'All fields are required.', 'error');
    }

    const addressObj = new Address({ user, name, phone, address, city, state, country, zipCode });
    await addressObj.save();

    await User.findByIdAndUpdate(user, { $push: { addresses: addressObj._id } });


    sendSuccessResponse(res, 'Address created successfully.', { address: addressObj });
});

// PATCH
apiController.updateAddress = catchAsyncApiErrors(async (req, res, next) => {
    const address = await Address.findById(req.params.id);
    if (!address) throw new ApiError(404, 'Address not found.', 'error');

    const { name, phone, address: addr, city, state, country, zipCode } = req.body;
    if (name) address.name = name;
    if (phone) address.phone = phone;
    if (addr) address.address = addr;
    if (city) address.city = city;
    if (state) address.state = state;
    if (country) address.country = country;
    if (zipCode) address.zipCode = zipCode;

    await address.save();

    sendSuccessResponse(res, 'Address updated successfully.', { address });
});

// DELETE
apiController.deleteAddress = catchAsyncApiErrors(async (req, res, next) => {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) throw new ApiError(404, 'Address not found.', 'error');

    await User.findByIdAndUpdate(address.user, { $pull: { addresses: address._id } });

    sendSuccessResponse(res, 'Address deleted successfully.', { address });
});





//                         Orders Controller


// GET
apiController.getOrders = catchAsyncApiErrors(async (req, res, next) => {
    const orders = await Order.find().populate( 'user address items.product').exec();
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





//                         Cart Controller

// const cartSchema = new mongoose.Schema(
//     {
//         user: { 
//             type: mongoose.Schema.Types.ObjectId, 
//             ref: 'User', 
//             required: [true, "User is required"] ,
//             unique: [true, "Cart already exists"]
//         },
//         items: [{
//             product: { 
//                 type: mongoose.Schema.Types.ObjectId, 
//                 ref: 'Product', 
//                 required: [true, "Product is required"] 
//             },
//             quantity: { 
//                 type: Number, 
//                 required: [true, "Quantity is required"] 
//             }
//         }],
//         totalAmount: { 
//             type: Number, 
//             default: 0 
//         },
//         isOrderPlaced: { 
//             type: Boolean, 
//             default: false 
//         }
//     }, 
//     { timestamps: true }
// );

// GET
apiController.getCartByUser = catchAsyncApiErrors(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.params.id }).populate('items.product').exec();
    if (!cart) throw new ApiError(404, 'Cart not found.', 'error');

    sendSuccessResponse(res, 'Cart fetched successfully.', { cart });
});

// POST














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







// Export the controller
module.exports = apiController;
