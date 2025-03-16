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
        width: 160,
        height: 50,
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 12,
        paddingHorizontal: 15,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        justifyContent: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    accIcon: {
        color: 'white',
        fontSize: 22,
    },
    textTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
    }
});

export default Account;