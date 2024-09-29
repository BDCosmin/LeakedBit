import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { ref, child, get } from 'firebase/database';
import CreateProject from '../Upload/CreateProject';

export default function Library() {

  const [name, setArtistName] = useState('Artist Name');
  const [CreateProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const [projectTitle, setprojectTitle] = useState('');

  const animatedValue = useRef(new Animated.Value(0)).current;
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
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColor();
  }, [animatedValue]);

  const handleProjectSubmit = (projectData) => {
    // Handle the project data, for now, just log it
    console.log('New project created:', projectData);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          <View style={styles.topNav}>
            <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
            <Text style={{color: '#fff', fontSize: 10, alignSelf: 'center'}}>Released. Unreleased.</Text>
          </View>     

          <View style={styles.divider} />   

          <View style={styles.controlSection}>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.textUploadButton}>Upload +</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newProjButton} onPress={() => setCreateProjectModalVisible(true)}>
              <Text style={styles.textUploadButton}>New project +</Text>
            </TouchableOpacity> 
          </View>

          <View style={styles.divider} />  

          <ScrollView>
            {/* List of Projects or other content goes here */}
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>

      <CreateProject 
        CreateProjectModalVisible={CreateProjectModalVisible} 
        setCreateProjectModalVisible={setCreateProjectModalVisible} 
        artistName={name}
        projectTitle={projectTitle} 
        setprojectTitle={setprojectTitle}
        onSubmit={handleProjectSubmit}
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
    alignItems: 'flex-start',
    paddingTop: 30
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
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
    marginVertical: 10, // Space above and below the line
    alignSelf: 'center',
    marginTop: 10
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes navigation items evenly
    backgroundColor: '#E3651D',
    paddingVertical: 30
  },
  navItem: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 65,
    marginRight: 65
  },
  controlSection: {
    flexDirection: 'row', 
    alignSelf: 'center',
    width: '80%',
    justifyContent: 'center'
  },
  uploadButton: {
    width: 90,
    height: 35,
    backgroundColor: '#495669',
    alignItems: 'center',
    paddingTop: 7,
    borderRadius: 2,
    marginRight: 10
  },
  newProjButton: {
    width: 120,
    height: 35,
    backgroundColor: '#495669',
    alignItems: 'center',
    paddingTop: 7,
    borderRadius: 2
  },
  textUploadButton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  }
});