import React, { useState } from "react";
import { Patient, MLPrediction, MLModelStats } from "../types/types";
import { trainMLModel, getPredictions } from "../services/mlService";

type AiInsightProps = {
  patients: Patient[];
};

export const AiInsight = ({ patients }: AiInsightProps) => {
  const [modelStats, setModelStats] = useState<MLModelStats | null>(null);
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [hasModel, setHasModel] = useState(false);

  const handleTrainModel = async () => {
    if (patients.length === 0) {
      alert("No patient data available to train the model");
      return;
    }

    setIsTraining(true);
    try {
      const stats = await trainMLModel(patients);
      setModelStats(stats);
      setHasModel(true);
    } catch (error) {
      console.error("Training error:", error);
      alert("Failed to train model");
    } finally {
      setIsTraining(false);
    }
  };

  const handleGeneratePredictions = async () => {
    if (!hasModel) {
      alert("Please train the model first");
      return;
    }

    if (patients.length === 0) {
      alert("No patients available for prediction");
      return;
    }

    setIsPredicting(true);
    try {
      const newPredictions = await getPredictions(patients);
      setPredictions(newPredictions);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to generate predictions");
    } finally {
      setIsPredicting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">AI Insight - ML Predictions</h1>
        <div className="flex gap-3">
          <button
            onClick={handleTrainModel}
            disabled={isTraining || patients.length === 0}
            className={`px-4 py-2 rounded font-medium ${
              isTraining || patients.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isTraining ? "Training..." : "Train Model"}
          </button>
          <button
            onClick={handleGeneratePredictions}
            disabled={!hasModel || isPredicting || patients.length === 0}
            className={`px-4 py-2 rounded font-medium ${
              !hasModel || isPredicting || patients.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isPredicting ? "Predicting..." : "Generate Predictions"}
          </button>
        </div>
      </div>

      {/* Model Statistics */}
      {modelStats && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Model Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-500 text-sm">Patients Trained</p>
              <p className="text-2xl font-bold">{modelStats.totalPatientsTrained}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-500 text-sm">Model Accuracy</p>
              <p className="text-2xl font-bold">{(modelStats.modelAccuracy * 100).toFixed(1)}%</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-500 text-sm">Last Trained</p>
              <p className="text-sm font-semibold mt-1">
                {new Date(modelStats.lastTrainedDate).toLocaleString()}
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-500 text-sm">Features Used</p>
              <p className="text-sm font-semibold mt-1">{modelStats.features.length} features</p>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Table */}
      {predictions.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Risk Predictions</h2>
            <p className="text-sm text-gray-500 mt-1">
              ML-based risk assessment for all patients
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">Patient</th>
                  <th className="p-4 text-left text-sm font-semibold">Predicted Risk</th>
                  <th className="p-4 text-left text-sm font-semibold">Confidence</th>
                  <th className="p-4 text-left text-sm font-semibold">Key Factors</th>
                  <th className="p-4 text-left text-sm font-semibold">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred.patientId} className="border-t hover:bg-gray-50">
                    <td className="p-4">{pred.patientName}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(pred.predictedRisk)}`}>
                        {pred.predictedRisk}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${pred.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{(pred.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <ul className="text-sm text-gray-600">
                        {pred.factors.map((factor: string, idx: number) => (
                          <li key={idx}>• {factor}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{pred.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">No Predictions Yet</h3>
          <p className="text-gray-500 mb-4">
            {!hasModel
              ? "Train the ML model with patient data to get started"
              : "Click 'Generate Predictions' to analyze patient risk"}
          </p>
        </div>
      )}
    </div>
  );
};