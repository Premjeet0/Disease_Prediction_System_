export interface DiabetesInput {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface HeartInput {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface PredictionResult {
  prediction: 0 | 1;
  confidence: number;
  risk_percentage: number;
  risk_level: 'Low' | 'Moderate' | 'High';
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
}

export interface AllMetrics {
  diabetes: Record<string, ModelMetrics>;
  heart: Record<string, ModelMetrics>;
}
