const express = require('express');
const router = require('express').Router();

const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { updateStock } = require('../controllers/product');
const { getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus } = require('../controllers/order');

// params
router.param('userId', getUserById);
router.param('orderId', getOrderById);


// create order
router.post('/order/create/:userId', isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

// Get all orders of all users
router.get('/order/all/:userId', isSignedIn, isAuthenticated, isAdmin, getAllOrders);

// status of order (For Admin)
router.get('/order/status/:userId', isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put('/order/:orderId/status/:userId', isSignedIn, isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;