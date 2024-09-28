import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Animated, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase'; // Authentication
import { useNavigation } from '@react-navigation/native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { fetchUserName, handleSubmitReport, handlePasswordReset } from '../Settings/ProfileHelpers';
import UserPanel from '../Settings/UserPanel';
import OptionList from '../Settings/OptionList';
import BugReportModal from '../Settings/BugReportModal';
import ResetPass from '../Settings/ResetPass';
import DeleteAcc from '../Settings/DeleteAcc';

export default function Profile({ onClose }) {
  const [name, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [bugModalVisible, setBugModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [bugReport, setBugReport] = useState('');

  const navigation = useNavigation();

  const [showConfetti, setShowConfetti] = useState(false);

  // Function to trigger confetti
  const triggerConfetti = () => {
    setShowConfetti(true); // This will trigger confetti in Profile
  };

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 3000, useNativeDriver: false }),
        Animated.timing(animatedValue, { toValue: 0, duration: 3000, useNativeDriver: false }),
      ])
    ).start();
  }, [animatedValue]);

  useEffect(() => {
    fetchUserName(setArtistName, setLoading);
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    setEmail(user ? user.email : 'No user logged in');
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topNav}>
          <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
          <Text style={{ color: '#fff', fontSize: 10, alignSelf: 'center' }}>Released. Unreleased.</Text>
        </View>
        
        <View style={styles.divider} />

        <UserPanel name={name} triggerConfetti={triggerConfetti}/>  

        <ScrollView style={styles.optionsList}>
          <OptionList 
            setResetModalVisible={setResetModalVisible} 
            setDeleteModalVisible={setDeleteModalVisible} 
            setBugModalVisible={setBugModalVisible} 
          />

          <TouchableOpacity 
              style={{backgroundColor: 'rgba(79, 93, 114, 0.91)', height: 50, width: '99%', alignSelf: 'center', marginBottom: 3}}
              onPress={() => navigation.replace('Registration')}
              >
              <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
                  <Image 
                    source={require('./assets/logout.png')} 
                    style={{width: 30, height: 30}}                  
                    resizeMode="contain"                  
                  />
                  <View style={styles.optionContentText}>
                    <Text style={{color: '#fff', fontSize: 20}}>Log Out</Text>
                  </View>
              </View>  
          </TouchableOpacity>
        </ScrollView>
        {showConfetti && (
        <ConfettiCannon
          count={80}               // Number of confetti particles
          origin={{ x: 250, y: -50 }}    // Starting point for confetti (top of screen)
          autoStart={true}           // Start immediately
          fadeOut={true}             // Fade out confetti over time
          explosionSpeed={10}       // Speed of the explosion (adjust for effect)
          fallSpeed={5000}           // Speed at which confetti falls
          onAnimationEnd={() => setShowConfetti(false)}  // Reset after animation
          style={styles.confetti}
        />
      )}
      </View>

       {/* Bug report modal */}
       <BugReportModal 
        modalVisible={bugModalVisible} 
        setModalVisible={setBugModalVisible} 
        email={email} // Pass the email prop here
        bugReport={bugReport} 
        setBugReport={setBugReport} 
        handleSubmitReport={handleSubmitReport} 
      />

       {/* Reset password modal */}
      <ResetPass 
        modalVisible={resetModalVisible} 
        setModalVisible={setResetModalVisible} 
        currentPassword={currentPassword} 
        setCurrentPassword={setCurrentPassword} 
        newPassword={newPassword} 
        setNewPassword={setNewPassword} 
        handlePasswordReset={handlePasswordReset} 
      />

        {/* Delete account modal */}
        <DeleteAcc 
          modalVisible={deleteModalVisible} 
          setModalVisible={setDeleteModalVisible} 
        />

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
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 30
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  topNav: {
    flexDirection: 'column',
    justifyContent: 'space-around', // Distributes navigation items evenly
    width: '100%',
    height: 40
  },
  divider: {
    height: 1, // Height of the line
    width: '80%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.30)', // Color of the line
    marginVertical: 20, // Space above and below the line
    alignSelf: 'center',
    marginTop: 10
  },
  optionsList: {
    flexGrow: 1, // Ensure the ScrollView content expands
    backgroundColor: '#222831',
    width: '80%', 
    alignSelf: 'center'
  },
  userPanel: {
    backgroundColor: 'rgba(69, 81, 99, 0.89)',
    height: 130,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 6,
    flexDirection: 'column'
  },
  userHeader: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 15
  },
  userHeaderText: {
    flexDirection: 'column',
    marginLeft: 15,
    marginTop: 4
  },
  userName: {
    color: '#fff',
    fontSize: 24
  },
  userStatus: {
    color: '#cfcfcf',
    fontSize: 12,
    marginLeft: 1
  },
  editButton: {
    width: 70,
    height: 35,
    backgroundColor: '#495669',
    alignItems: 'center',
    paddingTop: 7,
    marginTop: 9,
    borderRadius: 2
  },
  textEditButton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  optionContainer: {
    backgroundColor: 'rgba(79, 93, 114, 0.91)',
    height: 100,
    width: '99%',
    alignSelf: 'center',
    marginBottom: 3
  },
  optionContent: {
    flexDirection: 'row',
    marginLeft: 24,
    marginTop: 14
  },
  optionContentText: {
    flexDirection: 'column',
    marginLeft: 14
  },
  optionTitle: {
    color: '#fff',
    fontSize: 20,
    marginTop: 4
  },
  optionDesc: {
    color: '#cfcfcf',
    fontSize: 12,
    marginLeft: 1
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    height: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#222831'
  },
  inputReportEmail: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  inputReportMsg: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 20,
  },
  modalButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButtons: {
    color: '#fff', 
    fontWeight: 'bold', 
    paddingLeft: 25, 
    paddingRight: 25, 
    paddingTop: 12, 
    paddingBottom: 12,
  },
  confetti: {
    position: 'absolute',    // Ensure confetti covers the whole screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,               // Make sure it appears on top of other components
  },
});