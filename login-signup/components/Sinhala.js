import React from 'react';
import { ActivityIndicator, Picker, Alert, View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default class Sinhala extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: '',
            resultUri: '',
            resultTxt: '',
            message: '',
            showAlert: false,
            result: false,
            title: '',
            loader: false,
        };

    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Sinhala',
        headerStyle: {
            backgroundColor: '#2BAB32',
            elevation: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
        },

        headerLeft: () => (
            <View style={{ marginLeft: 10, marginTop: 5 }}>
                <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
                    <MaterialCommunityIcons name="menu" color='#ffffff' size={30} />
                </TouchableOpacity>
            </View>
        ),
    });

    onInsert = async (e) => {
        if (this.state.question != "") {

            this.setState({ loader: true })
            const url = "http://" + LocalIP + ":1111/sinhala";
            const data = JSON.stringify({ text: this.state.question });
            await axios.post(url, data, {
              headers: { "Content-Type": "application/json" }
            }).then(async (res) => {
                this.setState({ loader: false})
                this.props.navigation.navigate("TextDes",{ result: res.data.reply})
              console.log(res.data);
              
            });

        } else {
            this.setState({ title: "Required!", message: "Required Question Text!" })
            this.showAlert()
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
    };

    render() {
        const { showAlert } = this.state;

        return (
                <View style={styles.container}>
                    <View style={styles.center}>
                        <Image
                            source={require("./../assets/logo.png")}
                            style={{ width: 150, height: 150, marginBottom: 20, marginTop: 10 }}
                        />
                    </View>

                    <View>
                        <Text style={styles.labelText}>Question:</Text>
                        <View style={styles.center}>
                            <TextInput
                                style={styles.input}
                                placeholder="question"
                                value={this.state.question}
                                onChangeText={(question) => this.setState({ question })}
                                multiline={true}
                                numberOfLines={8}
                                textAlignVertical="top"
                            />
                        </View>

                        <View style={styles.center}>
                            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={this.onInsert}>
                                {!this.state.loader ? (
                                    <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Predict</Text>
                                ) : null}
                                {this.state.loader ? (
                                    <ActivityIndicator size="large" color={"#ffffff"} />
                                ) : null}
                            </TouchableOpacity>
                        </View>
                        {this.state.result == true ? ([
                            <View style={[styles.center]}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.state.resultTxt}</Text>
                                </View>
                            </View>]
                        ) : null}
                    </View>

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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
    },
    labelText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10 + '%'
    },
    firstLabelText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10 + '%',
        marginTop: 2 + '%',
    },
    input: {
      width: '80%',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    TextInputStyleClass: {
        borderBottomWidth: 1,
        width: 80 + '%',
        height: 100,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
        borderBottomColor: '#c4c4c4',
        color: '#000000'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        width: 80 + '%',
        height: 60,
        borderRadius: 60
    },
    loginButton: {
        backgroundColor: '#665eff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    registerButton: {
        backgroundColor: "#000000",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
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
});