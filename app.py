from flask import Flask, request, jsonify
from models.model_loader import predict_resume
from PyPDF2 import PdfReader
import re

app = Flask(__name__)

# =========================
# Manual Prediction Route
# =========================

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [
        data["skill_match_score"],
        data["experience_years"],
        data["education_level"],
        data["certifications"],
        data["project_count"]
    ]

    result = predict_resume(features)

    return jsonify(result)


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

    return jsonify({"predictions": predictions})


# =========================
# Run Server
# =========================

if __name__ == "__main__":
    app.run(port=8000, debug=True)