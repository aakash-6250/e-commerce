const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Category name is required"], unique: [true, "Category already exists"] },
        subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' }]
    },
    { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
