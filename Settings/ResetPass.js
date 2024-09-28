import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase'; // Import Firebase auth
import { handlePasswordReset } from '../Settings/ProfileHelpers'; // Ensure to import the function

export default function ResetPass({ modalVisible, setModalVisible }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('./assets/reset-password-d.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5}} resizeMode="contain" />
              <Text style={styles.modalTitle}>Reset Password</Text>
            </View>
  
            <TextInput 
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
            />
            <TextInput 
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
  
            <View style={styles.modalButtonsSection}>
              <TouchableOpacity 
                style={[styles.button, {backgroundColor: '#222831', borderRadius: 5}]} 
                onPress={() => {
                  handlePasswordReset(currentPassword, newPassword);
                  setModalVisible(false); // Close modal after reset
                }}
              >
                <Text style={styles.modalButtons}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, {backgroundColor: '#222831', borderRadius: 5}]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtons}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  }
});
