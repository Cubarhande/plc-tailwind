const express = require("express");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", protect, createCategory);

router.put("/:id", protect, updateCategory);

router.delete("/:id", protect, deleteCategory);

module.exports = router;
