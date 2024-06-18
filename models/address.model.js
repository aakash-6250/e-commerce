const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true,"User is required"]
    },
    addresses: [{
        label: {
            type: String,
            enum: ['home','work','other'],
            default: 'home'
        },
        street: {
            type: String,
            required: [true,"Street is required"]
        },
        city: {
            type: String,
            required: [true,"City is required"]
        },
        state: {
            type: String,
            required: [true,"State is required"]
        },
        zip: {
            type: Number,
            required: [true,"Zip is required"]
        },
        country: {
            type: String,
            required: [true,"Country is required"]
        }
    }]
}, { timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);