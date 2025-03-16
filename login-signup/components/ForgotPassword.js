import React, { Component } from 'react';
import { Alert, TextInput, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      showAlert: false,
      title: ''
    };
  }

  onSend = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, this.state.email)
      .then(() => {
        this.setState({ title: "Success!", message: "Please check your email...!" })
        this.showAlert();
      })
      .catch(error => {
        this.setState({ title: "Error!", message: error.message })
        this.showAlert();
      });
  }

  showAlert = () => {
    this.setState({ showAlert: true });
  };

  hideAlert = () => {
    this.setState({ showAlert: false, message: '', title: '' });
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          <TouchableOpacity style={styles.loginButton} onPress={this.onSend}>
            <Text style={styles.loginButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.replace("Login") }>
            <Text style={styles.regButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>or</Text>
        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/facebook.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/twitter.png')} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/banana.png')} style={styles.bottomImage} />

        <AwesomeAlert
          show={this.state.showAlert}
          title={this.state.title}
          message={this.state.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Close"
          cancelButtonColor="#AEDEF4"
          onCancelPressed={this.hideAlert}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  card: {
    width: 350,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  regButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    marginVertical: 15,
    color: '#6c757d',
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  bottomImage: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});
