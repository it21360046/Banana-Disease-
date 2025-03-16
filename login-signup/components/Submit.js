import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Submit = ({ title, color, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: color }]} onPress={onPress}>
            <Text style={styles.submitText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 50,
        borderRadius: 12,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    submitText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        textTransform: 'uppercase',
    }
});

export default Submit;