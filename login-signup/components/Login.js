import React, { useState } from 'react';
import { TextInput, View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Dimensions } from "react-native";
import { ref, getDatabase, set , get} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword } from 'firebase/auth';
import RadioForm from "react-native-simple-radio-button";
import AwesomeAlert from "react-native-awesome-alerts";
import firebase from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';

initialState = {
  isLogin: true,
  email: "",
  name: "",
  mobile: "",
  password: "",
  success: false,
  message: "",
  showAlert: false,
  loader: false,
  title: ""
}

export default class Login extends React.Component {

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
      isLogin: true,
      email: "",
      name: "",
      mobile: "",
      password: "",
      success: false,
      message: "",
      showAlert: false,
      loader: false,
      title: ""
    };
    this.loadData();
  }

  loadData = async() =>{
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn')
    if(isLoggedIn==='true'){
      this.props.navigation.replace('HomePage')
    }
  }

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      message: "",
      title: "",
    });
    if (this.state.success == true) {
      this.props.navigation.replace("Login")
    }
  };

  onLogin = e => {

    if (this.state.email != "") {
      if (this.state.password != "") {
        this.setState({ loader: true })

        const auth = getAuth();

        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
          .then(async (res) => {
            await AsyncStorage.setItem('isLoggedIn', 'true')
            await AsyncStorage.setItem('userEmail', res.user.email)
            await AsyncStorage.setItem('userId', res.user.uid)

            get(ref(getDatabase(), '/users/' + res.user.uid)).then(async (snapshot) => {

              console.log(snapshot.val().name)
              await AsyncStorage.setItem('name', snapshot.val().name)
              await AsyncStorage.setItem('mobile', snapshot.val().mobile)
              await AsyncStorage.setItem('user_type', snapshot.val().user_type)
              if (snapshot.val().user_type == "admin") {
                this.props.navigation.replace('Admin')
              } else {
                this.props.navigation.replace('HomePage')
              }

            })

            this.setState({ loader: false })

          })
          .catch(error => {
            this.setState({ title: "Error!", message: error.message })
            this.showAlert()
            this.setState({ loader: false })
          }
          );
      } else {
        this.setState({ title: "Required!", message: "Enter an Password!" });
        this.showAlert();
      }
    } else {
      this.setState({ title: "Required!", message: "Enter an Email!" });
      this.showAlert();
    }

  }

  onForgot = async (e) => {
    this.props.navigation.replace('ForgotPassword')
  }

  onRegister = async (e) => {
    if (this.state.email != "") {
      if (this.state.name != "") {
        if (this.state.password != "") {
          if (this.state.mobile != "") {

              this.setState({ loader: true })

              const auth = getAuth();

              await createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
                .then((response) => {
                  console.log(response.user.uid)
                  var uid = response.user.uid
                  set(ref(getDatabase(), 'users/' + uid), {
                    id: uid,
                    user_type: 'user',
                    name: this.state.name,
                    mobile: this.state.mobile,
                    email: this.state.email
                  })
                    .then(() => {
                      this.setState(initialState)
                      this.setState({ loader: false , isLogin:true})
                      this.setState({
                        title: "Success!",
                        message: "Registration Successful!",
                        success: true
                      });
                      this.showAlert()
                    })
                })
                .catch((error) => {
                  this.setState({ loader: false })
                  this.setState({ title: "Error!", message: error.message })
                  this.showAlert()
                });
          } else {
            this.setState({
              title: "Required!",
              message: "Enter an Mobile Number!",
            });
            this.showAlert();
          }
        } else {
          this.setState({ title: "Required!", message: "Enter an Password!" });
          this.showAlert();
        }
      } else {
        this.setState({ title: "Required!", message: "Enter an Name!" });
        this.showAlert();
      }
    } else {
      this.setState({ title: "Required!", message: "Enter an Email!" });
      this.showAlert();
    }
  };

  render() {
    const { showAlert } = this.state;
    return (
      <View style={styles.container}>

        <View style={styles.card}>
          <View style={styles.switchContainer}>
            <TouchableOpacity
              style={[styles.switchButton, this.state.isLogin && styles.activeButton]}
              onPress={() => { this.setState({ isLogin: true }) }}>
              <Text style={styles.switchButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switchButton, !this.state.isLogin && styles.activeButton]}
              onPress={() => { this.setState({ isLogin: false }) }}>
              <Text style={styles.switchButtonText}>Register</Text>
            </TouchableOpacity>
          </View>

          {this.state.isLogin ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={this.state.password}
                secureTextEntry
                onChangeText={(password) => this.setState({ password })}
              />
              <Text style={styles.forgotPassword} onPress={this.onForgot}>Forgot Password?</Text>
              <TouchableOpacity style={styles.loginButton} onPress={this.onLogin}>
                {!this.state.loader ? (
                  <Text style={styles.loginButtonText}>Login</Text>
                ) : null}
                {this.state.loader ? (
                  <ActivityIndicator size="large" color={"#ffffff"} />
                ) : null}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile no."
                value={this.state.mobile}
                onChangeText={(mobile) => this.setState({ mobile })}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={this.state.password}
                secureTextEntry
                onChangeText={(password) => this.setState({ password })}
              />
              <TouchableOpacity style={styles.loginButton} onPress={this.onRegister}>
                {!this.state.loader ? (
                  <Text style={styles.loginButtonText}>Register</Text>
                ) : null}
                {this.state.loader ? (
                  <ActivityIndicator size="large" color={"#ffffff"} />
                ) : null}
              </TouchableOpacity>
            </View>
          )}
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
};

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
  LoginButton: {
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
