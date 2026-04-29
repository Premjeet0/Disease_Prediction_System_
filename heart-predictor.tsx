'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { PredictionResult } from '@/types/predictions';

export function HeartPredictor() {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
  });

  const [modelType, setModelType] = useState('random_forest');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setError('');
    setResult(null);

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

      const response = await fetch('/api/predict/heart', {
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
          <CardTitle>Heart Disease Risk Assessment</CardTitle>
          <CardDescription>
            Enter your cardiac metrics to predict heart disease risk
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
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter age (29-77)"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={formData.sex} onValueChange={(val) => handleSelectChange('sex', val)}>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Female (0)</SelectItem>
                  <SelectItem value="1">Male (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cp">Chest Pain Type</Label>
              <Select value={formData.cp} onValueChange={(val) => handleSelectChange('cp', val)}>
                <SelectTrigger id="cp">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Typical Angina (0)</SelectItem>
                  <SelectItem value="1">Atypical Angina (1)</SelectItem>
                  <SelectItem value="2">Non-anginal Pain (2)</SelectItem>
                  <SelectItem value="3">Asymptomatic (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trestbps">Resting Blood Pressure</Label>
              <Input
                id="trestbps"
                name="trestbps"
                type="number"
                placeholder="Enter mmHg (90-200)"
                value={formData.trestbps}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chol">Serum Cholesterol</Label>
              <Input
                id="chol"
                name="chol"
                type="number"
                placeholder="Enter mg/dl (100-570)"
                value={formData.chol}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fbs">Fasting Blood Sugar &gt; 120 mg/dl</Label>
              <Select value={formData.fbs} onValueChange={(val) => handleSelectChange('fbs', val)}>
                <SelectTrigger id="fbs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No (0)</SelectItem>
                  <SelectItem value="1">Yes (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restecg">Resting ECG</Label>
              <Select value={formData.restecg} onValueChange={(val) => handleSelectChange('restecg', val)}>
                <SelectTrigger id="restecg">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Normal (0)</SelectItem>
                  <SelectItem value="1">ST-T Abnormality (1)</SelectItem>
                  <SelectItem value="2">LV Hypertrophy (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thalach">Max Heart Rate Achieved</Label>
              <Input
                id="thalach"
                name="thalach"
                type="number"
                placeholder="Enter bpm (60-203)"
                value={formData.thalach}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exang">Exercise Induced Angina</Label>
              <Select value={formData.exang} onValueChange={(val) => handleSelectChange('exang', val)}>
                <SelectTrigger id="exang">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No (0)</SelectItem>
                  <SelectItem value="1">Yes (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldpeak">ST Depression</Label>
              <Input
                id="oldpeak"
                name="oldpeak"
                type="number"
                placeholder="Enter mm (0-6.2)"
                value={formData.oldpeak}
                onChange={handleChange}
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slope">ST Segment Slope</Label>
              <Select value={formData.slope} onValueChange={(val) => handleSelectChange('slope', val)}>
                <SelectTrigger id="slope">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Upsloping (0)</SelectItem>
                  <SelectItem value="1">Flat (1)</SelectItem>
                  <SelectItem value="2">Downsloping (2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ca">Major Vessels Colored</Label>
              <Select value={formData.ca} onValueChange={(val) => handleSelectChange('ca', val)}>
                <SelectTrigger id="ca">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 vessels</SelectItem>
                  <SelectItem value="1">1 vessel</SelectItem>
                  <SelectItem value="2">2 vessels</SelectItem>
                  <SelectItem value="3">3 vessels</SelectItem>
                  <SelectItem value="4">4 vessels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thal">Thalassemia</Label>
              <Select value={formData.thal} onValueChange={(val) => handleSelectChange('thal', val)}>
                <SelectTrigger id="thal">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Normal (0)</SelectItem>
                  <SelectItem value="1">Fixed Defect (1)</SelectItem>
                  <SelectItem value="2">Reversible Defect (2)</SelectItem>
                  <SelectItem value="3">Unknown (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  'High risk of heart disease detected. Seek immediate medical attention and cardiac evaluation.'}
                {result.risk_level === 'Moderate' &&
                  'Moderate risk detected. Schedule a consultation with a cardiologist and consider lifestyle modifications.'}
                {result.risk_level === 'Low' &&
                  'Low risk detected. Continue with regular health monitoring and heart-healthy practices.'}
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
