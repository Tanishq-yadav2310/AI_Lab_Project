const express = require("express");
const axios = require("axios");
const Resume = require("../models/Resume");
const FormData = require("form-data");

const router = express.Router();
const multer = require("multer");
const upload = multer();

router.post("/upload", multer().single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "http://127.0.0.1:8000/upload_resume",
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("Upload route error:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const {
      skill_match_score,
      experience_years,
      education_level,
      certifications,
      project_count
    } = req.body;

    // Call Python API
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      skill_match_score,
      experience_years,
      education_level,
      certifications,
      project_count
    });

    const predictions = response.data;

    // Save to MongoDB
    const newResume = new Resume({
      skill_match_score,
      experience_years,
      education_level,
      certifications,
      project_count,
      predictions
    });

    await newResume.save();

    res.json(newResume);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
