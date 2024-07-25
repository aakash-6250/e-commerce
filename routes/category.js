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

        if (!categoryOption || !category || !subCategory) {
            return res.status(400).json({ message: 'All fields are required', type: 'error' });
        }

        if (categoryOption === 'new') {
            const newCategory = new Category({ name: category });
            newCategory.subcategories.push({ name: subCategory });
            await newCategory.save();
        } else if (categoryOption === 'existing') {
            const existingCategory = await Category.findOne({ name: category });
            if (!existingCategory) {
                return res.status(400).json({ message: 'Category not found', type: 'error' });
            }
            existingCategory.subcategories.push({ name: subCategory });
            await existingCategory.save();
        } else {
            return res.status(400).json({ message: 'Invalid category option', type: 'error' });
        }

        res.json({ message: 'Category added successfully', type: 'success' });
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ message: 'Error adding category', type: 'error', error: err.message });
    }
});


module.exports = router;