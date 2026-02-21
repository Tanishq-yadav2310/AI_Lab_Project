import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix



# Load dataset
data = pd.read_csv("data/resume_dataset.csv")

# Separate features and label
X = data.drop("suitable", axis=1)
y = data["suitable"]

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)


# Create Naive Bayes model
nb_model = GaussianNB()

# Train model
nb_model.fit(X_train, y_train)

# Make predictions
y_pred = nb_model.predict(X_test)

# Evaluate performance
print("Naive Bayes Results")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Precision:", precision_score(y_test, y_pred))
print("Recall:", recall_score(y_test, y_pred))
print("F1 Score:", f1_score(y_test, y_pred))

print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# Create kNN model
knn_model = KNeighborsClassifier(n_neighbors=25)

# Train
knn_model.fit(X_train, y_train)

# Predict
knn_pred = knn_model.predict(X_test)

print("\nk-Nearest Neighbour Results")
print("Accuracy:", accuracy_score(y_test, knn_pred))
print("Precision:", precision_score(y_test, knn_pred))
print("Recall:", recall_score(y_test, knn_pred))
print("F1 Score:", f1_score(y_test, knn_pred))

print("Confusion Matrix:")
print(confusion_matrix(y_test, knn_pred))


# Neural Network
nn_model = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=1000, random_state=42)

nn_model.fit(X_train, y_train)

nn_pred = nn_model.predict(X_test)

print("\nNeural Network Results")
print("Accuracy:", accuracy_score(y_test, nn_pred))
print("Precision:", precision_score(y_test, nn_pred))
print("Recall:", recall_score(y_test, nn_pred))
print("F1 Score:", f1_score(y_test, nn_pred))

print("Confusion Matrix:")
print(confusion_matrix(y_test, nn_pred))
