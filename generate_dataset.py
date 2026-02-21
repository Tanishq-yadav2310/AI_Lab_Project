import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

data_size = 2000

data = pd.DataFrame({
    "skill_match_score": np.random.randint(0, 11, data_size),
    "experience_years": np.random.randint(0, 9, data_size),
    "education_level": np.random.randint(0, 3, data_size),
    "certifications": np.random.randint(0, 6, data_size),
    "project_count": np.random.randint(0, 11, data_size),
})

# Weighted scoring system
weights = {
    "skill_match_score": 0.35,
    "experience_years": 0.30,
    "education_level": 0.10,
    "certifications": 0.10,
    "project_count": 0.15
}

max_possible_score = (
    10 * weights["skill_match_score"] +
    8 * weights["experience_years"] +
    2 * weights["education_level"] +
    5 * weights["certifications"] +
    10 * weights["project_count"]
)

scores = (
    data["skill_match_score"] * weights["skill_match_score"] +
    data["experience_years"] * weights["experience_years"] +
    data["education_level"] * weights["education_level"] +
    data["certifications"] * weights["certifications"] +
    data["project_count"] * weights["project_count"]
)
normalized_scores = scores / max_possible_score
# Sigmoid transformation
probabilities = 1 / (1 + np.exp(-5 * (normalized_scores - 0.5)))

# Probabilistic labeling
data["suitable"] = [
    1 if random.random() < prob else 0
    for prob in probabilities
]

data.to_csv("data/resume_dataset.csv", index=False)

print("New realistic dataset generated successfully")
print(data["suitable"].value_counts())