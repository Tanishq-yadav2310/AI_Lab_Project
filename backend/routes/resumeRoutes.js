const express = require("express");
const axios = require("axios");
const Resume = require("../models/Resume");
const FormData = require("form-data");

const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// const upload = multer();
const FLASK_API = process.env.FLASK_API;

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const flaskResponse = await axios.post(
      `${FLASK_API}/upload_resume`,
      formData,
      { headers: formData.getHeaders() }
    );

    const predictions = flaskResponse.data.predictions;
    const feedback = flaskResponse.data.feedback;

    const resume = new Resume({
      predictions
    });

    await resume.save();

    res.json({
      predictions,
      feedback
    });

  } catch (error) {
    console.error("Upload route error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    // 1️⃣ Call Flask
    const flaskResponse = await axios.post(
      `${FLASK_API}/predict`,
      req.body
    );

    const predictions = flaskResponse.data.predictions;
    const feedback = flaskResponse.data.feedback;

    // 2️⃣ Save to MongoDB
    const resume = new Resume({
      ...req.body,
      predictions
    });

    await resume.save();

    // 3️⃣ Send full AI response back to frontend
    res.json({
      predictions,
      feedback
    });

  } catch (error) {
    console.error("Analyze route error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
