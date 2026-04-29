'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { PredictionResult } from '@/types/predictions';

export function DiabetesPredictor() {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: '',
  });

  const [modelType, setModelType] = useState('random_forest');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setError('');
    setResult(null);

    // Validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        setError(`Please fill in all fields. Missing: ${key}`);
        return;
      }
    }

    setLoading(true);
    try {
      const features = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, parseFloat(v)])
      );

      const response = await fetch('/api/predict/diabetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, model_type: modelType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-red-600';
      case 'Moderate':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-50 border-red-200';
      case 'Moderate':
        return 'bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diabetes Risk Assessment</CardTitle>
          <CardDescription>
            Enter your health metrics to predict diabetes risk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Prediction Model</Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random_forest">Random Forest (Recommended)</SelectItem>
                <SelectItem value="logistic_regression">Logistic Regression</SelectItem>
                <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {key === 'DiabetesPedigreeFunction' ? 'Diabetes Pedigree Function' : key}
                </Label>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  placeholder={`Enter ${key}`}
                  value={value}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
            size="lg"
          >
            {loading ? 'Analyzing...' : 'Predict Risk'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className={`border-2 ${getRiskBgColor(result.risk_level)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.risk_level === 'High' ? (
                <AlertTriangle className={`w-6 h-6 ${getRiskColor(result.risk_level)}`} />
              ) : (
                <CheckCircle className={`w-6 h-6 ${getRiskColor(result.risk_level)}`} />
              )}
              <span className={getRiskColor(result.risk_level)}>
                {result.risk_level} Risk
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Risk Percentage</p>
                <p className={`text-3xl font-bold ${getRiskColor(result.risk_level)}`}>
                  {result.risk_percentage.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-3xl font-bold text-cyan-600">
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Interpretation</h4>
              <p className="text-sm text-gray-700">
                {result.risk_level === 'High' &&
                  'High risk detected. Consider consulting with a healthcare professional for further evaluation and preventive measures.'}
                {result.risk_level === 'Moderate' &&
                  'Moderate risk detected. Focus on lifestyle changes including diet, exercise, and regular monitoring.'}
                {result.risk_level === 'Low' &&
                  'Low risk detected. Continue maintaining healthy lifestyle habits and regular health checkups.'}
              </p>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-gray-700">
              <strong>Disclaimer:</strong> This is an AI-based prediction tool and should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
