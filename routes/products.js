var express = require('express');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
var router = express.Router();
const { multerMiddleware } = require('../utils/multer');
const xlsx = require('xlsx');
const fs = require('fs');





router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        const totalProducts = await Product.countDocuments();

        if(totalProducts === 0) return res.json({ message: 'No products found.', type: 'warning' });

        const totalPages = Math.ceil(totalProducts / limit);

        if (page > totalPages) page = totalPages;
        if (limit > 30 ) limit = 30;

        const products = await Product.find().populate('category')
            .skip((page - 1) * limit)
            .limit(limit);

        // console.log('products:', products);

        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: 'Error fetching products.',
            type: 'error',
            error: error.message,
        });
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        res.json({ status: true, product });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { name, description, price, category, subcategory, stock, brand } = req.body;

        const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}`, type: 'error' });
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists.', type: 'error' });
        }

        const product = new Product({ name, description, price, stock, brand });

        let categoryExist = await Category.findOne({ name: category });

        if (!categoryExist) {
            const newCategory = new Category({ name: category });
            newCategory.subcategories.push({ name: subcategory, products: [product._id] });
            await newCategory.save();
            product.category = newCategory._id;
        } else {
            let subcategoryExist = categoryExist.subcategories.find(sub => sub.name === subcategory);

            if (!subcategoryExist) {
                categoryExist.subcategories.push({ name: subcategory, products: [product._id] });
            } else {
                subcategoryExist.products.push(product._id);
            }

            await categoryExist.save();
            product.category = categoryExist._id;
        }

        await product.save();

        res.json({ message: 'Product added successfully.', type: 'success' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product.', type: 'error', error: error.message });
    }
});


router.post('/bulk-add', multerMiddleware.excel, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.', type: 'error' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        await fs.promises.unlink(filePath);

        if (data.length === 0) {
            return res.status(400).json({ message: 'No data found in the file.', type: 'error' });
        }

        if (data.length > 101) {
            return res.status(400).json({ message: 'Maximum 100 products can be uploaded at a time.', type: 'error' });
        }

        const requiredFields = ['name', 'description', 'price', 'category', 'subcategory', 'stock', 'brand'];
        const invalidRows = data.filter(product => !requiredFields.every(field => product[field] !== undefined));

        if (invalidRows.length > 0) {
            return res.status(400).json({ message: 'Invalid file format.', type: 'error' });
        }

        for (let i = 0; i < data.length; i++) {
            const { name, description, price, category, subcategory, stock, brand } = data[i];

            const existingProduct = await Product.findOne({ name });
            if (existingProduct) continue;

            const product = new Product({ name, description, price, stock, brand });
            let categoryExist = await Category.findOne({ name: category });

            if (!categoryExist) {
                const newCategory = new Category({ name: category });
                newCategory.subcategories.push({ name: subcategory, products: [product._id] });
                await newCategory.save();
                product.category = newCategory._id;
            } else {
                let subcategoryExist = categoryExist.subcategories.find(sub => sub.name === subcategory);

                if (!subcategoryExist) {
                    categoryExist.subcategories.push({ name: subcategory, products: [product._id] });
                } else {
                    subcategoryExist.products.push(product._id);
                }

                await categoryExist.save();
                product.category = categoryExist._id;
            }

            await product.save();
        }

        res.json({ message: 'File uploaded and processed successfully.', type: 'success' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file.', type: 'error', error: error.message });
    }
});


router.post('/:id/update', isLoggedInForAPI, async (req, res, next) => {
    try {
        const { name, description, price, category, categoryDescription, stock, images, brand } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) throw new Error('Product not found.');
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) {
            const categoryExist = await Category.findOne({ name: category });
            if (!categoryExist) {
                const newCategory = new Category({ name: category });
                if (categoryDescription) newCategory.description = categoryDescription;
                const oldCategory = await Category.findById(product.category);
                await oldCategory.products.pull(product._id);
                await newCategory.products.push(product._id);
                if (oldCategory.products.length === 0) await Category.findByIdAndDelete(oldCategory._id);
                product.category = newCategory._id;
                await newCategory.save();
            } else {
                if (categoryDescription) categoryExist.description = categoryDescription;
                if (categoryExist._id.toString() !== product.category.toString()) {
                    const oldCategory = await Category.findById(product.category);
                    await oldCategory.products.pull(product._id);
                    await categoryExist.products.push(product._id);
                    if (oldCategory.products.length === 0) await Category.findByIdAndDelete(oldCategory._id);
                    product.category = categoryExist._id;
                }
                await categoryExist.save();
            }
        }
        if (stock) product.stock = stock;
        if (brand) product.brand = brand;

        await product.save();
        res.json({ status: true, message: 'Product updated successfully.' });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});

router.post('/:id/delete', isLoggedInForAPI, async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) throw new Error('Product not found.');
        const category = await Category.findById(product.category);
        console.log(category)
        category.products.pull(req.params.id);
        await category.save();
        if (category.products.length === 0) await Category.findByIdAndDelete(category._id);
        res.json({ status: true, message: 'Product deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.session.errorMessage = "You need to login first";
    req.session.messageType = "error";
    res.redirect(req.headers.referer || '/');
}

function isLoggedInForAPI(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.status(401).json({ message: 'You need to login first.', type: 'warning', redirect: '/login' });
}

module.exports = router;
