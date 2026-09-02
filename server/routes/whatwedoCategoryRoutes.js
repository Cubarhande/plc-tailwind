const express = require("express");

const {
  createWhatwedoCategories,
  getCategories,
  getWhatwedoCategories,
  updateWhatwedoCategories,
  deleteWhatwedoCategories,
} = require("../controllers/whatwedoCategoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

router.get("/", getCategories);

router.get("/:id", getWhatwedoCategories);

// =====================================================
// ADMIN
// =====================================================

router.post("/", protect, createWhatwedoCategories);

router.put("/:id", protect, updateWhatwedoCategories);

router.delete("/:id", protect, deleteWhatwedoCategories);

module.exports = router;
