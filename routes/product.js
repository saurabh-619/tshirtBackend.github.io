const express = require("express");
const router = require("express").Router();

const { isSignedIn, isAdmin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  photoMiddleware,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
  updateStock
} = require("../controllers/product");

router.param("userId", getUserById);

router.param("productId", getProductById);

// createProduct
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// Get a product
router.get("/product/:productId", getProduct);

router.get("/product/photo/:productId", photoMiddleware);

// Update
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Delete
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// listing all product
router.get("/products", getAllProducts);

// Get categories
router.get("/products/categories", getAllUniqueCategories);

// Update stock

module.exports = router;
