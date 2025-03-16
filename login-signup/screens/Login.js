import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Inputs from '../components/Inputs';
import Submit from '../components/Submit';
import Account from '../components/Account';

const Login = (props) => {
    return (
        <LinearGradient colors={['#001f3f', '#0074cc']} style={styles.gradientContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image 
                    source={require('../assets/login.png')} 
                    resizeMode="contain" 
                    style={styles.image} 
                />
                <Text style={styles.textTitle}>Welcome Back!</Text>
                <Text style={styles.textBody}>Log in to your existing account</Text>
                <View style={{ marginTop: 20 }} />
                <Inputs name="Email" icon="user" />
                <Inputs name="Password" icon="lock" pass={true} />
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
                <Submit title="LOG IN" color="#0074cc" />
                <Text style={styles.orText}>Or connect using</Text>
                <View style={styles.accountContainer}>
                    <Account color="#4267B2" icon="facebook" title="Facebook" />
                    <Account color="#DB4437" icon="google" title="Google" />
                </View>
                <View style={styles.signUpContainer}>
                    <Text style={styles.textBody}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
                        <Text style={styles.signUpText}> Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    image: {
        width: 340,
        height: 220,
        marginVertical: 15,
    },
    textTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFD700',
        marginVertical: 10,
    },
    textBody: {
        fontSize: 18,
        color: 'white',
    },
    forgotPassword: {
        width: '90%',
        alignItems: 'flex-end',
        marginVertical: 5,
    },
    forgotText: {
        color: '#FFD700',
        fontSize: 15,
    },
    orText: {
        fontSize: 18,
        color: 'white',
        marginVertical: 10,
    },
    accountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        marginVertical: 10,
    },
    signUpContainer: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    signUpText: {
        fontSize: 18,
        color: '#FFD700',
        fontWeight: 'bold',
    }
});

export default Login;
