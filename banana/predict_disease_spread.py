import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Set the backend to non-interactive
import matplotlib.pyplot as plt
import seaborn as sns
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from fpdf import FPDF
import datetime
import os
import json
import re

def calculate_spread_speed(temp, humidity, wind_speed, disease_type='yellow_sigatoka'):
    if disease_type.lower() == 'yellow sigatoka':
        # Yellow Sigatoka weights: higher emphasis on humidity and wind
        score = (humidity * 0.5) + (wind_speed * 0.3) + (temp * 0.2)
    else:  # panama disease
        # Panama Disease weights: higher emphasis on humidity, less on wind
        score = (humidity * 0.6) + (wind_speed * 0.1) + (temp * 0.3)
    return round(score, 2)

def get_risk_level(score):
    if score <= 30:
        return 'Low'
    elif score <= 45:
        return 'Medium'
    else:
        return 'High'

def get_spread_area(risk_level):
    if risk_level == 'Low':
        return 'Small local spread (0-100m radius)'
    elif risk_level == 'Medium':
        return 'Moderate area spread (100-500m radius)'
    else:
        return 'Large region spread (500m+ radius)'

def plot_prediction(temp, humidity, wind_speed, disease_type, score, risk_level):
    plt.figure(figsize=(12, 8))
    
    # Create a radar chart
    categories = ['Temperature', 'Humidity', 'Wind Speed']
    values = [temp/40, humidity/100, wind_speed/30]  # Normalize values
    
    # Number of variables
    N = len(categories)
    
    # Compute angle for each axis
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]  # Close the loop
    
    # Add the first value again to close the loop
    values += values[:1]
    
    # Plot
    ax = plt.subplot(111, polar=True)
    plt.xticks(angles[:-1], categories)
    
    # Draw y-axis labels (0-1)
    ax.set_rlabel_position(0)
    plt.yticks([0.25, 0.5, 0.75], ["25%", "50%", "75%"], color="grey", size=8)
    plt.ylim(0, 1)
    
    # Plot data
    ax.plot(angles, values, linewidth=2, linestyle='solid')
    ax.fill(angles, values, 'b', alpha=0.1)
    
    # Add title and score
    plt.title(f'{disease_type} Spread Analysis\nSpread Score: {score} - Risk Level: {risk_level}', 
              pad=20, size=15)
    
    # Save the plot
    plt.savefig('disease_prediction.png', dpi=300, bbox_inches='tight')
    plt.close()

def load_officer_config():
    try:
        with open('officer_config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: officer_config.json not found. Please ensure the configuration file exists.")
        return None
    except json.JSONDecodeError:
        print("Error: Invalid JSON in officer_config.json")
        return None

def validate_officer_email(email):
    config = load_officer_config()
    if not config:
        return False, None
    
    for officer in config['authorized_officers']:
        if officer['email'].lower() == email.lower():
            return True, officer
    return False, None

def generate_pdf_report(disease_type, temp, humidity, wind_speed, score, risk_level, spread_area, location_data, officer_info):
    pdf = FPDF()
    pdf.add_page()
    
    # Add title
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Banana Disease Spread Report', ln=True, align='C')
    pdf.ln(10)
    
    # Add timestamp
    pdf.set_font('Arial', 'I', 10)
    pdf.cell(0, 10, f'Generated on: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', ln=True)
    pdf.ln(5)
    
    # Add officer information
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Authorized Officer:', ln=True)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Name: {officer_info["name"]}', ln=True)
    pdf.cell(0, 10, f'Region: {officer_info["region"]}', ln=True)
    pdf.ln(5)
    
    # Add disease information
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Disease Information:', ln=True)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Disease Type: {disease_type}', ln=True)
    pdf.cell(0, 10, f'Risk Level: {risk_level}', ln=True)
    pdf.cell(0, 10, f'Spread Area: {spread_area}', ln=True)
    pdf.ln(5)
    
    # Add environmental conditions
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Environmental Conditions:', ln=True)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Temperature: {temp}°C', ln=True)
    pdf.cell(0, 10, f'Humidity: {humidity}%', ln=True)
    pdf.cell(0, 10, f'Wind Speed: {wind_speed} km/h', ln=True)
    pdf.ln(5)
    
    # Add location data
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Location Information:', ln=True)
    pdf.set_font('Arial', '', 12)
    pdf.cell(0, 10, f'Location: {location_data}', ln=True)
    
    # Add security footer
    pdf.ln(10)
    pdf.set_font('Arial', 'I', 8)
    pdf.cell(0, 10, 'This is an official report generated for authorized agriculture officers only.', ln=True)
    pdf.cell(0, 10, f'Report ID: {datetime.datetime.now().strftime("%Y%m%d%H%M%S")}', ln=True)
    
    # Save the PDF
    report_filename = f'disease_report_{datetime.datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf'
    pdf.output(report_filename)
    return report_filename

