import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, database } from '../firebase'; // Make sure to import your Firebase setup
import { ref, remove } from 'firebase/database';
import { useNavigation } from '@react-navigation/native'; // For navigation to the Registration screen

export default function DeleteAcc({ modalVisible, setModalVisible }) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Function to delete the user account
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      try {
        // Step 1: Remove user data from Firebase Database
        const userRef = ref(database, 'users/' + user.uid);
        await remove(userRef);

        // Step 2: Delete the user from Firebase Authentication
        await user.delete();

        setLoading(false);
        Alert.alert('Account Deleted', 'Your account has been successfully deleted.');

        // Redirect to the Registration screen after deletion
        navigation.reset({
          index: 0,
          routes: [{ name: 'Registration' }], // Change 'Registration' to your registration screen name
        });
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text style={styles.modalMessage}>Do you really want to delete your account? This action cannot be undone.</Text>

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#d9534f' }]} onPress={handleDeleteAccount}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalButtonsText}>Yes, Delete</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#222831' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonsText}>No, Cancel</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonsText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
