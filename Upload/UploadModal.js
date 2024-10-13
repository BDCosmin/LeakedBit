import { View, Text, Modal, TextInput, TouchableOpacity, Keyboard, StyleSheet, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function UploadModal({ 
  uploadModalVisible,
  setUploadModalVisible,
  handleSingleSubmit,
  activeGenreButtonSingle,
  handleButtonPressGenreSingle,
  handleCloseModalSingle,
  singleTitle,
  setSingleTitle,
  uploadAudioFile,
  setTempAudioURL,
  setUploadedFileName,
  uploadedFileName,
  setUploadStatus,
  uploadStatus
   }) {

    const [loadingText, setLoadingText] = useState('');
    const [isUploading, setIsUploading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState('');

    // Function to cycle loading text 
    useEffect(() => {
      let intervalId;
      if (isUploading) {
        const loadingStates = ['Uploading.', 'Uploading..', 'Uploading...'];
        let index = 0;
    
        intervalId = setInterval(() => {
          setLoadingText(loadingStates[index]);
          index = (index + 1) % loadingStates.length;  // Cycles through 0, 1, 2
        }, 500);  // Changes every 500ms
      } else {
        setLoadingText('');  // Clears loading text when not uploading
      }   
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [isUploading]);

  // Function to determine background color based on active genre button
  const getButtonColorGenreSingle = (genreButtonId) => {
    return activeGenreButtonSingle === genreButtonId ? '#E3651D' : '#cfcfcf';
  };

  const pickAudio = async () => {
    setErrorMessage('');
    setUploadedFileName('');
    setIsUploading(true);
    setUploadStatus(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        multiple: false,
      });
  
      if (result.canceled) {
        setIsUploading(false);  // Stop the loading cycle if the user cancels
        return;
      }
  
      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileUri = file.uri;
        const fileName = file.name;
        const mimeType = file.mimeType;
  
        console.log('Audio successfully added:', fileName);
  
        // Temporarily upload the file
        const tempURL = await uploadAudioFile(fileUri, mimeType);
  
        setTempAudioURL(tempURL); // Save the temp URL for later use
        setUploadedFileName(fileName);
        setUploadStatus(true);
      }
    } catch (error) {
      console.error('Error in picking audio:', error);
      setErrorMessage('Error picking the audio file.');
    } finally {
      setIsUploading(false);  // Ensure uploading is stopped after the process
    }
  };

  return (
    <Modal            
      animationType="slide"
      transparent={true}
      visible={uploadModalVisible}
      onRequestClose={() => setUploadModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <Image source={require('./assets/add-single-bl.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Upload a single</Text>
          </View>
          <View style={{width: '100%'}}>
            <TextInput style={styles.inputProjectName} placeholder="Single title..." value={singleTitle} onChangeText={text => setSingleTitle(text)} multiline={true} numberOfLines={1} />
          </View>
            
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.modalSubTitle}>Choose the genre</Text>
              
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('pop') }]}
                                  onPress={() => handleButtonPressGenreSingle('pop')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Pop</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('rap') }]}
                                  onPress={() => handleButtonPressGenreSingle('rap')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Hip-Hop/Rap</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('rnb') }]}
                                  onPress={() => handleButtonPressGenreSingle('rnb')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>R&B/Soul</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('rock') }]}
                                  onPress={() => handleButtonPressGenreSingle('rock')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Rock</Text>
                </TouchableOpacity>
              </View>  
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('edm') }]}
                                  onPress={() => handleButtonPressGenreSingle('edm')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Electronic</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('folk') }]}
                                  onPress={() => handleButtonPressGenreSingle('folk')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Folk</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('classic') }]}
                                  onPress={() => handleButtonPressGenreSingle('classic')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Classical</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorGenreSingle('other') }]}
                                  onPress={() => handleButtonPressGenreSingle('other')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Other</Text>
                </TouchableOpacity>                    
            </View>
          </View>

          <View style={{flexDirection: 'column', alignSelf: 'flex-start', marginTop: 10}}>           
            <Text style={styles.modalSubTitle}>Choose the audio file</Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity style={{backgroundColor: '#E3651D', borderRadius: 2}} disabled={isUploading} onPress={pickAudio}>
                <Text style={styles.modalButtons}>Upload</Text>
              </TouchableOpacity>
              {/* Display the loading text if uploading */}
              {isUploading && <Text style={{fontWeight: 'bold', paddingTop: 12, paddingLeft: 7, paddingRight: 25, backgroundColor: 'rgba(207, 207, 207, 0.2)'}}>{loadingText}</Text>}

              {/* Display error message if an error occurs */}
              {errorMessage ? <Text style={{fontWeight: 'bold', paddingTop: 12, paddingLeft: 7, paddingRight: 25, color: 'red', backgroundColor: 'rgba(207, 207, 207, 0.2)'}}>{errorMessage}</Text> : null}

              {/* Show the selected file name after upload is done */}
              {!isUploading && uploadStatus && <Text style={{fontWeight: 'bold', paddingTop: 12, paddingLeft: 7, paddingRight: 25, backgroundColor: 'rgba(207, 207, 207, 0.2)'}}>{uploadedFileName}</Text>}
            </View> 
          </View>

          <View style={{marginTop: 15, marginBottom: 15}}>
            <Text style={styles.notesTitle}>Important:</Text>
            <Text style={styles.notesText}>It is recommended to upload mp3 audio files for a better management.</Text>
            <Text style={styles.notesText}>The singles can be previewed for only 20 seconds inside the app.</Text>
          </View>

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleSingleSubmit()}}>
              <Text style={styles.modalButtons}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleCloseModalSingle()}}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    height: 480,
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
