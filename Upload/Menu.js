import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function Menu({ setCreateProjectModalVisible, setUploadModalVisible }) {
  return (
    <View style={styles.controlSection}>
      <TouchableOpacity style={styles.uploadButton} onPress={() => setUploadModalVisible(true)}>
        <Text style={styles.textUploadButton}>Upload +</Text>
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.newProjButton} onPress={() => setCreateProjectModalVisible(true)}>
        <Text style={styles.textUploadButton}>New project +</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    }
});
