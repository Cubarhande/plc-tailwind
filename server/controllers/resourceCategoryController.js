const ResourceCategory = require("../models/ResourceCategory");

// =========================
// GET PUBLIC CATEGORIES
// =========================

const getResourceCategories = async (req, res) => {
  try {
    const categories = await ResourceCategory.find({
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource categories",
      error: error.message,
    });
  }
};

// =========================
// GET ADMIN CATEGORIES
// =========================

const getAdminResourceCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await ResourceCategory.find().sort({
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
      message:
        "Failed to fetch resource categories",
      error: error.message,
    });
  }
};

// =========================
// GET SINGLE CATEGORY
// =========================

const getResourceCategory = async (
  req,
  res
) => {
  try {
    const category =
      await ResourceCategory.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch resource category",
      error: error.message,
    });
  }
};

// =========================
// CREATE
// =========================

const createResourceCategory = async (
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

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category =
      await ResourceCategory.create({
        name: name.trim(),
        description: description || "",
        displayOrder: Number(displayOrder) || 0,
        status:
          status === undefined
            ? true
            : status,
      });

    res.status(201).json({
      success: true,
      message:
        "Resource category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create resource category",
      error: error.message,
    });
  }
};

// =========================
// UPDATE
// =========================

const updateResourceCategory = async (
  req,
  res
) => {
  try {
    const category =
      await ResourceCategory.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Resource category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to update resource category",
      error: error.message,
    });
  }
};

// =========================
// DELETE
// =========================

const deleteResourceCategory = async (
  req,
  res
) => {
  try {
    const category =
      await ResourceCategory.findByIdAndDelete(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Resource category not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Resource category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete resource category",
      error: error.message,
    });
  }
};

module.exports = {
  getResourceCategories,
  getAdminResourceCategories,
  getResourceCategory,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
};