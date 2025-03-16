import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../components/Inputs';
import Submit from '../components/Submit';

const SignUp = (props) => {
    return (
        <LinearGradient colors={['#012a52', '#0487d9']} style={styles.gradientContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require('../assets/signup.png')} resizeMode="contain" style={styles.image} />
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={styles.textBody}>Create an account to access all features</Text>
                <View style={{ marginTop: 20 }} />
                <Input name="Full Name" icon="user" />
                <Input name="Email" icon="envelope" />
                <Input name="Phone" icon="phone" />
                <Input name="Password" icon="lock" pass={true} />
                <Input name="Confirm Password" icon="lock" pass={true} />
                <Submit color="#0487d9" title="CREATE ACCOUNT" />
                <View style={styles.loginContainer}>
                    <Text style={styles.textBody}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                        <Text style={styles.loginText}> Login here</Text>
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
        width: 320,
        height: 220,
        marginVertical: 15,
    },
    textTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#FFD700',
        marginVertical: 10,
    },
    textBody: {
        fontSize: 16,
        color: 'white',
    },
    loginContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: 'bold',
    }
});

export default SignUp;
