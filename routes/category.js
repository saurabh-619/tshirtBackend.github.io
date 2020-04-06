const express = require('express');
const router = require('express').Router();

const { getCategoryById, getCategory, getAllCategory, createCategory, updateCategory, removeCategory } = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');


router.param('userId', getUserById);


router.param('categoryId', getCategoryById);

// read
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategory);

// create
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory)

// update
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

// delete
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory)

module.exports = router;