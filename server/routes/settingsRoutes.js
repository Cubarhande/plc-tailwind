const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

// Public GET
router.get("/", getSettings);

// Protected UPDATE
router.put(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "favicon",
      maxCount: 1,
    },
  ]),
  updateSettings
);

module.exports = router;