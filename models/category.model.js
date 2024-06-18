const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: [true,"Category name is required"], unique: [true,"Category already exist"] },
        description: String,
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true,"Product is required"]}]
    }, { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
