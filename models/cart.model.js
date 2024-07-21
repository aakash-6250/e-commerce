const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true,"User is required"] },
        cartItems: [{       
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true,"Product is required"] },
            quantity: { type: Number, required: [true,"quantity is required"] }
        }],
        totalAmount: { type: Number, default: 0 },
        isOrderPlaced: { type: Boolean, default: false }
    }, { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
