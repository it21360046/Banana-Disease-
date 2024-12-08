# Design and Development of Banana Disease Identification and Treatment Suggestion System

## Research Problem

A significant portion of banana cultivation is often damaged by Panama and Sigatoka diseases. This is due to frequent misidentification, misdiagnosis, or negligence regarding early symptoms by cultivators. Without proper knowledge or following ineffective prevention methods, the likelihood of further infestations increases. Therefore, it is crucial for relevant authorities to disseminate comprehensive information about these diseases and effective prevention strategies.

Currently, existing approaches depend on acquiring high-quality images, which typically require either advanced mobile phones or cameras. For farmers with limited income and resources, this is often a barrier to proper disease diagnosis.

---

## Methodology

The proposed solution is an **Android mobile application** that utilizes **deep learning**, **computer vision**, and **automated machine learning** to diagnose diseases with high accuracy. The system allows farmers to choose between **text-based inputs** or **image-based diagnosis** to proceed with disease identification.

### Image-Based Diagnosis:
1. **Capture Image**: The farmer takes a photo of the infected banana leaf and uploads it to the system.
2. **Image Verification**: The system checks whether the provided photo contains banana leaves.
3. **Diagnosis**: If the image passes verification, the system proceeds with analyzing it to identify the disease and returns the results with a confidence percentage.
4. **Treatment Recommendation**: If the diagnosis is highly confident, the system suggests a specific treatment for the identified disease.

### Text-Based Diagnosis:
1. **Input Symptoms**: The farmer types in the symptoms of the infected banana plant in either **Sinhala** or **English**.
2. **Analysis**: The system analyzes the text input and displays the diagnosis along with relevant control measures to mitigate the disease.

### Additional Features:
1. **Geographical Mapping**: If a disease is detected, the system shows the location on a map.
2. **Weather Data Integration**: The system fetches weather data to assess the **risk level** and **risk area** of the disease.
3. **Disease Surveillance**: The system continues to monitor the detected disease's spread.
4. **Notification to Authorities**: The nearest agriculture officer is automatically notified about the disease detection, enabling timely intervention.

---

## System Workflow:

1. **Farmer Interaction**: Farmer chooses either image upload or text input.
2. **Disease Identification**: The system processes the input (image/text) and identifies the disease.
3. **Treatment Suggestion**: If disease is identified, the system recommends treatments.
4. **Risk Assessment**: Weather and geographical data are used to evaluate the spread and risk level.
5. **Monitoring**: Ongoing surveillance and communication with agriculture officers for control and prevention.

---

## Visual Example of the Workflow:

- **Farmer Input** (Image or Text)
- **Diagnosis Process**
  - Verification (Image)
  - Text Analysis (Text)
- **Disease Identification**
  - Confidence level calculation
- **Treatment Suggestions**
- **Risk Mapping & Weather Data**
- **Alert System for Local Authorities**

![Architecture diagram](https://github.com/user-attachments/assets/9932d3b2-98ed-42e6-8fd6-4ffdc9f136da)


## Dependencies
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
14. `pip install scikit-learn`
15. `pip install tensorflow-hub`
16. `pip install numpy matplotlib tensorflow tensorflow-hub`


## Licenses of Libraries

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
