"""
Disease Prediction ML Models Training
Trains Logistic Regression, Random Forest, and Gradient Boosting models
for Diabetes and Heart Disease prediction using Kaggle datasets.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score
)
import joblib
import json
from pathlib import Path

# Create output directory
Path("models").mkdir(exist_ok=True)
Path("data").mkdir(exist_ok=True)

# ============================================================================
# DIABETES DATASET
# ============================================================================
print("=" * 80)
print("TRAINING DIABETES PREDICTION MODELS")
print("=" * 80)

# Download and prepare diabetes dataset
diabetes_url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
diabetes_columns = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                    'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome']

try:
    df_diabetes = pd.read_csv(diabetes_url, names=diabetes_columns)
    print(f"✓ Diabetes dataset loaded: {df_diabetes.shape[0]} samples, {df_diabetes.shape[1]-1} features")
except:
    print("⚠ Could not download diabetes dataset. Creating synthetic data...")
    np.random.seed(42)
    n_samples = 768
    df_diabetes = pd.DataFrame({
        'Pregnancies': np.random.randint(0, 17, n_samples),
        'Glucose': np.random.randint(0, 200, n_samples),
        'BloodPressure': np.random.randint(0, 123, n_samples),
        'SkinThickness': np.random.randint(0, 100, n_samples),
        'Insulin': np.random.randint(0, 847, n_samples),
        'BMI': np.random.uniform(18, 68, n_samples),
        'DiabetesPedigreeFunction': np.random.uniform(0, 2.5, n_samples),
        'Age': np.random.randint(21, 82, n_samples),
        'Outcome': np.random.randint(0, 2, n_samples)
    })

# Handle missing values - only replace 0 with NaN in specific columns that shouldn't be 0
zero_columns = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
for col in zero_columns:
    df_diabetes[col] = df_diabetes[col].replace(0, np.nan)
df_diabetes = df_diabetes.fillna(df_diabetes.mean())

X_diabetes = df_diabetes.drop('Outcome', axis=1)
y_diabetes = df_diabetes['Outcome']

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(
    X_diabetes, y_diabetes, test_size=0.2, random_state=42, stratify=y_diabetes
)

scaler_d = StandardScaler()
X_train_d_scaled = scaler_d.fit_transform(X_train_d)
X_test_d_scaled = scaler_d.transform(X_test_d)

diabetes_models = {}
diabetes_metrics = {}

# Logistic Regression
print("\nTraining Logistic Regression (Diabetes)...")
lr_d = LogisticRegression(max_iter=1000, random_state=42)
lr_d.fit(X_train_d_scaled, y_train_d)
y_pred_lr_d = lr_d.predict(X_test_d_scaled)
diabetes_models['logistic_regression'] = lr_d
diabetes_metrics['logistic_regression'] = {
    'accuracy': float(accuracy_score(y_test_d, y_pred_lr_d)),
    'precision': float(precision_score(y_test_d, y_pred_lr_d)),
    'recall': float(recall_score(y_test_d, y_pred_lr_d)),
    'f1': float(f1_score(y_test_d, y_pred_lr_d)),
    'roc_auc': float(roc_auc_score(y_test_d, lr_d.predict_proba(X_test_d_scaled)[:, 1]))
}
print(f"  Accuracy: {diabetes_metrics['logistic_regression']['accuracy']:.4f}")

# Random Forest
print("Training Random Forest (Diabetes)...")
rf_d = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_d.fit(X_train_d_scaled, y_train_d)
y_pred_rf_d = rf_d.predict(X_test_d_scaled)
diabetes_models['random_forest'] = rf_d
diabetes_metrics['random_forest'] = {
    'accuracy': float(accuracy_score(y_test_d, y_pred_rf_d)),
    'precision': float(precision_score(y_test_d, y_pred_rf_d)),
    'recall': float(recall_score(y_test_d, y_pred_rf_d)),
    'f1': float(f1_score(y_test_d, y_pred_rf_d)),
    'roc_auc': float(roc_auc_score(y_test_d, rf_d.predict_proba(X_test_d_scaled)[:, 1]))
}
print(f"  Accuracy: {diabetes_metrics['random_forest']['accuracy']:.4f}")

# Gradient Boosting
print("Training Gradient Boosting (Diabetes)...")
gb_d = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb_d.fit(X_train_d_scaled, y_train_d)
y_pred_gb_d = gb_d.predict(X_test_d_scaled)
diabetes_models['gradient_boosting'] = gb_d
diabetes_metrics['gradient_boosting'] = {
    'accuracy': float(accuracy_score(y_test_d, y_pred_gb_d)),
    'precision': float(precision_score(y_test_d, y_pred_gb_d)),
    'recall': float(recall_score(y_test_d, y_pred_gb_d)),
    'f1': float(f1_score(y_test_d, y_pred_gb_d)),
    'roc_auc': float(roc_auc_score(y_test_d, gb_d.predict_proba(X_test_d_scaled)[:, 1]))
}
print(f"  Accuracy: {diabetes_metrics['gradient_boosting']['accuracy']:.4f}")

# ============================================================================
# HEART DISEASE DATASET
# ============================================================================
print("\n" + "=" * 80)
print("TRAINING HEART DISEASE PREDICTION MODELS")
print("=" * 80)

# Download and prepare heart disease dataset
heart_url = "https://raw.githubusercontent.com/datasets/heart-disease/master/data/heart.csv"
try:
    df_heart = pd.read_csv(heart_url)
    print(f"✓ Heart disease dataset loaded: {df_heart.shape[0]} samples, {df_heart.shape[1]-1} features")
except:
    print("⚠ Could not download heart disease dataset. Creating synthetic data...")
    np.random.seed(42)
    n_samples = 1025
    df_heart = pd.DataFrame({
        'age': np.random.randint(29, 77, n_samples),
        'sex': np.random.randint(0, 2, n_samples),
        'cp': np.random.randint(0, 4, n_samples),
        'trestbps': np.random.randint(90, 200, n_samples),
        'chol': np.random.randint(100, 570, n_samples),
        'fbs': np.random.randint(0, 2, n_samples),
        'restecg': np.random.randint(0, 3, n_samples),
        'thalach': np.random.randint(60, 203, n_samples),
        'exang': np.random.randint(0, 2, n_samples),
        'oldpeak': np.random.uniform(0, 6.2, n_samples),
        'slope': np.random.randint(0, 3, n_samples),
        'ca': np.random.randint(0, 5, n_samples),
        'thal': np.random.randint(0, 4, n_samples),
        'target': np.random.randint(0, 2, n_samples)
    })

# Standardize column names
df_heart.columns = [col.lower() for col in df_heart.columns]
if 'target' not in df_heart.columns:
    df_heart['target'] = (df_heart.iloc[:, -1] > 0).astype(int)

# Handle missing values
df_heart = df_heart.fillna(df_heart.mean())

X_heart = df_heart.drop('target', axis=1)
y_heart = df_heart['target']

X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(
    X_heart, y_heart, test_size=0.2, random_state=42, stratify=y_heart
)

scaler_h = StandardScaler()
X_train_h_scaled = scaler_h.fit_transform(X_train_h)
X_test_h_scaled = scaler_h.transform(X_test_h)

heart_models = {}
heart_metrics = {}

# Logistic Regression
print("\nTraining Logistic Regression (Heart Disease)...")
lr_h = LogisticRegression(max_iter=1000, random_state=42)
lr_h.fit(X_train_h_scaled, y_train_h)
y_pred_lr_h = lr_h.predict(X_test_h_scaled)
heart_models['logistic_regression'] = lr_h
heart_metrics['logistic_regression'] = {
    'accuracy': float(accuracy_score(y_test_h, y_pred_lr_h)),
    'precision': float(precision_score(y_test_h, y_pred_lr_h)),
    'recall': float(recall_score(y_test_h, y_pred_lr_h)),
    'f1': float(f1_score(y_test_h, y_pred_lr_h)),
    'roc_auc': float(roc_auc_score(y_test_h, lr_h.predict_proba(X_test_h_scaled)[:, 1]))
}
print(f"  Accuracy: {heart_metrics['logistic_regression']['accuracy']:.4f}")

# Random Forest
print("Training Random Forest (Heart Disease)...")
rf_h = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_h.fit(X_train_h_scaled, y_train_h)
y_pred_rf_h = rf_h.predict(X_test_h_scaled)
heart_models['random_forest'] = rf_h
heart_metrics['random_forest'] = {
    'accuracy': float(accuracy_score(y_test_h, y_pred_rf_h)),
    'precision': float(precision_score(y_test_h, y_pred_rf_h)),
    'recall': float(recall_score(y_test_h, y_pred_rf_h)),
    'f1': float(f1_score(y_test_h, y_pred_rf_h)),
    'roc_auc': float(roc_auc_score(y_test_h, rf_h.predict_proba(X_test_h_scaled)[:, 1]))
}
print(f"  Accuracy: {heart_metrics['random_forest']['accuracy']:.4f}")

# Gradient Boosting
print("Training Gradient Boosting (Heart Disease)...")
gb_h = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb_h.fit(X_train_h_scaled, y_train_h)
y_pred_gb_h = gb_h.predict(X_test_h_scaled)
heart_models['gradient_boosting'] = gb_h
heart_metrics['gradient_boosting'] = {
    'accuracy': float(accuracy_score(y_test_h, y_pred_gb_h)),
    'precision': float(precision_score(y_test_h, y_pred_gb_h)),
    'recall': float(recall_score(y_test_h, y_pred_gb_h)),
    'f1': float(f1_score(y_test_h, y_pred_gb_h)),
    'roc_auc': float(roc_auc_score(y_test_h, gb_h.predict_proba(X_test_h_scaled)[:, 1]))
}
print(f"  Accuracy: {heart_metrics['gradient_boosting']['accuracy']:.4f}")

# ============================================================================
# SAVE MODELS AND METADATA
# ============================================================================
print("\n" + "=" * 80)
print("SAVING MODELS AND METADATA")
print("=" * 80)

# Save Diabetes models and scaler
joblib.dump(diabetes_models['logistic_regression'], 'models/diabetes_logistic_regression.pkl')
joblib.dump(diabetes_models['random_forest'], 'models/diabetes_random_forest.pkl')
joblib.dump(diabetes_models['gradient_boosting'], 'models/diabetes_gradient_boosting.pkl')
joblib.dump(scaler_d, 'models/diabetes_scaler.pkl')

# Save Heart models and scaler
joblib.dump(heart_models['logistic_regression'], 'models/heart_logistic_regression.pkl')
joblib.dump(heart_models['random_forest'], 'models/heart_random_forest.pkl')
joblib.dump(heart_models['gradient_boosting'], 'models/heart_gradient_boosting.pkl')
joblib.dump(scaler_h, 'models/heart_scaler.pkl')

# Save feature names
with open('models/diabetes_features.json', 'w') as f:
    json.dump(X_diabetes.columns.tolist(), f)

with open('models/heart_features.json', 'w') as f:
    json.dump(X_heart.columns.tolist(), f)

# Save metrics
with open('models/diabetes_metrics.json', 'w') as f:
    json.dump(diabetes_metrics, f, indent=2)

with open('models/heart_metrics.json', 'w') as f:
    json.dump(heart_metrics, f, indent=2)

print("✓ Diabetes models saved:")
print("  - diabetes_logistic_regression.pkl")
print("  - diabetes_random_forest.pkl")
print("  - diabetes_gradient_boosting.pkl")
print("  - diabetes_scaler.pkl")

print("✓ Heart disease models saved:")
print("  - heart_logistic_regression.pkl")
print("  - heart_random_forest.pkl")
print("  - heart_gradient_boosting.pkl")
print("  - heart_scaler.pkl")

print("\n" + "=" * 80)
print("DIABETES MODEL METRICS")
print("=" * 80)
for model, metrics in diabetes_metrics.items():
    print(f"\n{model.upper()}:")
    for metric, value in metrics.items():
        print(f"  {metric}: {value:.4f}")

print("\n" + "=" * 80)
print("HEART DISEASE MODEL METRICS")
print("=" * 80)
for model, metrics in heart_metrics.items():
    print(f"\n{model.upper()}:")
    for metric, value in metrics.items():
        print(f"  {metric}: {value:.4f}")

print("\n" + "=" * 80)
print("✓ TRAINING COMPLETE")
print("=" * 80)
