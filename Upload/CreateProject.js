import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';

export default function CreateProject({ 
  createProjectModalVisible,
  setCreateProjectModalVisible,
  activeAlbumButton,
  handleButtonPressAlbumType,
  activeGenreButtonAlbum,
  handleButtonPressGenreAlbum,
  handleProjectSubmit,
  handleCloseModalAlbum,
  projectTitle,
  setProjectTitle
   }) {

    // Function to determine background color based on active album button
  const getButtonColorAlbumType = (albumTypeButtonId) => {
    return activeAlbumButton === albumTypeButtonId ? '#E3651D' : '#cfcfcf';
  };

  // Function to determine background color based on active genre button
  const getButtonColorAlbumGenre = (genreButtonId) => {
    return activeGenreButtonAlbum === genreButtonId ? '#E3651D' : '#cfcfcf';
  };

  return (
    <Modal            
      animationType="slide"
      transparent={true}
      visible={createProjectModalVisible}
      onRequestClose={() => setCreateProjectModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            <Image source={require('./assets/add-album-bl.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Create a project</Text>
          </View>
          <View style={{width: '100%'}}>
            <TextInput style={styles.inputProjectName} placeholder="Project title..." value={projectTitle} onChangeText={text => setProjectTitle(text)} multiline={true} numberOfLines={1} />
            
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.modalSubTitle}>Choose the album type</Text>
              
              <View style={{flexDirection: 'row', marginBottom: 15}}>
                  
                  <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumType('lp') }]}
                                    onPress={() => handleButtonPressAlbumType('lp')}>
                    <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Long-Play (LP)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumType('ep') }]}
                                    onPress={() => handleButtonPressAlbumType('ep')}>
                    <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Extended Play (EP)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumType('mt') }]}
                                    onPress={() => handleButtonPressAlbumType('mt')}>
                    <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Mixtape</Text>
                  </TouchableOpacity>

              </View>             
            </View>

            <View style={{flexDirection: 'column'}}>
              <Text style={styles.modalSubTitle}>Choose the main genre</Text>
              
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('pop') }]}
                                  onPress={() => handleButtonPressGenreAlbum('pop')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Pop</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('rap') }]}
                                  onPress={() => handleButtonPressGenreAlbum('rap')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Hip-Hop/Rap</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('rnb') }]}
                                  onPress={() => handleButtonPressGenreAlbum('rnb')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>R&B/Soul</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('rock') }]}
                                  onPress={() => handleButtonPressGenreAlbum('rock')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Rock</Text>
                </TouchableOpacity>

              </View>  

              <View style={{flexDirection: 'row', marginBottom: 5}}>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('edm') }]}
                                  onPress={() => handleButtonPressGenreAlbum('edm')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Electronic</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('folk') }]}
                                  onPress={() => handleButtonPressGenreAlbum('folk')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Folk</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('classic') }]}
                                  onPress={() => handleButtonPressGenreAlbum('classic')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Classical</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.modalLabels, { backgroundColor: getButtonColorAlbumGenre('other') }]}
                                  onPress={() => handleButtonPressGenreAlbum('other')}>
                  <Text style={{color: '#222831', fontWeight: 'bold', fontSize: 10, alignSelf: 'center', textAlign: 'center'}}>Other</Text>
                </TouchableOpacity>

              </View>                
            </View>        
          </View>
          <View style={{marginTop: 15, marginBottom: 25}}>
            <Text style={styles.notesTitle}>Important:</Text>
            <Text style={styles.notesText}>An EP album has a limit of 5 tracks.</Text>
            <Text style={styles.notesText}>Due to limitations, you are allowed to upload albums containing 20 tracks maximum.</Text>
          </View>

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleProjectSubmit()}}>
              <Text style={styles.modalButtons}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => {handleCloseModalAlbum()}}>
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
    height: 470,
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
  }
});
