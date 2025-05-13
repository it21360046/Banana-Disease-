import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def calculate_spread_speed(temp, humidity, wind_speed, disease_type='yellow_sigatoka'):
    if disease_type == 'yellow_sigatoka':
        # Yellow Sigatoka weights: higher emphasis on humidity and wind
        score = (humidity * 0.5) + (wind_speed * 0.3) + (temp * 0.2)
    else:  # panama_disease
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

# Load the dataset
df = pd.read_csv('disease_spread_dataset.csv')

# Calculate spread speed scores for both diseases
df['Yellow_Sigatoka_Score'] = df.apply(
    lambda x: calculate_spread_speed(x['Temperature_C'], x['Humidity_%'], x['Wind_Speed_kmph'], 'yellow_sigatoka'), 
    axis=1
)
df['Panama_Disease_Score'] = df.apply(
    lambda x: calculate_spread_speed(x['Temperature_C'], x['Humidity_%'], x['Wind_Speed_kmph'], 'panama_disease'), 
    axis=1
)

# Create a figure with multiple subplots
plt.style.use('default')
fig = plt.figure(figsize=(20, 20))

# 1. Yellow Sigatoka Analysis
plt.subplot(4, 2, 1)
sns.scatterplot(data=df, x='Humidity_%', y='Spread_Percentage', 
                hue='Yellow_Sigatoka_Score', palette='viridis')
plt.title('Yellow Sigatoka: Disease Spread vs Humidity')
plt.xlabel('Humidity (%)')
plt.ylabel('Spread Percentage')

# 2. Panama Disease Analysis
plt.subplot(4, 2, 2)
sns.scatterplot(data=df, x='Humidity_%', y='Spread_Percentage', 
                hue='Panama_Disease_Score', palette='viridis')
plt.title('Panama Disease: Disease Spread vs Humidity')
plt.xlabel('Humidity (%)')
plt.ylabel('Spread Percentage')

# 3. Wind Speed Impact on Yellow Sigatoka
plt.subplot(4, 2, 3)
sns.scatterplot(data=df, x='Wind_Speed_kmph', y='Spread_Percentage', 
                hue='Yellow_Sigatoka_Score', palette='viridis')
plt.title('Yellow Sigatoka: Disease Spread vs Wind Speed')
plt.xlabel('Wind Speed (km/h)')
plt.ylabel('Spread Percentage')

# 4. Wind Speed Impact on Panama Disease
plt.subplot(4, 2, 4)
sns.scatterplot(data=df, x='Wind_Speed_kmph', y='Spread_Percentage', 
                hue='Panama_Disease_Score', palette='viridis')
plt.title('Panama Disease: Disease Spread vs Wind Speed')
plt.xlabel('Wind Speed (km/h)')
plt.ylabel('Spread Percentage')

# 5. Temperature Impact on Yellow Sigatoka
plt.subplot(4, 2, 5)
sns.scatterplot(data=df, x='Temperature_C', y='Spread_Percentage', 
                hue='Yellow_Sigatoka_Score', palette='viridis')
plt.title('Yellow Sigatoka: Disease Spread vs Temperature')
plt.xlabel('Temperature (°C)')
plt.ylabel('Spread Percentage')

# 6. Temperature Impact on Panama Disease
plt.subplot(4, 2, 6)
sns.scatterplot(data=df, x='Temperature_C', y='Spread_Percentage', 
                hue='Panama_Disease_Score', palette='viridis')
plt.title('Panama Disease: Disease Spread vs Temperature')
plt.xlabel('Temperature (°C)')
plt.ylabel('Spread Percentage')

# 7. Risk Level Distribution for Yellow Sigatoka
plt.subplot(4, 2, 7)
df['Yellow_Sigatoka_Risk'] = df['Yellow_Sigatoka_Score'].apply(get_risk_level)
risk_counts = df['Yellow_Sigatoka_Risk'].value_counts()
plt.pie(risk_counts, labels=risk_counts.index, autopct='%1.1f%%')
plt.title('Yellow Sigatoka: Risk Level Distribution')

# 8. Risk Level Distribution for Panama Disease
plt.subplot(4, 2, 8)
df['Panama_Disease_Risk'] = df['Panama_Disease_Score'].apply(get_risk_level)
risk_counts = df['Panama_Disease_Risk'].value_counts()
plt.pie(risk_counts, labels=risk_counts.index, autopct='%1.1f%%')
plt.title('Panama Disease: Risk Level Distribution')

# Adjust layout and save
plt.tight_layout()
plt.savefig('disease_spread_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

# Print statistical insights
print("\nDisease Spread Analysis:")
print("\nYellow Sigatoka Analysis:")
print("Average Spread Score:", df['Yellow_Sigatoka_Score'].mean().round(2))
print("Risk Level Distribution:")
print(df['Yellow_Sigatoka_Risk'].value_counts())

print("\nPanama Disease Analysis:")
print("Average Spread Score:", df['Panama_Disease_Score'].mean().round(2))
print("Risk Level Distribution:")
print(df['Panama_Disease_Risk'].value_counts())

# Print correlation analysis
print("\nCorrelation Analysis:")
print("\nYellow Sigatoka Correlations:")
print("Humidity:", df['Yellow_Sigatoka_Score'].corr(df['Humidity_%']).round(3))
print("Wind Speed:", df['Yellow_Sigatoka_Score'].corr(df['Wind_Speed_kmph']).round(3))
print("Temperature:", df['Yellow_Sigatoka_Score'].corr(df['Temperature_C']).round(3))

print("\nPanama Disease Correlations:")
print("Humidity:", df['Panama_Disease_Score'].corr(df['Humidity_%']).round(3))
print("Wind Speed:", df['Panama_Disease_Score'].corr(df['Wind_Speed_kmph']).round(3))
print("Temperature:", df['Panama_Disease_Score'].corr(df['Temperature_C']).round(3)) 