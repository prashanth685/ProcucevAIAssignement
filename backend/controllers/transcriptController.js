const mongoose = require("mongoose");
const Transcript = require("../models/Transcript");

const isValidId = (id) => mongoose.isValidObjectId(id);

const createTranscript = async (req, res, next) => {
  try {
    const { title, text, language, durationSeconds } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        message: "Transcript text is required",
      });
    }

    const transcript = await Transcript.create({
      title: title || "Untitled transcription",
      text: text.trim(),
      language: language || "auto",
      durationSeconds: durationSeconds ?? 0,
    });

    return res.status(201).json(transcript);
  } catch (error) {
    next(error);
  }
};

const getTranscripts = async (req, res, next) => {
  try {
    const transcripts = await Transcript.find().sort({ createdAt: -1 }).lean();

    res.json(transcripts);
  } catch (error) {
    next(error);
  }
};

const getTranscriptById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid transcript ID" });
    }

    const transcript = await Transcript.findById(id);

    if (!transcript) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    res.json(transcript);
  } catch (error) {
    next(error);
  }
};

const updateTranscript = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid transcript ID" });
    }

    const allowedFields = ["title", "text", "language"];
    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            message: `${field} must be a string`,
          });
        }

        updates[field] = req.body[field];
      }
    }

    if (updates.text !== undefined && !updates.text.trim()) {
      return res.status(400).json({
        message: "Transcript text cannot be empty",
      });
    }

    if (updates.title !== undefined && !updates.title.trim()) {
      return res.status(400).json({
        message: "Title cannot be empty",
      });
    }

    const transcript = await Transcript.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!transcript) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    res.json(transcript);
  } catch (error) {
    next(error);
  }
};

const deleteTranscript = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid transcript ID" });
    }

    const transcript = await Transcript.findByIdAndDelete(id);

    if (!transcript) {
      return res.status(404).json({ message: "Transcript not found" });
    }

    res.json({ message: "Transcript deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTranscript,
  getTranscripts,
  getTranscriptById,
  updateTranscript,
  deleteTranscript,
};
