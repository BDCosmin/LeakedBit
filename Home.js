import React, { useState } from 'react';
import { View, Image, StatusBar, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';

import Dashboard from './Navigation/Dashboard'; // Your Dashboard component
import Library from './Navigation/Library'; // Your Library component
import Profile from './Navigation/Profile'; // Your Profile component

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [loading, setLoading] = useState(false);

  // Function to simulate loading before switching to the Profile screen
  const handleProfileNavigation = () => {
    if (currentScreen !== 'Profile') {
      setLoading(true); // Show custom loading window
      setTimeout(() => {
        setCurrentScreen('Profile');
        setLoading(false); // Hide loading after simulated delay
      }, 500); // Simulate 1.5 seconds of loading
    }
  };

  // Function to render the appropriate screen based on currentScreen state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Library':
        return <Library />;
      case 'Profile':
        return <Profile />;
      default:
        return <Dashboard />; // Default case to handle any unexpected value
    }
  };

  return (
    <View style={styles.container}>  
      
      {/* Render the current screen */}
      {renderScreen()}       

      {/* Bottom navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Dashboard')}>
          <Image 
            source={require('./assets/home-icon.png')} 
            style={{width: 25, height: 25}}                  
            resizeMode="contain"                  
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('Library')}>
          <Image 
            source={require('./assets/library-icon.png')} 
            style={{width: 25, height: 25}}                  
            resizeMode="contain"                  
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfileNavigation}>
          <Image 
            source={require('./assets/profile-icon.png')} 
            style={{width: 25, height: 25}}                  
            resizeMode="contain"                  
          />
        </TouchableOpacity>
      </View>

      {/* Custom Loading Overlay */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
        onRequestClose={() => setLoading(false)} // If the modal needs to close
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingWindow}>
            <Image 
              source={require('./assets/dual-ball.gif')} 
              style={{width: 50, height: 50}}                  
              resizeMode="contain"
            />
            <Text style={styles.loadingText}>Loading Profile...</Text>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E3651D',
    paddingVertical: 20
  },
  navItem: {
    alignItems: 'center',
  },
  // Custom loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for the overlay
  },
  loadingWindow: {
    backgroundColor: '#E3651D',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // Shadow for Android
  },
  loadingText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center'
  }
});