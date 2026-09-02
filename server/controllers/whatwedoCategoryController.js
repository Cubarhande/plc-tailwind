const WhatwedoCategories = require("../models/WhatwedoCategories");
const WhatWeDoCard = require("../models/WhatWeDoCard");

// =====================================================
// CREATE CATEGORY
// =====================================================

exports.createWhatwedoCategories = async (req, res) => {
  try {
    const category =
      await WhatwedoCategories.create(req.body);

    res.status(201).json({
      success: true,
      message: "What We Do category created successfully.",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL CATEGORIES
// =====================================================

exports.getCategories = async (req, res) => {
  try {
    const categories =
      await WhatwedoCategories.find()
        .sort({ displayOrder: 1 });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE CATEGORY
// =====================================================

exports.getWhatwedoCategories = async (req, res) => {
  try {
    const category =
      await WhatwedoCategories.findById(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "What We Do category not found.",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE CATEGORY
// =====================================================

exports.updateWhatwedoCategories = async (req, res) => {
  try {
    const category =
      await WhatwedoCategories.findByIdAndUpdate(
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
        message: "What We Do category not found.",
      });
    }

    res.json({
      success: true,
      message:
        "What We Do category updated successfully.",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE CATEGORY
// =====================================================

exports.deleteWhatwedoCategories = async (req, res) => {
  try {
    const category =
      await WhatwedoCategories.findByIdAndDelete(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "What We Do category not found.",
      });
    }

    // Delete all cards belonging to this category
    await WhatWeDoCard.deleteMany({
      category: category._id,
    });

    res.json({
      success: true,
      message:
        "Category and related cards deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};