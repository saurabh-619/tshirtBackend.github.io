const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    salt: String,
    encrypted_password: {
        type: String,
        required: true
    },
    // role=0 => user=admin, role=1 => user=seller, role=2 => user=customer, 
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
)

// virtual helps to create a field in schema by using other data
userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.encrypted_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    securePassword: function (plainPassword) {
        if (!plainPassword) { return "" }
        try {
            const hash = crypto.createHmac('sha256', process.env.SECRET)
                .update(plainPassword)
                .digest('hex');
            return (hash);
        } catch (err) {
            return "";
        }
    },
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encrypted_password;
    }
}

const User = mongoose.model('User', userSchema);


module.exports = User;
