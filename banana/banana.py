from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from predict_disease_spread import calculate_spread_speed, get_risk_level, get_spread_area, plot_prediction

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/receive-data', methods=['POST'])
def receive_data():
    if request.method == 'POST':
        try:
            # Get data from either form or JSON
            if request.is_json:
                data = request.get_json()
                temperature = float(data.get('temperature'))
                humidity = float(data.get('humidity'))
            else:
                temperature = float(request.form.get('temperature'))
                humidity = float(request.form.get('humidity'))
            
            # Validate inputs
            if not all([temperature, humidity]):
                return jsonify({'error': 'Missing required fields'}), 400
                
            if not (0 <= humidity <= 100 and temperature >= 0):
                return jsonify({'error': 'Invalid input values'}), 400
            
            # Calculate prediction (using default wind speed of 10 km/h)
            wind_speed = 10.0
            disease_type = "Yellow Sigatoka"  # Default to Yellow Sigatoka for weather-based predictions
            score = calculate_spread_speed(temperature, humidity, wind_speed, disease_type)
            risk_level = get_risk_level(score)
            spread_area = get_spread_area(risk_level)
            
            # Return results
            return jsonify({
                'success': True,
                'prediction': {
                    'temperature': temperature,
                    'humidity': humidity,
                    'wind_speed': wind_speed,
                    'score': score,
                    'risk_level': risk_level,
                    'spread_area': spread_area
                }
            })
            
        except ValueError as e:
            return jsonify({'error': 'Invalid numeric values'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        try:
            # Get data from either form or JSON
            if request.is_json:
                data = request.get_json()
                disease_type = data.get('disease_type')
                temperature = float(data.get('temperature'))
                humidity = float(data.get('humidity'))
                wind_speed = float(data.get('wind_speed'))
            else:
                disease_type = request.form.get('disease_type')
                temperature = float(request.form.get('temperature'))
                humidity = float(request.form.get('humidity'))
                wind_speed = float(request.form.get('wind_speed'))
            
            # Validate inputs
            if not all([disease_type, temperature, humidity, wind_speed]):
                return jsonify({'error': 'Missing required fields'}), 400
                
            if not (0 <= humidity <= 100 and temperature >= 0 and wind_speed >= 0):
                return jsonify({'error': 'Invalid input values'}), 400
            
            # Calculate prediction
            score = calculate_spread_speed(temperature, humidity, wind_speed, disease_type)
            risk_level = get_risk_level(score)
            spread_area = get_spread_area(risk_level)
            
            # Generate visualization
            plot_prediction(temperature, humidity, wind_speed, disease_type, score, risk_level)
            
            # Return results
            return jsonify({
                'success': True,
                'disease_type': disease_type,
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'score': score,
                'risk_level': risk_level,
                'spread_area': spread_area,
                'image_path': 'disease_prediction.png'
            })
            
        except ValueError as e:
            return jsonify({'error': 'Invalid numeric values'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return render_template('predict.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
