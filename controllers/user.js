const User = require('../models/User');
const { Order } = require('../models/Order');

// another way of getting params 
const getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, foundUser) => {
        if (err || !foundUser) {
            return res.status(400).json({
                error: "User not doesn't exist"
            })
        }

        req.profile = foundUser;
        next();
    })
}


const getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encrypted_password = undefined;

    return res.json({
        user: req.profile
    })
}

const updateUser = (req, res) => {
    User.findByIdAndUpdate({ _id: req.profile._id }, req.body, { new: true, useFindAndModify: false }, (err, updatedUser) => {
        if (!updatedUser) {
            return res.status(400).json({
                error: "User not doesn't exist"
            })
        }

        return res.status(203).json({
            message: 'Updation successful',
            updatedUser
        })
    })
}

const userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: "No Order in this Account"
                })
            }

            return res.json(order);
        })
}

const pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    // store this in DB
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save purchase List"
                })
            }

        }
    )
    next()
}

module.exports = { getUserById, getUser, updateUser, userPurchaseList, pushOrderInPurchaseList };