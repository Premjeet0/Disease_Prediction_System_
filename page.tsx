'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiabetesPredictor } from '@/components/diabetes-predictor';
import { HeartPredictor } from '@/components/heart-predictor';
import { Activity, Heart, TrendingUp, AlertCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('diabetes');

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">Disease Prediction AI</h1>
          </div>
          <p className="text-cyan-100 text-lg">
            Advanced ML-based health risk assessment using clinical data
          </p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Multiple Models</CardTitle>
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Compare predictions across Logistic Regression, Random Forest, and Gradient Boosting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Risk Scoring</CardTitle>
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get detailed risk percentages and confidence scores for informed decisions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Privacy First</CardTitle>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All predictions run locally. Your health data stays private and secure
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Predictors */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white p-1 border border-gray-200 rounded-lg">
            <TabsTrigger 
              value="diabetes" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              Diabetes Risk
            </TabsTrigger>
            <TabsTrigger 
              value="heart" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              Heart Disease Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diabetes" className="space-y-6">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-cyan-900 mb-1">About Diabetes Prediction</h4>
                  <p className="text-sm text-cyan-800">
                    This model predicts diabetes risk based on clinical indicators including glucose levels, BMI, blood pressure, and family history. Trained on the Pima Indians Diabetes Dataset.
                  </p>
                </div>
              </div>
            </div>
            <DiabetesPredictor />
          </TabsContent>

          <TabsContent value="heart" className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">About Heart Disease Prediction</h4>
                  <p className="text-sm text-blue-800">
                    This model predicts cardiovascular disease risk using cardiac metrics including cholesterol, blood pressure, heart rate, and ECG data. Based on multi-center clinical datasets.
                  </p>
                </div>
              </div>
            </div>
            <HeartPredictor />
          </TabsContent>
        </Tabs>

        {/* Medical Disclaimer */}
        <Card className="mt-12 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Important Medical Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-800 space-y-3">
            <p>
              This Disease Prediction AI tool is designed for educational and informational purposes only. It is NOT intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p>
              The predictions made by this AI model are based on machine learning algorithms and should never be used as a substitute for professional medical advice, diagnosis, or treatment from a qualified healthcare provider.
            </p>
            <p>
              Always consult with a licensed physician or appropriate healthcare professional before making any health-related decisions based on the results provided by this tool.
            </p>
            <p className="font-semibold">
              Your health and safety are our top priority. Please seek professional medical guidance for any health concerns.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
