const express = require("express");

const {
  getResourceCategories,
  getAdminResourceCategories,
  getResourceCategory,
  createResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
} = require("../controllers/resourceCategoryController");

const router = express.Router();

// Public
router.get("/", getResourceCategories);

// Admin
router.get("/admin", getAdminResourceCategories);

router.get("/:id", getResourceCategory);

router.post("/", createResourceCategory);

router.put("/:id", updateResourceCategory);

router.delete("/:id", deleteResourceCategory);

module.exports = router;
