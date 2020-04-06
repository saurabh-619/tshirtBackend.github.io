const Product = require("../models/Product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("catgory")
    .exec((err, foundProduct) => {
      if (err || !foundProduct) {
        return res.status(400).json({
          error: "Product not doesn't exist",
        });
      }
      req.product = foundProduct;
      next();
    });
};

// Create Prosuct
const createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //keeps the exetensions such as .jpg,.png

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: `Problem with image`,
        errorInDetail: err,
      });
    }

    // fields(actual text like name,deescription,price etc)

    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please include all fields",
      });
    }

    let product = new Product(fields);

    // handle file like photo, mp3, etc(photo here)
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        //3MB
        return res.status(400).json({
          error: "File size is too big(> 3MB)",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to db
    product.save((err, savedProduct) => {
      if (err) {
        res.status(400).json({
          error: "Saving in DB failed",
          details: err.message,
        });
      }
      res.json(product);
    });
  });
};

// Get product
const getProduct = (req, res) => {
  const product = req.product;
  product.photo = undefined;
  return res.json(product);
};

// photo middleware
const photoMiddleware = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

// Update a product
const updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; //keeps the exetensions such as .jpg,.png

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: `Problem with image`,
        errorInDetail: err,
      });
    }

    // fields(actual text like name,deescription,price etc)
    let product = req.product;

    product = _.extend(product, fields);

    // handle file like photo, mp3, etc(photo here)
    if (file.photo) {
      if (file.photo.size > 3 * 1024 * 1024) {
        //3MB
        return res.status(400).json({
          error: "File size is too big(> 3MB)",
        });
      }

      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    // Save to db
    product.save((err, savedProduct) => {
      if (err) {
        res.status(400).json({
          error: "Updation of Product in DB failed",
          details: err.message,
        });
      }
      res.json(product);
    });
  });
};

// Delete the product
const deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }

    res.json({
      message: "Deletion successful",
      deletedProduct,
    });
  });
};

// Get all products
const getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8; //how much products to show at a time
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        res.status(400).json({
          error: "No error product found",
          detailes: err.message,
        });
      } else {
        res.json(products);
      }
    });
};

// Get all categories
const getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err || !category) {
      res.status(400).json({
        error: "No category Found",
        details: err.message,
      });
    }
    res.json({
      category,
    });
  });
};

// Update stock middleware
const updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } }, //we'll provide count from front-end not from productschema
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err || !products) {
      res.status(400).json({
        error: "Bulk operations Failed",
        details: err.message,
      });
    }
    res.json({
      message: "Stock and sold units Updated",
      products,
    });
  });
  next();
};

module.exports = {
  getProductById,
  createProduct,
  getProduct,
  photoMiddleware,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
  updateStock,
};
