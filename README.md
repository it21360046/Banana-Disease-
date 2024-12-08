# Design and Development of Banana Disease Identification and Treatment Suggestion System

# Research Problem

A large portion of the cultivation is frequently harmed by Panama and Sigatoka diseases because cultivators frequently misidentify and misdiagnose them or disregard the symptoms. Not having proper knowledge or following an ineffective, inaccurate prevention methods, may increase the chances of further infestations. Hence, the relevant authorities should thoroughly share information about these diseases and effective prevention methods.

In addition, approaches that exist world-wide, depends on acquiring images with higher quality which requires either a higher quality mobile phone or a camera. This can be challenging due to the limited income of farmers and limited resources farmers have.

# Methodology
The proposed system is an android mobile application that uses deep learning, computer vision, and automated machine learning to diagnose illnesses with high accuracy. First, the farmer needs to select between text or images to proceed with the diagnosis.

If the farmer choose images,
Farmer has to take a picture of the infected banana leaf and uploading it to the system. The system will first verify if the provided photographs include banana leaves. After successful verification, system will proceed with the diagnosis and express result as a percentage. If the confidence level is higher, the system will recommend a treatment option for a specific leaf disease.

If the farmer choose text,
Farmer can type the symptoms of the infected banana plant using either Sinhala or English language. Then the system will analyze the inserted textual symptoms and display the results and relevant controlling measures.

If the system has identified a banana disease, the system will display the location in a map. Further, the system will acquire weather data to determine the risk level and the risk area and continue to surveillance on the detected disease.

Meanwhile, the nearest agriculture officer will be notified about the detected disease.
![Architecture diagram](https://github.com/user-attachments/assets/9932d3b2-98ed-42e6-8fd6-4ffdc9f136da)

# dependencies
('pip install numpy')
pip install pandas
pip install spacy
python -m spacy download en_core_web_sm
pip install seaborn
pip install textblob
python -m textblob.download_corpora
pip install nltk
python -m nltk.downloader stopwords punkt wordnet
pip install scikit-learn
pip install swifter
pip install tqdm
pip install tensorflow
pip install scikit-learn
pip install tensorflow-hub
pip install numpy matplotlib tensorflow tensorflow-hub

# Licenses of Libraries
# Python
License: Python Software Foundation License
Details: Open source and permissive. You can use, modify, and distribute it.

# Pandas
License: BSD 3-Clause License
Details: Permissive license allowing redistribution and use in source and binary forms.

# spaCy
License: MIT License
Details: Open source, permissive, allowing use, modification, and redistribution.

# Seaborn
License: BSD 3-Clause License
Details: Similar to pandas, allows broad use and redistribution.

# TextBlob
License: MIT License
Details: Open source and permissive.

# NLTK
License: Apache License 2.0
Details: Open source, permissive license.

# scikit-learn
License: BSD 3-Clause License
Details: Open source and permissive.

# swifter
License: Apache License 2.0
Details: Open source, permissive.

# tqdm
License: MIT License
Details: Open source, permissive.

# Matplotlib
License: Matplotlib License (derived from the Python Software Foundation License and BSD License)
Details: Open source and permissive.

# os, json, string, re (Python Standard Libraries)
License: Python Software Foundation License
Details: Open source and permissive.
