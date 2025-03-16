import React from 'react';
import { ActivityIndicator, Picker, Alert, View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import LocalIP from "./localIPAddress";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            localUri: '',
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
        title: 'Language',
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
                        <Text style={styles.labelText}>Select Language:</Text>

                        <View style={styles.center}>
                            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('English')}>
                                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>English</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.center}>
                            <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => this.props.navigation.navigate('Sinhala')}>
                                <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Sinhala</Text>
                            </TouchableOpacity>
                        </View>
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
        borderBottomWidth: 1,
        width: 80 + '%',
        height: 45,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#c4c4c4',
        color: '#000000'
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