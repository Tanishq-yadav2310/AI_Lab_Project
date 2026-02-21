AI Resume Analyzer

Artificial Intelligence Lab Project

Overview

This project is an AI-based Resume Analyzer developed as part of my Artificial Intelligence Lab coursework. The main goal of this project is to analyze a candidate’s resume and predict whether the candidate is suitable or not suitable based on extracted features.

The system supports two modes:

Manual feature entry

Uploading a PDF resume for automatic analysis

The project combines Machine Learning models with a React frontend and a Flask backend.

How It Works

When a resume is analyzed, the system evaluates five main features:

Skill Match Score

Experience (Years)

Education Level

Certifications Count

Project Count

For uploaded resumes, the system extracts text from the PDF and automatically calculates these features using simple NLP-based logic.

The extracted features are then passed to trained machine learning models which generate predictions.

Machine Learning Models Used

I trained and compared three different models:

Naive Bayes

k-Nearest Neighbour (kNN)

Neural Network (MLPClassifier)

Each model predicts whether the candidate is Suitable or Not Suitable and also provides a confidence score.

The final decision is based on majority voting across the three models.

Additional Feature

The system also shows:

Confidence percentage for each model

Visual confidence bars

Overall recommendation

Areas of improvement (for example, low experience or low skill score)

This makes the output more meaningful instead of just showing a simple classification result.

Tech Stack

Frontend:

React

Axios

Backend:

Flask

PyPDF2 (for resume parsing)

scikit-learn

Database:

MongoDB (for storing analyzed resumes)

Project Structure
backend/        → Flask backend
frontend/       → React frontend
models/         → Trained ML models
data/           → Generated training dataset
generate_dataset.py
train_models.py
app.py
Dataset

The dataset is synthetically generated using a custom dataset generator script.
After refining the generator logic, I retrained all models to better align with real resume feature distributions.

Versioning

v1.0 – Basic prediction system

v1.1 – Improved dataset, retrained models, upload functionality, UI improvements, and area of improvement logic

What I Learned

Through this project, I learned:

How to generate and refine datasets

How model bias can affect predictions

Training and evaluating multiple ML models

Integrating ML with a web application

Connecting React frontend with Flask backend

Version control using Git and GitHub

Future Improvements

Some possible improvements:

Better NLP feature extraction

Real-world dataset training

Deploying the application online

Adding authentication and user accounts
