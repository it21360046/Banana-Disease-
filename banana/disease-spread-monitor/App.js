import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import DiseasePrediction from './src/components/DiseasePrediction';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DiseasePrediction />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App; 