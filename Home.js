import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StatusBar, TouchableOpacity, StyleSheet, Modal, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from './firebase';
import { getStorage, uploadBytes, getDownloadURL, ref as sRef  } from 'firebase/storage';
import { set, onValue, off, getDatabase, push, ref as dRef, remove } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import Dashboard from './Navigation/Dashboard'; // Your Dashboard component
import Library from './Navigation/Library'; // Your Library component
import Profile from './Navigation/Profile'; // Your Profile component

export default function Home({
  handleProjectSubmit,
  handleSingleSubmit
}) {
  const [name, setArtistName] = useState('');
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [submittedProjects, setSubmittedProjects] = useState([]); 
  const [submittedSingles, setSubmittedSingles] = useState([]); 
  const [submittedData, setSubmittedData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState('0:00');

  const user = auth.currentUser;
  const userId = auth.currentUser?.uid;

  const navigation = useNavigation();

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
        return (
          <Library 
            handleProjectSubmit={handleProjectSubmit}
            handleSingleSubmit={handleSingleSubmit}
            submittedProjects={submittedProjects}
            submittedSingles={submittedSingles}
            saveToDatabaseSingle={saveToDatabaseSingle}
            saveToDatabaseProj={saveToDatabaseProj}
            setSubmittedSingles={setSubmittedSingles}
            setSubmittedProjects={setSubmittedProjects}
            fetchUserName={fetchUserName}
            name={name}
            setArtistName={setArtistName}
            userId={userId}
            setUploadedFileName={setUploadedFileName}
            uploadedFileName={uploadedFileName}
            setUploadStatus={setUploadStatus}
            uploadStatus={uploadStatus}
            playAudioPreview={playAudioPreview}
            isPlaying={isPlaying}
            playingIndex={playingIndex}
            currentTime={currentTime}
          />
        );
      case 'Profile':
        return  (
          <Profile 
            handleLogout={handleLogout}
            handlePasswordReset = {handlePasswordReset}
            fetchUserNameProfile={fetchUserNameProfile}
            name={name}
            setArtistName={setArtistName}
          />
        );
      default:
        return <Dashboard />; // Default case to handle any unexpected value
    }
  };

  const fetchUserName = (setArtistName) => {
    try {
      if (user) {
        const userRef = dRef(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.name) {
            setArtistName(userData.name);
          } else 
            console.log('User data not found');         
        });
        return () => off(userRef);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserNameProfile = (setArtistName, setLoading) => {
    try {
      if (user) {
        const userRef = dRef(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.name) {
            setArtistName(userData.name);
          } else {
            console.log('User data not found');
          }
          setLoading(false);
        });
        return () => off(userRef);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
        setSubmittedProjects([]);
        setSubmittedSingles([]);
        await auth.signOut();
        console.log('User signed out successfully');
        await AsyncStorage.setItem('loggedOut', 'true');
        // Clear any local state or AsyncStorage data if necessary
        navigation.replace('Registration');
    } catch (error) {
        console.error('Error signing out:', error);
        Alert.alert('Error', 'There was an error signing out. Please try again.');
    }
  };

  const handlePasswordReset = async (currentPassword, newPassword) => {
    if (!user) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }
  
    // Ensure the new password is valid
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Please enter a valid new password with at least 6 characters.');
      return;
    }
  
    try {
      // Step 1: Re-authenticate the user to perform sensitive actions
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
  
      await reauthenticateWithCredential(user, credential); // Re-authentication
      console.log('User re-authenticated');
  
      // Step 2: Update the password with the new one
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Your password has been successfully updated.');
  
      // Optionally, log the user out after updating the password and redirect to login screen
      // await auth.signOut();
      // navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to reset the password.');
    }
  };

  const saveToDatabaseSingle = async (newData, dataType) => {
    const { title } = newData;
    try {
      // Log userId and newData to debug
      console.log('User ID:', userId); // Logs to ensure it's defined
      console.log('Data to be saved:', newData); // Log the data to be saved
  
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return null; // Exit if user is not authenticated
      }
  
      // Get a reference to the user's data node in Firebase Realtime Database
      const userDbRef = dRef(database, `users/${userId}/${dataType}/${title}`);
      console.log('Database Reference:', userDbRef.toString());
  
      // Use set() to save the new data to Firebase under the generated key
      await set(userDbRef, newData);
      console.log(`${dataType} saved successfully to Firebase`);
  
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      Alert.alert('Error', 'There was an error saving data to Firebase.');
      return null; // Return null in case of error
    }
  };  

  const saveToDatabaseProj = async (newData, dataType) => {
    const { title } = newData;
    try {
  
      console.log('Data to be saved:', newData); // Log the data to be saved
  
      if (!userId) {
        Alert.alert('Error', 'User not authenticated');
        return null; // Exit if user is not authenticated
      }
  
      const storage = getStorage();

      // Get a reference to the user's data node in Firebase Realtime Database
      const userDbRef = dRef(database, `users/${userId}/${dataType}/${title}`);
      console.log('Database Reference:', userDbRef.toString());

      // Get a reference to the user's data node in Firebase Storage
      const userStRef = sRef(storage, `audio/${name}'s projects/${title}`);
      console.log('Database Reference:', userStRef.toString());
  
      // Adds folder
      await uploadBytes(userStRef);
      console.log(`${dataType} saved successfully to Firebase Storage`);
      // Use set() to save the new data to Firebase under the generated key
      await set(userDbRef, newData);
      console.log(`${dataType} saved successfully to Firebase Database`);
  
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      Alert.alert('Error', 'There was an error saving data to Firebase.');
      return null; // Return null in case of error
    }
  };

  const playAudioPreview = async (single, index) => {
    if (isLoading || isPlaying) return; // Prevent if loading or already playing

    try {
      setIsLoading(true); // Set loading to true
      setIsPlaying(true); // Set playing to true

      // Stop any currently playing audio
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const storage = getStorage();
      const audioRef = sRef(storage, `audio/${name}'s singles/${single.title}`);
      const audioUrl = await getDownloadURL(audioRef); // Get the audio file's URL

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound); // Save the sound object to manage it later
      setPlayingIndex(index); // Set the index of the currently playing item

      let timer = 0;
      setCurrentTime('0:00'); // Reset the timer

       // Update timer every second
       const intervalId = setInterval(() => {
        if (timer < 20) {
          timer += 1;
          setCurrentTime(`${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`);
        }
      }, 1000);

      // Set a timer to stop the audio after 20 seconds
      setTimeout(async () => {
        await newSound.stopAsync();
        clearInterval(intervalId); // Clear the timer
        setPlayingIndex(null); // Reset after the preview ends
        setIsPlaying(false); // Set playing to false
        setIsLoading(false); // Set loading to false
      }, 20000); 
      
      // Clear interval when the sound unloads
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          clearInterval(intervalId); // Clear the timer when playback finishes
          setPlayingIndex(null); // Reset the playing index
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio preview:', error);
      setIsLoading(false); // Reset loading state on error
      setIsPlaying(false); // Reset playing state on error
    }
  };

  // useEffect to unload the sound when component unmounts or sound changes
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload sound when component unmounts
      }
    };
  }, [sound]); // Dependency array includes sound

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