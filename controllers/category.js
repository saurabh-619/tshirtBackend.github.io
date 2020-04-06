const Category = require("../models/Category");

const getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB"
      });
    }

    req.category = category;
  });
  next();
};

// Get category
const getCategory = (req, res) => {
  return res.status(200).json(req.category);
};

const getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Categories not found in DB"
      });
    }

    return res.json(categories);
  });
};

//Create Category
const createCategory = (req, res) => {
  const newCategory = new Category(req.body);
  newCategory.save((err, savedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to save category in DB"
        // error: err.message
      });
    }

    return res.json({
      categories: savedCategory
    });
  });
};

// Update

const updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category"
      });
    }

    return res.json({
      updatedCategory
    });
  });
};

// delete
const removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete category"
      });
    }

    return res.json({
      message: "Deleted successfully",
      deletedCategory
    });
  });
};

module.exports = {
  getCategoryById,
  getCategory,
  getAllCategory,
  createCategory,
  updateCategory,
  removeCategory
};
