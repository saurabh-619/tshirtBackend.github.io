const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// products in the cart
const productCartSchema = new mongoose.Schema({
    // product model from Product.js
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const orderSchema = new mongoose.Schema({
    // Products in the cart
    products: [productCartSchema],
    transaction_id: {},
    amount: {
        type: Number
    },
    status: {
        type: String,
        default: "Received",
        enum: ["Shipped", "Received", "Processing", "Delivered", "Cancelled"]
    },
    address: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true });


const Order = mongoose.model('Order', orderSchema);
const ProductCart = mongoose.model('ProductCart', productCartSchema);
module.exports = {
    Order,
    ProductCart
};