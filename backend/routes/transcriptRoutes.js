const express = require("express");

const {
  createTranscript,
  getTranscripts,
  getTranscriptById,
  updateTranscript,
  deleteTranscript,
} = require("../controllers/transcriptController");

const router = express.Router();

router.route("/").post(createTranscript).get(getTranscripts);

router
  .route("/:id")
  .get(getTranscriptById)
  .put(updateTranscript)
  .delete(deleteTranscript);

module.exports = router;
