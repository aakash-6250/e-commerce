var express = require('express');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
var router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.find();
    res.render('category', { categories });
});

router.post('/add', async (req, res) => {
    try {

        const { categoryOption, category, subCategory } = req.body;

        if(!categoryOption || !category || !subCategory) throw new Error("All fields are required");

        if(categoryOption === 'new') {
            const newCategory = new Category({ name: category });
            newCategory.subcategories.push({ name: subCategory });
            await newCategory.save();
        }
        if(categoryOption === 'existing') {
            const existingCategory = await Category.findOne({ name: category });
            if(!existingCategory) throw new Error("Category not found");
            existingCategory.subcategories.push({ name: subCategory });
            await existingCategory.save();
        }
        
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: false, message: err.message });
    }
});


module.exports = router;