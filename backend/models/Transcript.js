const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Untitled transcription",
    },
    text: {
      type: String,
      trim: true,
      required: [true, "Transcript text is required"],
      maxlength: 50000,
    },
    language: {
      type: String,
      default: "auto",
      trim: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transcript", transcriptSchema);
