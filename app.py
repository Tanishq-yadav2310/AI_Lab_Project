from flask import Flask, request, jsonify
from models.model_loader import predict_resume
from PyPDF2 import PdfReader
import re
import os

app = Flask(__name__)

# =========================
# Manual Prediction Route
# =========================

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    skill_match_score = data["skill_match_score"]
    experience_years = data["experience_years"]
    education_level = data["education_level"]
    certifications = data["certifications"]
    project_count = data["project_count"]

    features = [
        skill_match_score,
        experience_years,
        education_level,
        certifications,
        project_count
    ]

    predictions = predict_resume(features)

    # -------- Feedback Logic --------
    feedback = []

    if skill_match_score < 5:
        feedback.append("Improve technical skill match with job description.")

    if experience_years < 2:
        feedback.append("Gain more practical work experience.")

    if education_level < 1:
        feedback.append("Higher education qualification may improve profile strength.")

    if certifications < 1:
        feedback.append("Consider adding relevant certifications.")

    if project_count < 2:
        feedback.append("Include more academic or personal projects.")

    return jsonify({
        "predictions": predictions,
        "feedback": feedback
    })

# =========================
# Upload Resume Route
# =========================

@app.route("/upload_resume", methods=["POST"])
def upload_resume():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    reader = PdfReader(file)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    text = text.lower()

    # --- NLP Feature Extraction ---

    skill_keywords = ["python", "java", "react", "node", "mongodb", "machine learning"]
    skill_match_score = sum(1 for skill in skill_keywords if skill in text)

    experience_years = 0
    exp_match = re.findall(r"(\d+)\s+years", text)
    if exp_match:
        experience_years = max(int(year) for year in exp_match)

    education_level = 2 if "b.tech" in text or "bachelor" in text else 1 if "diploma" in text else 0
    certifications = text.count("certified")
    project_count = text.count("project")

    features = [
        skill_match_score,
        experience_years,
        education_level,
        certifications,
        project_count
    ]

    print("Extracted Features:", features)

    predictions = predict_resume(features)

    # -------- Feedback Logic --------
    feedback = []

    if skill_match_score < 5:
        feedback.append("Improve technical skill match with job description.")

    if experience_years < 2:
        feedback.append("Gain more practical work experience.")

    if education_level < 1:
        feedback.append("Higher education qualification may improve profile strength.")

    if certifications < 1:
        feedback.append("Consider adding relevant certifications.")

    if project_count < 2:
        feedback.append("Include more academic or personal projects.")

    return jsonify({
        "predictions": predictions,
        "feedback": feedback
    })

# =========================
# Run Server
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)