const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Subcategory name is required"] },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, "Subcategory category is required"] },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    },
    { timestamps: true }
);

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = Subcategory;
