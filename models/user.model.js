const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, lowercase: true, required: [true,"First name is required"] },
        lastName: { type: String, lowercase: true, required: [true,"Last name is required"] },
        email: { type: String, required: [true,"Email is required"], unique: [true,"Email is already taken"] },
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
        phone: { type: Number, unique: [true,"Phone number is already taken"], required: [true,"Phone number is required"] },
        role:{ type: String, enum: ['admin','customer'], default: 'customer' }
    }, { timestamps: true }
);

userSchema.plugin(plm, { usernameField: 'email' });


module.exports = mongoose.model('User', userSchema);