def send_email_report(recipient_email, disease_type, temp, humidity, wind_speed, score, risk_level, spread_area, location_data, officer_info):
    config = load_officer_config()
    if not config:
        return False
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = config['email_settings']['sender_email']
    msg['To'] = recipient_email
    msg['Subject'] = f"Disease Risk Alert - {disease_type}"
    
    # Email body with formatted template
    body = f"""Disease Risk Alert

Disease Type: {disease_type}
Risk Level: {risk_level}
Spread Area: {spread_area}
Spread Score: {score:.2f}

Environmental Conditions:
Temperature: {temp:.2f}°C
Humidity: {humidity:.0f}%
Wind Speed: {wind_speed:.2f} km/h

Location: {location_data}

----------------------------------------
IMPORTANT: Please check the attachments below
----------------------------------------

1. PDF Report: 'disease_report_{disease_type.replace(" ", "_")}.pdf'
   - Contains detailed analysis
   - Includes recommendations
   - Official documentation

2. Analysis Image: 'disease_spread_analysis_{disease_type.replace(" ", "_")}.png'
   - Visual representation of conditions
   - Risk factor analysis
   - Spread pattern visualization"""
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Generate and attach PDF report
        report_filename = generate_pdf_report(disease_type, temp, humidity, wind_speed, score, risk_level, spread_area, location_data, officer_info)
        pdf_filename = f'disease_report_{disease_type.replace(" ", "_")}.pdf'
        
        with open(report_filename, 'rb') as f:
            pdf_attachment = MIMEApplication(f.read(), _subtype='pdf')
            pdf_attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
            msg.attach(pdf_attachment)
        
        # Attach the visualization image
        if os.path.exists('disease_prediction.png'):
            img_filename = f'disease_spread_analysis_{disease_type.replace(" ", "_")}.png'
            with open('disease_prediction.png', 'rb') as f:
                img_attachment = MIMEApplication(f.read(), _subtype='png')
                img_attachment.add_header('Content-Disposition', 'attachment', filename=img_filename)
                msg.attach(img_attachment)
        
        # Send email
        server = smtplib.SMTP(config['email_settings']['smtp_server'], config['email_settings']['smtp_port'])
        server.starttls()
        server.login(config['email_settings']['sender_email'], config['email_settings']['sender_password'])
        server.send_message(msg)
        server.quit()
        print(f"\nReport and visualization have been sent to authorized officer: {officer_info['name']}")
        print(f"Attached files: {pdf_filename} and {img_filename}")
        
        # Clean up the files
        os.remove(report_filename)
        if os.path.exists('disease_prediction.png'):
            os.remove('disease_prediction.png')
        return True
    except Exception as e:
        print(f"\nError sending email: {str(e)}")
        return False

def main():
    print("\n=== Banana Disease Spread Prediction System ===\n")
    
    # Load officer configuration
    config = load_officer_config()
    if not config:
        print("Error: Could not load officer configuration. Exiting...")
        return
    
    # Get disease type
    while True:
        disease_type = input("Enter disease type (Yellow Sigatoka or Panama Disease): ").strip()
        if disease_type.lower() in ['yellow sigatoka', 'panama disease']:
            break
        print("Invalid disease type. Please enter 'Yellow Sigatoka' or 'Panama Disease'")
    
    # Get environmental conditions
    while True:
        try:
            temp = float(input("Enter temperature (°C): "))
            humidity = float(input("Enter humidity (%): "))
            wind_speed = float(input("Enter wind speed (km/h): "))
            
            if 0 <= humidity <= 100 and temp >= 0 and wind_speed >= 0:
                break
            print("Invalid values. Please enter positive numbers (humidity between 0-100)")
        except ValueError:
            print("Invalid input. Please enter numeric values")
    
    # Get location data
    location_data = input("Enter location (e.g., 'Colombo, Sri Lanka'): ").strip()
    
    # Get and validate agriculture officer's email
    while True:
        officer_email = input("Enter agriculture officer's email: ").strip()
        is_valid, officer_info = validate_officer_email(officer_email)
        if is_valid:
            break
        print("Error: Invalid or unauthorized email address. Please enter a valid agriculture officer email.")
    
    # Calculate spread score
    score = calculate_spread_speed(temp, humidity, wind_speed, disease_type)
    risk_level = get_risk_level(score)
    spread_area = get_spread_area(risk_level)
    
    # Generate visualization
    plot_prediction(temp, humidity, wind_speed, disease_type, score, risk_level)
    
    # Send email report
    if send_email_report(officer_email, disease_type, temp, humidity, wind_speed, score, risk_level, spread_area, location_data, officer_info):
        # Print results
        print("\n=== Prediction Results ===")
        print(f"Disease Type: {disease_type}")
        print(f"Environmental Conditions:")
        print(f"- Temperature: {temp}°C")
        print(f"- Humidity: {humidity}%")
        print(f"- Wind Speed: {wind_speed} km/h")
        print(f"\nSpread Score: {score}")
        print(f"Risk Level: {risk_level}")
        print(f"Predicted Spread Area: {spread_area}")
        print(f"Location: {location_data}")
        print("\nVisualization has been saved as 'disease_prediction.png'")
        print(f"Report and visualization have been sent to authorized officer: {officer_info['name']}")
    else:
        print("\nError: Failed to send report. Please try again later.")

if __name__ == "__main__":
    main() 