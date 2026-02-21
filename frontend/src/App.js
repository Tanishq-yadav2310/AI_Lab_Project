import React, { useState } from "react";
import axios from "axios";

function App() {

  const [formData, setFormData] = useState({
    skill_match_score: "",
    experience_years: "",
    education_level: "",
    certifications: "",
    project_count: ""
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
    outline: "none"
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/api/resume/analyze",
        formData
      );

      setTimeout(() => {
        setResult(response.data.predictions);
        setLoading(false);
      }, 1200);

    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append("file", uploadedFile);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:4000/api/resume/upload",
        formData
      );

      setTimeout(() => {
        setResult(response.data.predictions);
        setLoading(false);
      }, 1200);

    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  const renderPrediction = (modelName, modelData) => {
    const isSuitable = modelData.prediction === 1;

    const probabilitySuitable = modelData.confidence;
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

  const getOverallDecision = () => {
    if (!result) return null;

    const votes = [
      result.naive_bayes.prediction,
      result.knn.prediction,
      result.neural_network.prediction
    ];

    const total = votes.reduce((a, b) => a + b, 0);
    return total >= 2 ? "Suitable" : "Not Suitable";
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f6f9",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "50px"
    }}>
      <div style={{
        width: "650px",
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
      }}>

        {/* Top Title */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <p style={{
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "1px",
            margin: "0"
          }}>
            ARTIFICIAL INTELLIGENCE LAB PROJECT
          </p>
        </div>

        {/* Name + Logo */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <div>
            <h2 style={{ margin: "0" }}>Your Name Here</h2>
            <p style={{ margin: "5px 0", color: "#555" }}>
              Roll No: Your Roll Number Here
            </p>
          </div>

          <img
            src="/your-logo.png"
            alt="Institute Logo"
            style={{
              width: "110px",
              height: "110px",
              objectFit: "contain"
            }}
          />
        </div>

        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          AI Resume Analyzer
        </h1>

        {/* Mode Selection */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px"
        }}>
          <button
            onClick={() => setMode("manual")}
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
              transform:
                hoveredButton === "manual"
                  ? "scale(1.08) translateY(-2px)"
                  : "scale(1)",
              boxShadow:
                hoveredButton === "manual"
                  ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                  : "none",
              transition: "all 0.25s ease",
              cursor: "pointer"
            }}
          >
            Manual Entry
          </button>

          <button
            onClick={() => setMode("upload")}
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
              transform:
                hoveredButton === "upload"
                  ? "scale(1.08) translateY(-2px)"
                  : "scale(1)",
              boxShadow:
                hoveredButton === "upload"
                  ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                  : "none",
              transition: "all 0.25s ease",
              cursor: "pointer"
            }}
          >
            Upload Resume
          </button>
        </div>

        {/* Manual Form */}
        {mode === "manual" && (
          <form onSubmit={handleSubmit}>
            <input name="skill_match_score" placeholder="Skill Score (0-10)" onChange={handleChange} style={inputStyle} />
            <input name="experience_years" placeholder="Experience Years" onChange={handleChange} style={inputStyle} />
            <input name="education_level" placeholder="Education Level (0-2)" onChange={handleChange} style={inputStyle} />
            <input name="certifications" placeholder="Certifications Count" onChange={handleChange} style={inputStyle} />
            <input name="project_count" placeholder="Project Count" onChange={handleChange} style={inputStyle} />

            <button type="submit" disabled={loading} style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer"
            }}>
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
                cursor: uploadedFile ? "pointer" : "not-allowed"
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
            {renderPrediction("Naive Bayes", result.naive_bayes)}
            {renderPrediction("k-Nearest Neighbour", result.knn)}
            {renderPrediction("Neural Network", result.neural_network)}

            <div style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px"
            }}>
              <h2>Overall Recommendation:</h2>
              <p style={{
                fontWeight: "bold",
                color: getOverallDecision() === "Suitable" ? "green" : "red"
              }}>
                {getOverallDecision()}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;