const AboutCategory = require("../models/AboutCategory");

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories =
      await AboutCategory.find({
        status: true,
      }).sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About categories",
    });
  }
};

// GET ALL - ADMIN
exports.getAllCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await AboutCategory.find().sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// CREATE
exports.createCategory = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      displayOrder,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category =
      await AboutCategory.create({
        name,
        description,
        displayOrder:
          Number(displayOrder) || 0,
        status:
          status === "false"
            ? false
            : true,
      });

    res.status(201).json({
      success: true,
      message:
        "About category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// UPDATE
exports.updateCategory = async (
  req,
  res
) => {
  try {
    const category =
      await AboutCategory.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name =
      req.body.name ?? category.name;

    category.description =
      req.body.description ??
      category.description;

    category.displayOrder =
      req.body.displayOrder !== undefined
        ? Number(req.body.displayOrder)
        : category.displayOrder;

    if (req.body.status !== undefined) {
      category.status =
        req.body.status === "false"
          ? false
          : true;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message:
        "About category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// DELETE
exports.deleteCategory = async (
  req,
  res
) => {
  try {
    const category =
      await AboutCategory.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await AboutCategory.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "About category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};