import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CropHelpScreen extends Component {
  
  static navigationOptions = () => {
    return {
      headerTitle: 'Home',
      headerStyle: { backgroundColor: '#2BAB32' },
      headerTintColor: '#ffffff',
      headerLeft: () => null,
    };
  };

  logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.replace('Login');
  };

  constructor(props) {
    super(props);
    this.state = {
      features: [
        { title: 'Tree', icon: 'local-florist', screen: 'Tree' },
        { title: 'Leaf', icon: 'spa', screen: 'Leaf' },
        { title: 'Take a Picture', icon: 'camera-alt', screen: 'Camera' },
        { title: 'Weather Report', icon: 'wb-sunny', screen: 'Weather' },
        { title: 'Chat with Expert', icon: 'chat', screen: 'Chat' },
        { title: 'Crop Community', icon: 'people', screen: 'Language' },
      ],
    };
  }

  renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem} onPress={() => this.props.navigation.navigate(item.screen)}>
      <MaterialIcons name={item.icon} size={60} color="#1B5E20" />
      <Text style={styles.gridText}>{item.title}</Text>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <FlatList
          data={this.state.features}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.title}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 20,
  },
  gridContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    backgroundColor: '#DFF6E1',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  gridText: {
    marginTop: 10,
    color: '#0D4D14',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: "#C62828",
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});