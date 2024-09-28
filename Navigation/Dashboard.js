import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Easing, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { ref, child, get } from 'firebase/database'; // Import Realtime Database methods
import { database } from '../firebase'; // Adjust the path according to your file structure

export default function Dashboard() {

  const [name, setArtistName] = useState();
  const [email, setEmail] = useState();

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
        <View style={styles.topNav}>
            <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
            <Text style={{color: '#fff', fontSize: 10, alignSelf: 'center'}}>Released. Unreleased.</Text>
        
        </View>     
        {/* Horizontal dividing line */}
        <View style={styles.divider} />   

        <View style={styles.transparentBox}>
            <Text style={styles.numberDisplay}>0</Text>
            <Text style={styles.descDisplay}>leaked albums</Text>
        </View>

        <View style={styles.transparentBox}>
            <Text style={styles.numberDisplay}>0</Text>
            <Text style={styles.descDisplay}>leaked singles</Text>
        </View>

        <View style={styles.transparentBox}>
            <Text style={styles.numberDisplay}>0</Text>
            <Text style={styles.descDisplay}>leaked teasers</Text>
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
    alignItems: 'flex-start',
    paddingTop: 30
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  transparentBox: {
    alignSelf: 'center',
    width: 220, // You can adjust the width
    height: 140, // You can adjust the height
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // White with 50% transparency
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 10, 
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 30
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
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  },
  numberDisplay: {
    fontSize: 50,
    color: '#fff',
    marginLeft: 25,
    fontWeight: 'bold'
  },
  descDisplay: {
    fontSize: 15,
    color: '#fff',
    marginLeft: 25,
    fontWeight: 'bold'
  }
});