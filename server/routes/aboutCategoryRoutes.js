const express = require("express");

const router = express.Router();

const {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/aboutCategoryController");

router.get("/", getCategories);

router.get(
  "/admin",
  getAllCategories
);

router.post(
  "/",
  createCategory
);

router.put(
  "/:id",
  updateCategory
);

router.delete(
  "/:id",
  deleteCategory
);

module.exports = router;