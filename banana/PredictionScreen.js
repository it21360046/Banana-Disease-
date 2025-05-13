import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import * as MailComposer from "expo-mail-composer";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Update this to your computer's IP address
const API_URL = 'http://192.168.1.6:5000';

const PredictionScreen = () => {
  const [formData, setFormData] = useState({
    disease_type: 'Yellow Sigatoka',
    temperature: '',
    humidity: '',
    wind_speed: '',
    location: '',
    district: '',
    officer_email: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [districtOfficers, setDistrictOfficers] = useState({});
  const [loadingOfficers, setLoadingOfficers] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    riskLevel,
    spreadArea,
    score,
    diseaseType,
    temperature: routeTemperature,
    humidity: routeHumidity,
    windSpeed: routeWindSpeed,
    predictionData,
    officerEmail
  } = route.params || {};

  // Fetch officer information on component mount
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        console.log('Fetching officer information from:', `${API_URL}/officers`);
        const response = await fetch(`${API_URL}/officers`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log('Officer information loaded successfully');
          setDistrictOfficers(data.officers);
        } else {
          console.error('Failed to load officer information:', data.error);
          setConnectionError('Failed to load officer information. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching officer information:', error);
        setConnectionError('Failed to connect to server. Please check if the server is running.');
      } finally {
        setLoadingOfficers(false);
      }
    };

    fetchOfficers();
  }, []);

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing connection to:', API_URL);
        const response = await fetch(`${API_URL}/officers`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setConnectionError(null);
          console.log('API connection successful');
        } else {
          setConnectionError(`API Error: ${data.error || 'Unknown error'}`);
          console.error('API Error:', data);
        }
      } catch (error) {
        console.error('Connection test error:', error);
        setConnectionError('Failed to connect to server. Please check if the server is running.');
      }
    };

    testConnection();
  }, []);

  // Add debug logging for form updates
  const updateFormData = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      // If district is updated, automatically set the officer email
      if (field === 'district' && value) {
        const officer = districtOfficers[value];
        if (officer) {
          newData.officer_email = officer.email;
          console.log('Set officer email to:', officer.email);
        }
      }
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handlePredict = async () => {
    console.log('Current form data before validation:', formData); // Debug log

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setConnectionError(null);
    
    try {
      // Format the request data properly
      const requestData = {
        disease_type: formData.disease_type,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        wind_speed: parseFloat(formData.wind_speed),
        location: formData.location.trim(),
        officer_email: formData.officer_email.trim()
      };

      // Debug log the complete request data
      console.log('Sending prediction request:', {
        url: `${API_URL}/predict`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: requestData
      });
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.success) {
        setResult(data);
        setConnectionError(null);
      } else {
        const errorMessage = data.error || 'Failed to get prediction. Please try again.';
        console.error('Prediction error:', errorMessage);
        setConnectionError(errorMessage);
        Alert.alert(
          'Prediction Error',
          `Error: ${errorMessage}\n\nPlease check your input values and try again.`
        );
      }
    } catch (error) {
      console.error('API Error details:', error);
      const errorMessage = 'Failed to connect to the server. Please check your internet connection and try again.';
      setConnectionError(errorMessage);
      Alert.alert(
        'Connection Error',
        `${errorMessage}\n\nError details: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    // Check if any field is empty
    const emptyFields = [];
    if (!formData.disease_type) emptyFields.push('Disease Type');
    if (!formData.temperature) emptyFields.push('Temperature');
    if (!formData.humidity) emptyFields.push('Humidity');
    if (!formData.wind_speed) emptyFields.push('Wind Speed');
    if (!formData.location) emptyFields.push('Location');
    if (!formData.district) emptyFields.push('District');
    if (!formData.officer_email) emptyFields.push('Officer Email');

    if (emptyFields.length > 0) {
      const errorMessage = `Please fill in the following fields:\n${emptyFields.join('\n')}`;
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    const temp = parseFloat(formData.temperature);
    const humidity = parseFloat(formData.humidity);
    const windSpeed = parseFloat(formData.wind_speed);

    if (isNaN(temp) || isNaN(humidity) || isNaN(windSpeed)) {
      const errorMessage = 'Please enter valid numbers for temperature, humidity, and wind speed';
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    if (humidity < 0 || humidity > 100) {
      const errorMessage = 'Humidity must be between 0 and 100';
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    if (temp < 0) {
      const errorMessage = 'Temperature cannot be negative';
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    if (windSpeed < 0) {
      const errorMessage = 'Wind speed cannot be negative';
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    // Validate location format (latitude, longitude)
    const locationRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    if (!locationRegex.test(formData.location)) {
      const errorMessage = 'Please enter location in the format: latitude, longitude';
      console.error('Validation error:', errorMessage);
      Alert.alert('Validation Error', errorMessage);
      return false;
    }

    return true;
  };

  // Add useEffect to log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#000';
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSendEmail = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [officerEmail || "disease.officer@example.com"],
          subject: `Disease Risk Alert - ${formData.disease_type}`,
          body: `
Disease Risk Alert

Disease Type: ${formData.disease_type}
Risk Level: ${riskLevel}
Spread Area: ${spreadArea}
Spread Score: ${score}

Environmental Conditions:
Temperature: ${routeTemperature}°C
Humidity: ${routeHumidity}%
Wind Speed: ${routeWindSpeed} km/h

Location: ${location?.coords?.latitude}, ${location?.coords?.longitude}
          `,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Banana Disease Prediction</Text>
        {connectionError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{connectionError}</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Disease Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.disease_type}
            onValueChange={(value) => updateFormData('disease_type', value)}
            style={styles.picker}
          >
            <Picker.Item label="Yellow Sigatoka" value="Yellow Sigatoka" />
            <Picker.Item label="Panama Disease" value="Panama Disease" />
          </Picker>
        </View>

        <Text style={styles.label}>District</Text>
        <View style={styles.pickerContainer}>
          {loadingOfficers ? (
            <ActivityIndicator style={styles.loadingIndicator} />
          ) : (
            <Picker
              selectedValue={formData.district}
              onValueChange={(value) => updateFormData('district', value)}
              style={styles.picker}
            >
              <Picker.Item label="Select District" value="" />
              {Object.keys(districtOfficers).map((district) => (
                <Picker.Item 
                  key={district} 
                  label={`${district} (${districtOfficers[district].name})`} 
                  value={district} 
                />
              ))}
            </Picker>
          )}
        </View>

        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.temperature}
          onChangeText={(value) => updateFormData('temperature', value)}
          placeholder="Enter temperature"
        />

        <Text style={styles.label}>Humidity (%)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.humidity}
          onChangeText={(value) => updateFormData('humidity', value)}
          placeholder="Enter humidity (0-100)"
        />

        <Text style={styles.label}>Wind Speed (km/h)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.wind_speed}
          onChangeText={(value) => updateFormData('wind_speed', value)}
          placeholder="Enter wind speed"
        />

        <Text style={styles.label}>Location (latitude, longitude)</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(value) => updateFormData('location', value)}
          placeholder="Enter location (e.g., 6.8044788, 80.9601191)"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
        />

        <Text style={styles.label}>Officer Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f0f0f0' }]}
          value={formData.officer_email}
          editable={false}
          placeholder="Select district to set officer email"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handlePredict} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Predict</Text>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Prediction Results</Text>
          
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Disease Information</Text>
            <Text style={styles.resultText}>Type: {result.disease_type}</Text>
            <Text style={[styles.resultText, { color: getRiskColor(result.risk_level) }]}>
              Risk Level: {result.risk_level}
            </Text>
            <Text style={styles.resultText}>Spread Area: {result.spread_area}</Text>
            <Text style={styles.resultText}>Spread Score: {result.score.toFixed(2)}</Text>
          </View>

          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Environmental Conditions</Text>
            <Text style={styles.resultText}>Temperature: {result.temperature.toFixed(2)}°C</Text>
            <Text style={styles.resultText}>Humidity: {result.humidity.toFixed(0)}%</Text>
            <Text style={styles.resultText}>Wind Speed: {result.wind_speed.toFixed(2)} km/h</Text>
            <Text style={styles.resultText}>Location: {formData.location}</Text>
            <Text style={styles.resultText}>District: {formData.district}</Text>
          </View>

          {result.image_url && (
            <View style={styles.imageContainer}>
              <Text style={styles.sectionTitle}>Visualization</Text>
              <Image
                source={{ uri: `${API_URL}${result.image_url}` }}
                style={styles.resultImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
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
    color: '#333',
  },
  resultSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  imageContainer: {
    marginTop: 20,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default PredictionScreen; 