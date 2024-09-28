import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';

export default function BugReportModal({ modalVisible, setModalVisible, email, bugReport, setBugReport, handleSubmitReport }) {
  
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
            <Image source={require('./assets/bug.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Report an issue</Text>
          </View>

          <TextInput style={styles.inputReportEmail} value={email} numberOfLines={1} editable={false} />
          <TextInput style={styles.inputReportMsg} placeholder="Describe the issue..." value={bugReport} onChangeText={setBugReport} multiline={true} numberOfLines={4} />

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => handleSubmitReport(bugReport, setBugReport)}>
              <Text style={styles.modalButtons}>Double Check</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => setModalVisible(false)}>
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
    color: 'grey',
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
  }
});
