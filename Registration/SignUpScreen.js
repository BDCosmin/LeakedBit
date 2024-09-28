import { StatusBar } from 'expo-status-bar';
import { Modal, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Easing, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set, get, child } from 'firebase/database'; // Import Realtime Database methods
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigateToSignIn }) {

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const errMsg = 'Error: Please enter valid account details.';

  // Sign-Up function  
  const handleSignUp = async () => {
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    const trimmedName = name?.trim();

    if (!trimmedName) {
        setModalMessage(errMsg); // Set validation error message
        setModalVisible(true); // Show the modal
        setTimeout(() => setModalVisible(false), 3000); // Hide modal after 3 seconds
        return;
    }

    if (!isValidEmail(trimmedEmail)) {
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
        setLoading(true); // Show loading
        setModalMessage('Loading...'); // Set the loading message
        setModalVisible(true); // Show the modal

        // Query the database to see if the name already exists
        const dbRef = ref(database); // Reference to the database
        const snapshot = await get(child(dbRef, `users/`)); // Query the 'users' node

        let nameExists = false;
        let emailExists = false;

        snapshot.forEach((userSnapshot) => {
        const userData = userSnapshot.val();
        if (userData.name === trimmedName) {
            nameExists = true; // If the name is found in the database, set the flag to true
        }
        if (userData.email === trimmedEmail) {
            emailExists = true; // If the email is found in the database, set the flag to true
        }
        });

        if (nameExists) {
        setLoading(false);
        setModalMessage('Error: The artist name already exists. Please choose a different name.');
        setTimeout(() => setModalVisible(false), 3000);
        return;
        }

        if (emailExists) {
        setLoading(false);
        setModalMessage('Error: This email already exists. Please try again.');
        setTimeout(() => setModalVisible(false), 3000);
        return;
        }

        // Sign up the user
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        const user = userCredential.user;

        console.log('User created:', user);

        // Save user data in the Realtime Database under the user's UID
        await set(ref(database, 'users/' + user.uid), {
        name: trimmedName,
        email: trimmedEmail
        });

        // 3-second loading timer
        setTimeout(() => {
            setLoading(false); // Hide loading
            setModalVisible(false); // Hide the modal
            navigateToSignIn(); // Navigate to the next screen
        }, 3000);

    } catch (error) {   
        setLoading(false); // Hide loading
        if(error.message == 'Firebase: Password should be at least 6 characters (auth/weak-password).')
            setModalMessage('Error: Password should be at least 6 characters.');
        setTimeout(() => {
            setModalVisible(false); // Hide the modal after showing the error
        }, 3000); // Show error for 3 seconds
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
                maxLength={22}
              />
              <TextInput
                style={styles.loginTextField}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                inputMode="email"
              />
              <TextInput
                style={styles.loginTextField}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={40}
              />
             <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>SIGN UP</Text>
             </TouchableOpacity>
             <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 14 }}>
                <Text style={{ color: '#fff', fontSize: 13, paddingRight: 4 }}>
                  Already a member?  
                </Text>
                <TouchableOpacity onPress={navigateToSignIn}>
                  <Text style={styles.signintext}>Sign in here</Text>
                </TouchableOpacity>
              </View>
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
    paddingTop: 135
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
    justifyContent: 'center',
    marginTop: 50,
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
    fontSize: 20,
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
  signintext: {
    color: '#fff', 
    fontSize: 13, 
    textDecorationLine: 'underline'
  }
});