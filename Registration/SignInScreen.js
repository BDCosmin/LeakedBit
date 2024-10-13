import { StatusBar } from 'expo-status-bar';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, Easing, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getDatabase, ref, child, get } from 'firebase/database'; // Import Realtime Database methods
import { database } from '../firebase'; // Adjust the path according to your file structure
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen({ navigateToSignUp }) {

  const navigation = useNavigation(); // Access navigation using the hook

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const errMsg = 'Error: Please enter valid account details.';

   // Sign-In function using name and password
  const handleSignIn = async () => {
    const trimmedName = name?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedName) {
      setModalMessage(errMsg); // Set validation error message
      setModalVisible(true); // Show the modal
      setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
      return;
    }
  
    if (!trimmedPassword) {
      setModalMessage(errMsg); // Set validation error message
      setModalVisible(true); // Show the modal
      setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
      return;
    }

    try {
      // Fetch the Realtime Database reference
      const database = getDatabase(); // Get reference to the Firebase database
      const dbRef = ref(database); // Reference to the root of the database
      const snapshot = await get(child(dbRef, 'users')); // Get all users from the 'users' node
  
      if (snapshot.exists()) {
        let emailToSignIn = null;
  
        // Iterate over all users and find the one with the matching name
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.name === trimmedName) {
            emailToSignIn = userData.email;
          }
        });
  
        if (!emailToSignIn) {
          setModalMessage('Error: No account found for the provided name.'); // Show error in modal
          setModalVisible(true);
          setTimeout(() => setModalVisible(false), 3000);
          return;
        }
  
        // If email found, proceed to sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, trimmedPassword);
        const user = userCredential.user;
  
        // Success message and redirect
        setModalMessage(`Welcome back, ${user.displayName || trimmedName}`);
        setModalVisible(true);
        // 3-second loading timer
        setTimeout(async () => {
          setLoading(false); // Hide loading
          setModalVisible(false); // Hide the modal
          await AsyncStorage.removeItem('loggedOut'); // Clear the loggedOut flag
          navigation.replace('Home'); // Navigate to the next screen
        }, 2000);
        
      } else {
        setModalMessage('Error: No users found.');
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 3000);
      }
    } catch (error) {
      setModalMessage('Error: The name or password is incorrect.'); 
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 3000);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const animatedValue = useRef(new Animated.Value(0)).current;
  // Interpolate the animated value to transition between colors
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    const animateColor = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000, // 3 seconds to go from white to orange
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000, // 3 seconds to go back to white
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColor();
  }, [animatedValue]);

  return (
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.content}>
        <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
        <View style={styles.transparentBox}>
              <TextInput
                style={styles.loginTextField}
                placeholder="Artist Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setArtistName}
                autoCapitalize="none"
                type="text"
              />
              <TextInput
                style={styles.loginTextField}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
             <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>SIGN IN</Text>
             </TouchableOpacity>
             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 14 }}>
                <Text style={{ color: '#fff', fontSize: 13, paddingRight: 4 }}>
                  Are you new here?  
                </Text>
                <TouchableOpacity onPress={navigateToSignUp}>
                  <Text style={styles.resettext}>Sign up now</Text>
                </TouchableOpacity>
              </View>
              {/* Modal for loading/error messages */}
              <Modal visible={modalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {loading ? (
                      <>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.loadingText}>{modalMessage}</Text>
                      </>
                    ) : (
                      <Text style={styles.loadingText}>{modalMessage}</Text>
                    )}
                  </View>
                </View>
              </Modal>
        </View>      
      </View>
      </TouchableWithoutFeedback>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  content: {
    alignItems: 'center',
    paddingTop: 160
  },
  maintext: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold'
  },
  transparentBox: {
    width: 280, // You can adjust the width
    height: 280, // You can adjust the height
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // White with 50% transparency
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10, 
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    paddingBottom: 30
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background with transparency
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#E3651D',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  loginTextField: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    height: 20,
    fontSize: 15,
    marginVertical: 15,
    fontWeight: "50",
    color: '#fff',
    marginLeft: 35,
    marginRight: 35
  },
  navItem: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff', // Green color for the button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 65,
    marginRight: 65
  },
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  },
  resettext: {
    color: '#fff', 
    fontSize: 13, 
    textDecorationLine: 'underline'
  }
});