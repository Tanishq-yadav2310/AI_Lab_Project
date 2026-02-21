const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  skill_match_score: Number,
  experience_years: Number,
  education_level: Number,
  certifications: Number,
  project_count: Number,
  predictions: {
    naive_bayes: {
      prediction: Number,
      confidence: Number
    },
    knn: {
      prediction: Number,
      confidence: Number
    },
    neural_network: {
      prediction: Number,
      confidence: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Resume", ResumeSchema);
