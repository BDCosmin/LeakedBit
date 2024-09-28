import React, { useState } from 'react';
import { View, Image, StatusBar, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

import SignInScreen from '../Registration/SignInScreen'; // Import SignInScreen component
import SignUpScreen from '../Registration/SignUpScreen'; // Import SignUpScreen component

export default function Registration() {

  const [currentScreen, setCurrentScreen] = useState('SignUp');

  const renderScreen = () => {
    if (currentScreen === 'SignUp') {
      return <SignUpScreen navigateToSignIn={() => setCurrentScreen('SignIn')} />;
    } else if (currentScreen === 'SignIn') {
      return <SignInScreen navigateToSignUp={() => setCurrentScreen('SignUp')} />;
    }
  };

  return (
    <View style={styles.container}>
    
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'android' ? 'height' : null}
        >
          {/* Your SignUp or SignIn components */}
          {renderScreen()}

        </KeyboardAvoidingView>
        
      <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Image 
            source={require('./assets/home-icon.png')} 
            style={{width: 25, height: 25}}                 
            resizeMode="contain"                 
            />
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes navigation items evenly
    backgroundColor: '#E3651D',
    paddingVertical: 20
  },
  navItem: {
    alignItems: 'center'
  }
});