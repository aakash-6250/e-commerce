const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Subcategory name is required"], unique: [true, "Subcategory already exists"] },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, "Product is required"]}]
    },
    { timestamps: true }
);

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Category name is required"], unique: [true, "Category already exists"] },
        subcategories: [subcategorySchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
