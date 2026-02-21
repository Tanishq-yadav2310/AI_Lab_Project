import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler

# Load dataset
data = pd.read_csv("data/resume_dataset.csv")

X = data.drop("suitable", axis=1)
y = data["suitable"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Train Naive Bayes
nb_model = GaussianNB()
nb_model.fit(X_train, y_train)

# Train kNN
knn_model = KNeighborsClassifier(n_neighbors=25)
knn_model.fit(X_train, y_train)

# Train Neural Network
nn_model = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=1000, random_state=42)
nn_model.fit(X_train, y_train)
def predict_resume(features):
    scaled_features = scaler.transform([features])

    nb_pred = nb_model.predict(scaled_features)[0]
    knn_pred = knn_model.predict(scaled_features)[0]
    nn_pred = nn_model.predict(scaled_features)[0]

    nb_prob = nb_model.predict_proba(scaled_features)[0][1]
    knn_prob = knn_model.predict_proba(scaled_features)[0][1]
    nn_prob = nn_model.predict_proba(scaled_features)[0][1]

    return {
        "naive_bayes": {
            "prediction": int(nb_pred),
            "confidence": float(round(nb_prob, 3))
        },
        "knn": {
            "prediction": int(knn_pred),
            "confidence": float(round(knn_prob, 3))
        },
        "neural_network": {
            "prediction": int(nn_pred),
            "confidence": float(round(nn_prob, 3))
        }
    }
