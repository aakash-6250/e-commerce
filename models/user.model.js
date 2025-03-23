const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: { 
            type: String, 
            lowercase: true, 
            required: [true, "First name is required"] 
        },
        lastName: { 
            type: String, 
            lowercase: true, 
            required: [true, "Last name is required"] 
        },
        email: { 
            type: String, 
            required: [true, "Email is required"], 
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"] 
        },
        addresses: {
            type: [{
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Address'
            }]
        },
        phone: { 
            type: String,
            unique: true, 
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Please fill a valid phone number"]
        },
        role: { 
            type: String, 
            enum: ['admin', 'customer'], 
            default: 'customer' 
        }
    }, 
    { timestamps: true }
);


userSchema.plugin(plm, { usernameField: 'email' });



module.exports = mongoose.model('User', userSchema);
