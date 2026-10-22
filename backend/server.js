require("dotenv").config();

const whisperUrl = process.env.WHISPER_WS_URL;
const whisperApiKey = process.env.WHISPER_API_KEY;

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const transcriptRoutes = require("./routes/transcriptRoutes");

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
      "https://procucev-ai-assignement.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Speech-to-Text API is running",
  });
});

app.use("/api/transcripts", transcriptRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  await connectDB();

  const port = process.env.PORT || 5000;

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer();
