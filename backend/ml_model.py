"""
Python ML Backend for Patient Risk Prediction
This would be your Flask/FastAPI backend that trains and serves ML predictions
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
label_encoder = LabelEncoder()
model_stats = {}

def preprocess_patient_data(patients_data):
    """
    Convert patient data into features for ML model
    """
    df = pd.DataFrame(patients_data)
    
    # Feature engineering
    df['age_group'] = pd.cut(df['age'], bins=[0, 30, 50, 70, 100], labels=[0, 1, 2, 3])
    
    # Encode risk level
    risk_mapping = {'Low': 0, 'Medium': 1, 'High': 2}
    df['risk_encoded'] = df['riskLevel'].map(risk_mapping)
    
    # Additional features can be added here
    # - medical history text analysis
    # - visit frequency
    # - diagnosis patterns
    
    features = ['age', 'age_group', 'risk_encoded']
    X = df[features].fillna(0)
    y = df['risk_encoded'] if 'riskLevel' in df.columns else None
    
    return X, y, df

@app.route('/api/ml/train', methods=['POST'])
def train_model():
    """
    Train the ML model with patient historical data
    """
    global model, model_stats
    
    try:
        patients_data = request.json.get('patients', [])
        
        if len(patients_data) < 10:
            return jsonify({
                'error': 'Insufficient data. Need at least 10 patients to train model.'
            }), 400
        
        # Preprocess data
        X, y, df = preprocess_patient_data(patients_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train Random Forest Classifier
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Store model statistics
        model_stats = {
            'totalPatientsTrained': len(patients_data),
            'modelAccuracy': float(accuracy),
            'lastTrainedDate': datetime.now().isoformat(),
            'features': list(X.columns),
            'featureImportance': dict(zip(X.columns, model.feature_importances_.tolist()))
        }
        
        # Save model
        joblib.dump(model, 'patient_risk_model.pkl')
        
        return jsonify(model_stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/predict', methods=['POST'])
def predict_risk():
    """
    Generate risk predictions for patients
    """
    global model
    
    try:
        if model is None:
            return jsonify({
                'error': 'Model not trained. Please train the model first.'
            }), 400
        
        patients_data = request.json.get('patients', [])
        
        if not patients_data:
            return jsonify({'error': 'No patient data provided'}), 400
        
        # Preprocess data
        X, _, df = preprocess_patient_data(patients_data)
        
        # Make predictions
        predictions = model.predict(X)
        probabilities = model.predict_proba(X)
        
        # Get feature importance for explanations
        feature_importance = dict(zip(X.columns, model.feature_importances_))
        
        # Format results
        results = []
        risk_labels = ['Low', 'Medium', 'High']
        
        for idx, patient in enumerate(patients_data):
            pred_risk = risk_labels[predictions[idx]]
            confidence = float(probabilities[idx][predictions[idx]])
            
            # Identify key risk factors
            factors = []
            if patient['age'] > 60:
                factors.append('Advanced age (>60 years)')
            if patient['riskLevel'] == 'High':
                factors.append('Current high risk status')
            if patient['age'] > 40 and patient['riskLevel'] != 'Low':
                factors.append('Age and risk combination')
            
            if not factors:
                factors = ['No significant risk factors identified']
            
            # Generate recommendation
            recommendations = {
                'High': 'Immediate follow-up recommended. Schedule comprehensive evaluation.',
                'Medium': 'Monitor closely. Schedule follow-up within 2-4 weeks.',
                'Low': 'Continue routine care. Regular check-ups as scheduled.'
            }
            
            results.append({
                'patientId': patient['id'],
                'patientName': patient['name'],
                'predictedRisk': pred_risk,
                'confidence': confidence,
                'factors': factors,
                'recommendation': recommendations[pred_risk]
            })
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/model-info', methods=['GET'])
def get_model_info():
    """
    Get current model information and statistics
    """
    if model is None:
        return jsonify({'error': 'No model trained yet'}), 404
    
    return jsonify(model_stats), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)