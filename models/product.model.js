const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Product name is required"], unique: true},
        description: { type:String, default: "No description available"},
        price: { type: Number, required: [true, "Product price is required"] },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, "Product category is required"] },
        stock: { type: Number, default: 0 },
        order: { type: Number, default: 0 },
        images: { type: [String], default: ["/images/product/product.svg"] },
        brand: { type: String, default: "No brand provided." },
        sale: { type: Number, default: 0 },
        featured: { type: Boolean, default: false }
    }, { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
