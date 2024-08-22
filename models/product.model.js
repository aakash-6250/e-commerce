const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Product name is required"], unique: true, trim: true},
        description: { type: [String], default: "No description available"},
        originalPrice: { type: Number, required: [true, "Product price is required"] },
        discountedPrice: { type: Number, default: 0 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, "Product category is required"] },
        subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: [true, "Product subcategory is required"] },
        stock: { type: Number, default: 0 },
        order: { type: Number, default: 0, select: false  },
        images: { 
            type: [String],
            validate: {
                validator: function(value) {
                    return value.length <= 5;
                },
                message: "You can upload a maximum of 5 images."
            }
        },
        brand: { type: String, default: "No brand provided." },
        views: { type: Number, default: 0 },
        trending: { type: Boolean, default: false },
        featured: { type: Boolean, default: false },
        published: { type: Boolean, default: false }
    }, { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
