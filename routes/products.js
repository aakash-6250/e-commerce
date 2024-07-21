var express = require('express');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
var router = express.Router();


router.post('/add',isLoggedIn,  async (req, res, next) => {
    try {
        const { name, description, price, category, categoryDescription, stock, images, brand } = req.body;
        if (!name || !price || !category) throw new Error('All * fields are required.');
        const product = new Product({ name, price });
        const categoryExist = await Category.findOne({ name: category });
        if (!categoryExist) {
            const newCategory = new Category({ name: category });
            if (categoryDescription) newCategory.description = categoryDescription;
            newCategory.products.push(product._id);
            await newCategory.save();
            product.category = newCategory._id;
        } else {
            if (categoryDescription) categoryExist.description = categoryDescription;
            categoryExist.products.push(product._id);
            await categoryExist.save();
            product.category = categoryExist._id;
        }
        if (description) product.description = description;
        if (stock) product.stock = stock;
        if (brand) product.brand = brand;

        await product.save();
        res.json({ status: true, message: 'Product added successfully.' });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
    }
});

router.post('/:id/update', isLoggedIn, async (req, res, next) => {
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

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find().populate('category');
        res.json({ status: true, products });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: err.message });
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

router.post('/:id/delete',isLoggedIn, async (req, res, next) => {
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
    res.json({ status: false, message: "You need to login as admin first" });
}


module.exports = router;
