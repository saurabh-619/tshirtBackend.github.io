const { Order, ProductCart } = require('../models/Order');

// params
const getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: "No order found in DB",
                    details: err.message
                })
            }
            req.order = order;
            next();
        })
}


const createOrder = (req, res) => {
    req.body.order.user = req.profile._id;
    const order = new Order(req.body.order);
    try {
        order.save((err, newOrder) => {
            if (err) {
                console.log(err.message);
            }
            console.log(newOrder + "\n Saved in DB");
        })

    } catch (e) {
        console.log(e.message);
    }
}

// Get all orders of all users
const getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name lastname")
        .exec((err, orders) => {
            if (err || !orders) {
                return res.status(400).json({
                    error: "No orders found in DB",
                    details: err.message
                })
            }

            res.json(orders);
        })
}

// Get order status (For admin)
const getOrderStatus = (req, res) => {
    res.json({
        status: Order.schema.path('status').enumValues
    })
}

const updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: "Can't update status",
                    details: err.message
                })
            }

            res.json(order);
        }
    )
}


module.exports = { getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus };