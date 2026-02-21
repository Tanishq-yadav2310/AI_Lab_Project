import React, { useState } from "react";
import axios from "axios";
import { Analytics } from "@vercel/analytics/react"

const BACKEND_URL = "https://ai-lab-project-rl0e.onrender.com";

function App() {
  const [formData, setFormData] = useState({
    skill_match_score: "",
    experience_years: "",
    education_level: "",
    certifications: "",
    project_count: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);


  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  // ======================
  // Manual Submit
  // ======================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const response = await axios.post(
        `${BACKEND_URL}/api/resume/analyze`,
        formData,
      );
      console.log("FULL RESPONSE:", response.data);

      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // ======================
  // Upload Submit
  // ======================

  const handleUpload = async () => {
    if (!uploadedFile) return;

    const uploadData = new FormData();
    uploadData.append("file", uploadedFile);

    setLoading(true);

    try {
      
      const response = await axios.post(
        `${BACKEND_URL}/api/resume/upload`,
        uploadData,
      );
      console.log("FULL RESPONSE:", response.data);

      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
      }, 1200);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  // ======================
  // Render Prediction Card
  // ======================

 const renderPrediction = (modelName, modelData) => {
  if (!modelData) return null;

  const isSuitable = modelData.prediction === 1;

  const probabilitySuitable = modelData.confidence || 0;
  const probabilityNotSuitable = 1 - probabilitySuitable;

  const confidencePercent = (
    (isSuitable ? probabilitySuitable : probabilityNotSuitable) * 100
  ).toFixed(1);

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "10px"
    }}>
      <h3>{modelName}</h3>

      <p style={{
        color: isSuitable ? "green" : "red",
        fontWeight: "bold"
      }}>
        {isSuitable ? "Suitable" : "Not Suitable"}
      </p>

      <div style={{
        backgroundColor: "#eee",
        borderRadius: "6px",
        height: "12px",
        width: "100%",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${confidencePercent}%`,
          height: "100%",
          backgroundColor: isSuitable ? "green" : "red",
          transition: "width 0.4s ease"
        }}></div>
      </div>

      <p>Confidence: {confidencePercent}%</p>
    </div>
  );
};

  // ======================
  // Overall Decision
  // ======================

  const getPredictionsObject = () => {
    if (!result) return null;

    // If backend returns { predictions: {...} }
    if (result.predictions) return result.predictions;

    // If backend returns predictions directly
    return result;
  };
  

  const getOverallDecision = () => {
    const predictions = getPredictionsObject();
    if (!predictions) return null;

    const votes = [
      predictions.naive_bayes?.prediction || 0,
      predictions.knn?.prediction || 0,
      predictions.neural_network?.prediction || 0,
    ];

    const total = votes.reduce((a, b) => a + b, 0);
    return total >= 2 ? "Suitable" : "Not Suitable";
  };

  // ======================
  // UI
  // ======================
  

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "50px",
      }}
    >
      <div
        style={{
          width: "650px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* AI Lab Main Title */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "1px",
              margin: "0",
            }}
          >
            ARTIFICIAL INTELLIGENCE LAB PROJECT
          </p>
        </div>

        {/* Student Info + Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h2 style={{ margin: "0" }}>Tanishq Yadav</h2>
            <p style={{ margin: "5px 0", color: "#555" }}>241302011</p>
            <p style={{ margin: "5px 0", color: "#555" }}>B.Tech CC 4th Sem</p>
          </div>

          <img
            src="/logo.png"
            alt="Institute Logo"
            style={{
              width: "140px",
              height: "140px",
              objectFit: "contain",
            }}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
        </div>

        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          AI Resume Analyzer
        </h1>

        {/* Mode Selection */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => {
              setMode("manual");
              setResult(null);
            }}
            onMouseEnter={() => setHoveredButton("manual")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              padding: "10px 20px",
              marginRight: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                mode === "manual"
                  ? "#2563eb"
                  : hoveredButton === "manual"
                    ? "#3b82f6"
                    : "#e5e7eb",
              color: mode === "manual" ? "white" : "#111",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            Manual Entry
          </button>

          <button
            onClick={() => {
              setMode("upload");
              setResult(null);
            }}
            onMouseEnter={() => setHoveredButton("upload")}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor:
                mode === "upload"
                  ? "#2563eb"
                  : hoveredButton === "upload"
                    ? "#3b82f6"
                    : "#e5e7eb",
              color: mode === "upload" ? "white" : "#111",
              transition: "all 0.25s ease",
              cursor: "pointer",
            }}
          >
            Upload Resume
          </button>
        </div>

        {/* Manual Form */}
        {mode === "manual" && (
          <form onSubmit={handleSubmit}>
            <input
              name="skill_match_score"
              placeholder="Skill Score (0-10)"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="experience_years"
              placeholder="Experience Years"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="education_level"
              placeholder="Education Level (0-2)"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="certifications"
              placeholder="Certifications Count"
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              name="project_count"
              placeholder="Project Count"
              onChange={handleChange}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#93c5fd" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>
        )}

        {/* Upload Section */}
        {mode === "upload" && (
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setUploadedFile(e.target.files[0])}
              style={{ marginBottom: "15px" }}
            />

            <button
              disabled={!uploadedFile || loading}
              onClick={handleUpload}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: uploadedFile ? "#2563eb" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: uploadedFile ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Analyzing..." : "Analyze Uploaded Resume"}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: "40px" }}>
            <h2>Model Predictions</h2>

            {(() => {
              const predictions = getPredictionsObject();
              if (!predictions) return null;

              return (
                <>
                  {(() => {
  const predictions = getPredictionsObject();
  if (!predictions) return null;

  return (
    <>
      {renderPrediction("Naive Bayes", predictions.naive_bayes)}
      {renderPrediction("k-Nearest Neighbour", predictions.knn)}
      {renderPrediction("Neural Network", predictions.neural_network)}
    </>
  );
})()}
                </>
              );
            })()}

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <h2>Overall Recommendation:</h2>
              <p
                style={{
                  fontWeight: "bold",
                  color: getOverallDecision() === "Suitable" ? "green" : "red",
                }}
              >
                {getOverallDecision()}
              </p>
            </div>

            {/* Feedback Section */}
            {result.feedback && result.feedback.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  backgroundColor: "#fff4f4",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#c0392b", marginBottom: "10px" }}>
                  Areas for Improvement
                </h3>
                <ul>
                  {result.feedback.map((item, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <Analytics />
    </div>
    
  );
}

export default App;
