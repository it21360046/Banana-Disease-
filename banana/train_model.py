import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_squared_error, accuracy_score, classification_report
import joblib

# Load the dataset
df = pd.read_csv('disease_spread_dataset.csv')

# Convert date to datetime
df['Date'] = pd.to_datetime(df['Date'], format='%d/%m/%Y')
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day

# Prepare features and targets
X = df[['Latitude', 'Longitude', 'Temperature_C', 'Humidity_%', 'Wind_Speed_kmph', 'Month', 'Day']]
y_spread = df['Spread_Percentage']
y_risk = df['Risk_Level']

# Split the data
X_train, X_test, y_spread_train, y_spread_test, y_risk_train, y_risk_test = train_test_split(
    X, y_spread, y_risk, test_size=0.2, random_state=42
)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Encode risk levels
le = LabelEncoder()
y_risk_train_encoded = le.fit_transform(y_risk_train)
y_risk_test_encoded = le.transform(y_risk_test)

# Train spread percentage model
spread_model = RandomForestRegressor(n_estimators=100, random_state=42)
spread_model.fit(X_train_scaled, y_spread_train)

# Train risk level model
risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
risk_model.fit(X_train_scaled, y_risk_train_encoded)

# Evaluate spread percentage model
spread_pred = spread_model.predict(X_test_scaled)
spread_mse = mean_squared_error(y_spread_test, spread_pred)
print(f"\nSpread Percentage Model Performance:")
print(f"Mean Squared Error: {spread_mse:.2f}")
print(f"Root Mean Squared Error: {np.sqrt(spread_mse):.2f}")

# Evaluate risk level model
risk_pred = risk_model.predict(X_test_scaled)
risk_accuracy = accuracy_score(y_risk_test_encoded, risk_pred)
print(f"\nRisk Level Model Performance:")
print(f"Accuracy: {risk_accuracy:.2f}")
print("\nClassification Report:")
print(classification_report(y_risk_test_encoded, risk_pred, target_names=le.classes_))

# Save the models and scaler
joblib.dump(spread_model, 'spread_model.joblib')
joblib.dump(risk_model, 'risk_model.joblib')
joblib.dump(scaler, 'scaler.joblib')
joblib.dump(le, 'label_encoder.joblib')

print("\nModels and scaler have been saved to disk.") 