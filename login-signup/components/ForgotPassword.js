import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default class ForgotPassword extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Help Banana',
      headerStyle: { backgroundColor: '#2BAB32' },
      headerTintColor: '#ffffff',
      headerLeft: () => {
        return null;
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      message: '',
      showAlert: false,
      title: ''
    };
  }

  onSend = e => {

    const auth = getAuth();

    sendPasswordResetEmail(auth, this.state.email)
      .then(() => {
        this.setState({ title: "Success!", message: "Please check your email...!" })
        this.showAlert()
      })
      .catch(error => {
        this.setState({ title: "Error!", message: error.message })
        this.showAlert()
      }
      );

  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: '',
      title: ''
    })
    this.props.navigation.navigate('Login')
  };

  render() {
    const { showAlert } = this.state;
    return (
      <View style={styles.container}>

        <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={this.state.email}
              onChangeText={(email) => this.setState({ email })}
            />
            <TouchableOpacity style={styles.loginButton} onPress={this.onSend}>
              <Text style={styles.loginButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => this.props.navigation.replace("Login")}>
              <Text style={styles.regButtonText}>Lgoin</Text>
            </TouchableOpacity>
          </View>
        </View>
                <Text style={styles.orText}>or</Text>
                <View style={styles.socialContainer}>
                  <TouchableOpacity>
                    <Image source={require('./../assets/facebook.png')} style={styles.socialIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image source={require('./../assets/twitter.png')} style={styles.socialIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image source={require('./../assets/google.png')} style={styles.socialIcon} />
                  </TouchableOpacity>
                </View>
        
                <Image source={require('./../assets/banana.png')} style={styles.bottomImage} />

        <AwesomeAlert
          show={showAlert}
          title={this.state.title}
          message={this.state.message}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          cancelText="Close"
          cancelButtonColor="#AEDEF4"
          onCancelPressed={() => {
            this.hideAlert()
          }}
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
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  card: {
    width: 350,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#e1e1e1',
    borderRadius: 30,
    overflow: 'hidden',
  },
  switchButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  activeButton: {
    backgroundColor: '#bbb',
  },
  switchButtonText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#665eff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: '#7bffa2',
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
    color: '#000',
    fontSize: 18,
  },
  orText: {
    marginVertical: 15,
    color: '#999',
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
