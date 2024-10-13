import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, database } from '../firebase'; // Make sure to import your Firebase setup
import { ref, remove, get } from 'firebase/database';
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
      // Step 1: Check if user data exists in Firebase Database before trying to delete
      const userRef = ref(database, 'users/' + user.uid);
      const userSnapshot = await get(userRef);
      console.log('Current user ID:', auth.currentUser?.uid);

      if (!userSnapshot.exists()) {
        setLoading(false);
        Alert.alert('Error', 'User data not found in database.');
        return; // Exit if no data is found
      }

      // Log the data found (optional, but useful for debugging)
      console.log('User data found for deletion:', userSnapshot.val());

      // Step 2: Remove user data from Firebase Database
      await remove(userRef);
      console.log('User data successfully deleted from database');

      // Step 3: Delete the user from Firebase Authentication
      await user.delete();
      console.log('User successfully deleted from Firebase Authentication');

      setLoading(false);
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');

      // Redirect to the Registration screen after deletion
      navigation.reset({
        index: 0,
        routes: [{ name: 'Registration' }], // Change 'Registration' to your registration screen name
      });
    } catch (error) {
      setLoading(false);
      console.error('Error deleting user:', error); // Log error for debugging
      Alert.alert('Error', error.message); // Display the error message
    }
  } else {
    Alert.alert('Error', 'No user is currently signed in.');
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
