import { View, Text, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function AddIntoProject({ 
  addIntoPjVisible,
  setAddIntoPjVisible,
  submittedSingles
   }) {

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handlePress = (index) => {
        setSelectedIndex(index); // Set the selected index when a TouchableOpacity is pressed
    };

  return (
    <Modal            
      animationType="slide"
      transparent={true}
      visible={addIntoPjVisible}
      onRequestClose={() => setAddIntoPjVisible(false)}
    >
       <View style={styles.modalOverlay}>
       <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <Image source={require('./assets/songs-folder.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Add a track</Text>
          </View>         
          <View style={{flexDirection: 'column'}}>
            <Text style={styles.modalSubTitle}>Choose from the existing songs:</Text>
          </View>
         </View>
              
        <ScrollView style={styles.itemList} contentContainerStyle={{ paddingBottom: 20 }}>
        {submittedSingles.map((single, index) => (
            <View key={`single-${index}`}>
            <TouchableOpacity
                style={[
                styles.itemListed,
                { backgroundColor: selectedIndex === index ? '#E3651D' : '#cfcfcf' } // Change background based on the selection
                ]}
                onPress={() => handlePress(index)} // Handle press to change the selected item
            >
                <View style={{ flexDirection: 'row', width: '60%' }}>
                <Image
                    source={require('../Upload/assets/disc.png')}
                    style={{ width: 20, height: 20, marginRight: 8, marginTop: 2 }}
                    resizeMode="contain"
                />
                <Text style={styles.itemListedTitle}>{single.title}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.dividerItems} />
            </View>
        ))}
        </ScrollView>
        
        <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 10, color: '#d6d6d6', fontWeight: 'bold', marginBottom: 7}}>...or write a note to attach to:</Text>
          </View>
        <View style={{width: '100%', height: '100px'}}>
            <TextInput style={styles.inputProjectName} value={singleTitle} onChangeText={text => setSingleTitle(text)} multiline={true} numberOfLines={8} />
        </View>

        <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleAddSubmit()}}>
              <Text style={styles.modalButtons}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleCloseAddModal()}}>
              <Text style={styles.modalButtons}>Cancel</Text>
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    height: 450,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222831'
  },
  modalSubTitle: {
    fontSize: 14,
    color: '#222831',
    fontWeight: 'bold',
    marginBottom: 7
  },
  inputProjectName: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 10
  },
  autoCompInputs: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 20
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold'
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
    paddingBottom: 12
  },
  modalLabels: {
    padding: 10,
    borderRadius: 2,
    marginRight: 5
  },
  notesTitle: {
    fontSize: 14,
    color: 'gray',
    fontWeight: 'bold'
  },
  notesText: {
    fontSize: 12,
    color: 'gray'
  },
  uploadBox: {
    backgroundColor: 'yellow',
    padding: 4,
    width: 75,
    paddingLeft: 15
  }
});
