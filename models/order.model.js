const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
        items: [{ 
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }],
        total: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['paytm'], required: true },
        status: { 
            type: String, 
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'], 
            default: 'pending' 
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
