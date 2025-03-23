const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

addressSchema.index({ user: 1, city: 1 });

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
