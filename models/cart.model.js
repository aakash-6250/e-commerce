const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: [true, "User is required"],
            unique: [true, "Cart already exists"]
        },
        items: [{
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: [true, "Product is required"] 
            },
            quantity: { 
                type: Number, 
                required: [true, "Quantity is required"] 
            }
        }],
        subTotalAmount:{
            type: Number,
            default: 0
        },
        shippingAmount:{
            type: Number,
            default: 0
        },
        totalAmount: { 
            type: Number, 
            default: 0 
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
