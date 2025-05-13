import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

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

def main():
    print("\n=== Banana Disease Spread Prediction System ===\n")
    
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
    
    # Calculate spread score
    score = calculate_spread_speed(temp, humidity, wind_speed, disease_type)
    risk_level = get_risk_level(score)
    spread_area = get_spread_area(risk_level)
    
    # Generate visualization
    plot_prediction(temp, humidity, wind_speed, disease_type, score, risk_level)
    
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
    print("\nVisualization has been saved as 'disease_prediction.png'")

if __name__ == "__main__":
    main() 