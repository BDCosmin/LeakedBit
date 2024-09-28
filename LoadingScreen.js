import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';

export default function LoadingScreen({ navigation }) {

  useEffect(() => {
    // Set a timeout of 3 seconds before redirecting to 'Home'
    const timer = setTimeout(() => {
      navigation.replace('Registration'); // 'replace' to avoid going back to this screen
    }, 3000); // 3000 ms = 3 seconds

    // Clean up the timer if the component unmounts before the time is up
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>LeakedBit</Text>
      <Text style={{color: '#fff'}}>dev version</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold'
  }
});