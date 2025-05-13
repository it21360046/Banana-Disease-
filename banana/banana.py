from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Set the backend to non-interactive
import matplotlib.pyplot as plt
import seaborn as sns
import os
from predict_disease_spread import calculate_spread_speed, get_risk_level, get_spread_area, plot_prediction
import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create a directory for storing generated images if it doesn't exist
UPLOAD_FOLDER = 'static/images'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def load_officer_config():
    try:
        with open('officer_config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: officer_config.json not found")
        return None
    except json.JSONDecodeError:
        print("Error: Invalid JSON in officer_config.json")
        return None

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
                print("Received JSON data:", data)  # Debug log
            else:
                data = request.form
                print("Received form data:", data)  # Debug log

            # Validate required fields
            required_fields = ['disease_type', 'temperature', 'humidity', 'wind_speed', 'location', 'officer_email']
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                error_msg = f"Missing required fields: {', '.join(missing_fields)}"
                print("Validation error:", error_msg)  # Debug log
                return jsonify({'error': error_msg}), 400

            # Parse and validate numeric values
            try:
                temperature = float(data.get('temperature'))
                humidity = float(data.get('humidity'))
                wind_speed = float(data.get('wind_speed'))
            except (TypeError, ValueError) as e:
                error_msg = f"Invalid numeric values: {str(e)}"
                print("Validation error:", error_msg)  # Debug log
                return jsonify({'error': error_msg}), 400

            # Validate ranges
            if not (0 <= humidity <= 100):
                error_msg = "Humidity must be between 0 and 100"
                print("Validation error:", error_msg)  # Debug log
                return jsonify({'error': error_msg}), 400

            if temperature < 0:
                error_msg = "Temperature cannot be negative"
                print("Validation error:", error_msg)  # Debug log
                return jsonify({'error': error_msg}), 400

            if wind_speed < 0:
                error_msg = "Wind speed cannot be negative"
                print("Validation error:", error_msg)  # Debug log
                return jsonify({'error': error_msg}), 400

            # Get other fields
            disease_type = data.get('disease_type')
            location = data.get('location')
            officer_email = data.get('officer_email')

            # Calculate prediction
            score = calculate_spread_speed(temperature, humidity, wind_speed, disease_type)
            risk_level = get_risk_level(score)
            spread_area = get_spread_area(risk_level)
            
            # Generate visualization with unique filename
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            image_filename = f'disease_prediction_{timestamp}.png'
            image_path = os.path.join(UPLOAD_FOLDER, image_filename)
            
            # Generate the plot
            plot_prediction(temperature, humidity, wind_speed, disease_type, score, risk_level)
            
            # Move the generated image to the static folder
            if os.path.exists('disease_prediction.png'):
                os.rename('disease_prediction.png', image_path)
            
            # Return results with the image URL
            response_data = {
                'success': True,
                'disease_type': disease_type,
                'temperature': temperature,
                'humidity': humidity,
                'wind_speed': wind_speed,
                'score': score,
                'risk_level': risk_level,
                'spread_area': spread_area,
                'image_url': f'/static/images/{image_filename}'
            }
            print("Sending response:", response_data)  # Debug log
            return jsonify(response_data)
            
        except Exception as e:
            error_msg = f"Server error: {str(e)}"
            print("Server error:", error_msg)  # Debug log
            return jsonify({'error': error_msg}), 500
    
    return render_template('predict.html')

@app.route('/static/images/<filename>')
def serve_image(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename))

@app.route('/officers', methods=['GET'])
def get_officers():
    config = load_officer_config()
    if not config:
        return jsonify({'error': 'Could not load officer configuration'}), 500
    
    # Create a mapping of districts to officer information
    district_officers = {}
    for officer in config['authorized_officers']:
        district_officers[officer['region']] = {
            'name': officer['name'],
            'email': officer['email']
        }
    
    return jsonify({
        'success': True,
        'officers': district_officers
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
