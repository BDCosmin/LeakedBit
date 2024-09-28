import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function OptionList({ setResetModalVisible, setDeleteModalVisible, setBugModalVisible }) {
  return (
    <>
      <TouchableOpacity style={styles.optionContainer} onPress={() => setBugModalVisible(true)}>
        <Option 
          iconSource={require('./assets/warning.png')} 
          title="Report a bug" 
          description1="Encountered an issue?" 
          description2="Please let us know" 
        />
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.optionContainer} onPress={() => setResetModalVisible(true)}>
        <Option 
          iconSource={require('./assets/reset-password.png')} 
          title="Reset password" 
          description1="Follow the instructions to" 
          description2="create a new password." 
        />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.optionContainer} onPress={() => setDeleteModalVisible(true)}>
        <Option 
          iconSource={require('./assets/lock.png')} 
          title="Delete account" 
          description1="Changed your mind? Here you" 
          description2="can remove your account." 
        />
      </TouchableOpacity>
    </>
  );
}

const Option = ({ iconSource, title, description1, description2 }) => (
  <View style={styles.optionContent}>
    <Image source={iconSource} style={styles.icon} resizeMode="contain" />
    <View style={styles.optionContentText}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionDesc}>{description1}</Text>
      <Text style={styles.optionDesc}>{description2}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  icon: {
    width: 60, 
    height: 60, 
    marginTop: 5
  }
});
