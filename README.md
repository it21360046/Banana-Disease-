# Design and Development of Banana Disease Identification and Treatment Suggestion System

## Research Problem

A significant portion of banana cultivation is often damaged by Panama and Sigatoka diseases. This is due to frequent misidentification, misdiagnosis, or negligence regarding early symptoms by cultivators. Without proper knowledge or following ineffective prevention methods, the likelihood of further infestations increases. Therefore, it is crucial for relevant authorities to disseminate comprehensive information about these diseases and effective prevention strategies.

Currently, existing approaches depend on acquiring high-quality images, which typically require either advanced mobile phones or cameras. For farmers with limited income and resources, this is often a barrier to proper disease diagnosis.

## Features

- Predicts disease spread for both Yellow Sigatoka and Panama Disease
- Takes into account temperature, humidity, and wind speed
- Generates risk levels and spread area predictions
- Creates visual radar charts for analysis
- Interactive command-line interface
- Image-based and text-based disease diagnosis
- Geographical mapping and weather data integration
- Disease surveillance and authority notifications

## Installation

1. Clone the repository:
```bash
git clone https://github.com/it21360046/Banana-Disease-.git
cd Banana-Disease-
```

2. Install required packages:
```bash
pip install numpy pandas spacy seaborn textblob nltk scikit-learn swifter tqdm tensorflow tensorflow-hub matplotlib
python -m spacy download en_core_web_sm
python -m textblob.download_corpora
python -m nltk.downloader stopwords punkt wordnet
```

## Usage

### Disease Spread Prediction
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

### Disease Identification System

The system provides two methods for disease identification:

#### Image-Based Diagnosis:
1. **Capture Image**: The farmer takes a photo of the infected banana leaf and uploads it to the system.
2. **Image Verification**: The system checks whether the provided photo contains banana leaves.
3. **Diagnosis**: If the image passes verification, the system proceeds with analyzing it to identify the disease and returns the results with a confidence percentage.
4. **Treatment Recommendation**: If the diagnosis is highly confident, the system suggests a specific treatment for the identified disease.

#### Text-Based Diagnosis:
1. **Input Symptoms**: The farmer types in the symptoms of the infected banana plant in either **Sinhala** or **English**.
2. **Analysis**: The system analyzes the text input and displays the diagnosis along with relevant control measures to mitigate the disease.

### Additional Features:
1. **Geographical Mapping**: If a disease is detected, the system shows the location on a map.
2. **Weather Data Integration**: The system fetches weather data to assess the **risk level** and **risk area** of the disease.
3. **Disease Surveillance**: The system continues to monitor the detected disease's spread.
4. **Notification to Authorities**: The nearest agriculture officer is automatically notified about the disease detection, enabling timely intervention.

## System Workflow:

1. **Farmer Interaction**: Farmer chooses either image upload or text input.
2. **Disease Identification**: The system processes the input (image/text) and identifies the disease.
3. **Treatment Suggestion**: If disease is identified, the system recommends treatments.
4. **Risk Assessment**: Weather and geographical data are used to evaluate the spread and risk level.
5. **Monitoring**: Ongoing surveillance and communication with agriculture officers for control and prevention.

## License

This project is part of the Banana Disease Identification and Treatment Suggestion System.

## Dependencies and Licenses

### Dependencies
1. `pip install numpy`
2. `pip install pandas`
3. `pip install spacy`
4. `python -m spacy download en_core_web_sm`
5. `pip install seaborn`
6. `pip install textblob`
7. `python -m textblob.download_corpora`
8. `pip install nltk`
9. `python -m nltk.downloader stopwords punkt wordnet`
10. `pip install scikit-learn`
11. `pip install swifter`
12. `pip install tqdm`
13. `pip install tensorflow`
14. `pip install tensorflow-hub`
15. `pip install matplotlib`

### Licenses of Libraries

1. **Python**
   - **License**: Python Software Foundation License
   - **Details**: Open source and permissive. You can use, modify, and distribute it.

2. **Pandas**
   - **License**: BSD 3-Clause License
   - **Details**: Permissive license allowing redistribution and use in source and binary forms.

3. **spaCy**
   - **License**: MIT License
   - **Details**: Open source, permissive, allowing use, modification, and redistribution.

4. **Seaborn**
   - **License**: BSD 3-Clause License
   - **Details**: Similar to pandas, allows broad use and redistribution.

5. **TextBlob**
   - **License**: MIT License
   - **Details**: Open source and permissive.

6. **NLTK**
   - **License**: Apache License 2.0
   - **Details**: Open source, permissive license.

7. **scikit-learn**
   - **License**: BSD 3-Clause License
   - **Details**: Open source and permissive.

8. **swifter**
   - **License**: Apache License 2.0
   - **Details**: Open source, permissive.

9. **tqdm**
   - **License**: MIT License
   - **Details**: Open source, permissive.

10. **Matplotlib**
    - **License**: Matplotlib License (derived from the Python Software Foundation License and BSD License)
    - **Details**: Open source and permissive.

11. **os, json, string, re (Python Standard Libraries)**
    - **License**: Python Software Foundation License
    - **Details**: Open source and permissive.
