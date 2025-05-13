import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const DiseasePrediction = () => {
  const [diseaseType, setDiseaseType] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const predictDiseaseSpread = async () => {
    // Validate inputs
    if (!diseaseType || !temperature || !humidity || !windSpeed) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const wind = parseFloat(windSpeed);

    if (isNaN(temp) || isNaN(hum) || isNaN(wind)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    if (hum < 0 || hum > 100) {
      Alert.alert('Error', 'Humidity must be between 0 and 100');
      return;
    }

    if (temp < 0 || wind < 0) {
      Alert.alert('Error', 'Temperature and wind speed must be positive');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease_type: diseaseType,
          temperature: temp,
          humidity: hum,
          wind_speed: wind,
        }),
      });

      const data = await response.json();

      if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        setPrediction(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Disease Spread Prediction</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Disease Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={diseaseType}
            onValueChange={(value) => setDiseaseType(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select disease type" value="" />
            <Picker.Item label="Yellow Sigatoka" value="Yellow Sigatoka" />
            <Picker.Item label="Panama Disease" value="Panama Disease" />
          </Picker>
        </View>

        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput
          style={styles.input}
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="numeric"
          placeholder="Enter temperature"
        />

        <Text style={styles.label}>Humidity (%)</Text>
        <TextInput
          style={styles.input}
          value={humidity}
          onChangeText={setHumidity}
          keyboardType="numeric"
          placeholder="Enter humidity (0-100)"
        />

        <Text style={styles.label}>Wind Speed (km/h)</Text>
        <TextInput
          style={styles.input}
          value={windSpeed}
          onChangeText={setWindSpeed}
          keyboardType="numeric"
          placeholder="Enter wind speed"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={predictDiseaseSpread}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Predict Spread</Text>
          )}
        </TouchableOpacity>
      </View>

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Results</Text>
          
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Disease Type:</Text>
            <Text style={styles.resultValue}>{prediction.disease_type}</Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Environmental Conditions:</Text>
            <Text style={styles.resultValue}>
              Temperature: {prediction.temperature}°C{'\n'}
              Humidity: {prediction.humidity}%{'\n'}
              Wind Speed: {prediction.wind_speed} km/h
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Spread Score:</Text>
            <Text style={styles.resultValue}>{prediction.score}</Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Risk Level:</Text>
            <Text style={[
              styles.resultValue,
              styles[`risk${prediction.risk_level}`]
            ]}>
              {prediction.risk_level}
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Predicted Spread Area:</Text>
            <Text style={styles.resultValue}>{prediction.spread_area}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  resultItem: {
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  resultValue: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
  },
  riskHigh: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  riskMedium: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
  riskLow: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});

export default DiseasePrediction; 