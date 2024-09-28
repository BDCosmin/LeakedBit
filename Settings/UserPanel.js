import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

export default function UserPanel({ name, triggerConfetti }) {

  const handleConfettiPress = async () => {
    triggerConfetti(); // Trigger the confetti from Profile
  };

  return (
    <TouchableOpacity style={styles.userPanel} onPress={handleConfettiPress}>
      <View style={styles.userHeader}>
        <Image 
          source={require('./assets/user-pic-tmp.png')} 
          style={{width: 80, height: 80, marginLeft: 25}} 
          resizeMode="contain" 
        />
        <View style={styles.userHeaderText}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userStatus}>LeakedBit member</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userPanel: {
    backgroundColor: '#eb9360',
    height: 130,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 35,
    marginTop: 10,
    borderRadius: 6,
    flexDirection: 'column'
  },
  userHeader: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 20
  },
  userHeaderText: {
    flexDirection: 'column',
    marginLeft: 20,
    marginTop: 15
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  userStatus: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 1,
    alignSelf: 'center'
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
  }
});
