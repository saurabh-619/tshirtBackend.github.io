const express = require('express');
const router = require('express').Router();

const { getUserById, getUser, updateUser, userPurchaseList, pushOrderInPurchaseList } = require('../controllers/user');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');


// here, as soon as we try to trigger getUser route router.param get automatically trigger as both have same param 
router.param('userId', getUserById);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser)

router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser)

router.get('/orders/user/:userId', isSignedIn, isAuthenticated, userPurchaseList)


module.exports = router;