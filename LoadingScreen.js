import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

export default function LoadingScreen({ navigation }) {

  useEffect(() => {
    const checkAuthStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser; // Check if there's a logged-in user
      const loggedOut = await AsyncStorage.getItem('loggedOut'); // Check if the user manually logged out

      // If there's a user and they haven't logged out manually, go to 'Home'
      if (user && !loggedOut) {
        navigation.replace('Home');
      } else {
        // Otherwise, go to 'Registration'
        navigation.replace('Registration');
      }
    };

    // Set a timeout of 1.5 seconds before checking authentication status
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 1500);

    // Clean up the timer if the component unmounts before the time is up
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>LeakedBit</Text>
      <Text style={{color: '#fff', fontSize: 16}}>v0.2 - dev edition</Text>
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
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: -70
  }
});