import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Account = ({ color, icon, title }) => {
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: color }]}> 
            <View style={styles.iconContainer}>
                <Icon name={icon} style={styles.accIcon} />
            </View>
            <Text style={styles.textTitle}>{title}</Text>
        </TouchableOpacity>
    );  
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 150,
        height: 50,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 25,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    accIcon: {
        color: 'white',
        fontSize: 20,
    },
    textTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default Account;
