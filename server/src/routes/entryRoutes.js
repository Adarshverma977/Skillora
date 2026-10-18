const express = require("express");

const { createEntry, getEntries, getEntryById, updateEntry, deleteEntry, } = require("../controllers/entryController");

const { protect } = require("../middlewares/authMiddleware");

const validateRequest = require("../middlewares/validateRequest");

const { createEntrySchema, entryIdSchema, updateEntrySchema, getEntriesQuerySchema, } = require("../validators/entryValidators");

const router = express.Router();

router.post("/", protect, validateRequest(createEntrySchema), createEntry);

router.get(
  "/",
  protect,
  validateRequest(getEntriesQuerySchema, "query"),
  getEntries,
);

router.get(
  "/:id",
  protect,
  validateRequest(entryIdSchema, "params"),
  getEntryById,
);

router.patch(
  "/:id",
  protect,
  validateRequest(entryIdSchema, "params"),
  validateRequest(updateEntrySchema),
  updateEntry,
);

router.delete(
  "/:id",
  protect,
  validateRequest(entryIdSchema, "params"),
  deleteEntry,
);

module.exports = router;
