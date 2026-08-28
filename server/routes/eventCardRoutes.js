// routes/eventCardRoutes.js

const express = require("express");
const router = express.Router();

const {
  getEventCards,
  createEventCard,
  updateEventCard,
  deleteEventCard,
} = require("../controllers/eventCardController");

const upload = require("../middleware/upload");

router.get("/", getEventCards);

router.post("/", upload.single("image"), createEventCard);

router.put("/:id", upload.single("image"), updateEventCard);

router.delete("/:id", deleteEventCard);

module.exports = router;
