# Banana Disease Spread Prediction System

This system predicts the spread of banana diseases (Yellow Sigatoka and Panama Disease) based on environmental conditions such as temperature, humidity, and wind speed.

## Features

- Predicts disease spread for both Yellow Sigatoka and Panama Disease
- Takes into account temperature, humidity, and wind speed
- Generates risk levels and spread area predictions
- Creates visual radar charts for analysis
- Interactive command-line interface

## Requirements

- Python 3.x
- pandas
- numpy
- matplotlib
- seaborn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/it21360046/Banana-Disease-.git
cd Banana-Disease-
```

2. Install required packages:
```bash
pip install pandas numpy matplotlib seaborn
```

## Usage

Run the prediction system:
```bash
python predict_disease_spread.py
```

Follow the prompts to:
1. Select disease type (Yellow Sigatoka or Panama Disease)
2. Enter temperature (°C)
3. Enter humidity (%)
4. Enter wind speed (km/h)

The system will generate a prediction and save a visualization as 'disease_prediction.png'.

## License

This project is part of the Banana Disease Identification and Treatment Suggestion System. 