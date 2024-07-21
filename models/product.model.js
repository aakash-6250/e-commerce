const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Product name is required"] },
        description: String,
        price: { type: Number, required: [true, "Product price is required"] },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, "Product category is required"] },
        stock: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        images: [String],
        brand: String
    }, { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
