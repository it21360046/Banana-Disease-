import React from "react";
import { TextInput, View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { ref, getDatabase, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from '@react-native-async-storage/async-storage';

initialState = {
  email: "",
  name: "",
  mobile: "",
  success: false,
  message: "",
  showAlert: false,
  loader: false,
  title: "",
}

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      mobile: "",
      success: false,
      message: "",
      showAlert: false,
      loader: false,
      title: ""
    };
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
      this.props.navigation.goBack();
    }
  };

  onSave = async () => {
    if (this.state.name != "" && this.state.mobile != "" && this.state.email != "") {
      this.setState({ loader: true });
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        set(ref(getDatabase(), 'users/' + uid), {
          id: uid,
          name: this.state.name,
          email: this.state.email,
          mobile: this.state.mobile,
        })
        .then(() => {
          this.setState(initialState);
          this.setState({ loader: false });
          this.setState({
            title: "Success!",
            message: "Profile updated successfully!",
            success: true
          });
          this.showAlert();
        })
        .catch((error) => {
          this.setState({ loader: false });
          this.setState({ title: "Error!", message: error.message });
          this.showAlert();
        });
      } else {
        this.setState({ title: "Error!", message: "No user logged in!" });
        this.showAlert();
      }
    } else {
      this.setState({ title: "Required!", message: "Please fill in all fields!" });
      this.showAlert();
    }
  };

  render() {
    const { showAlert } = this.state;
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Image
                            source={require("./../assets/user.png")}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{ AsyncStorage.getItem('name')}</Text>

          <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            placeholder={"Name"}
            style={styles.input}
          />
          <TextInput
            value={this.state.mobile}
            onChangeText={(mobile) => this.setState({ mobile })}
            placeholder={"Mobile"}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
            placeholder={"Email"}
            keyboardType="email-address"
            style={styles.input}
          />

          <TouchableOpacity style={[styles.buttonContainer, styles.saveButton]} onPress={this.onSave} >
            {!this.state.loader ? (
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Save</Text>
            ) : null}
            {this.state.loader ? (
              <ActivityIndicator size="large" color={"#ffffff"} />
            ) : null}
          </TouchableOpacity>

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
              this.hideAlert();
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  scrollView: {
    backgroundColor: '#fff',
    flex: 1,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    marginTop: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    width: 80 + "%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#c4c4c4",
    color: "#000000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 80 + "%",
    height: 50,
    borderRadius: 50,
  },
  saveButton: {
    backgroundColor: "#0D522C",
  },
});
