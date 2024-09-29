import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome } from '@expo/vector-icons';

export default function CreateProject({ CreateProjectModalVisible, setCreateProjectModalVisible, artistName, projectTitle, setprojectTitle, onSubmit }) {
  
  const [openAlbum, setOpenAlbum] = useState(false);
  const [openGenre, setOpenGenre] = useState(false); // Separate state for the second dropdown
  const [albumType, setAlbumType] = useState(null); // Handle album type selection
  const [genreType, setGenreType] = useState(null); // Handle genre type selection

  const [albumItems, setAlbumItems] = useState([
    {label: 'Extended Play (EP)', value: 'epAlbum'},
    {label: 'Long Play (LP)', value: 'lpAlbum'},
    {label: 'Mixtape', value: 'mixtape'}
  ]);

  const [genreItems, setGenreItems] = useState([
    {label: 'Pop', value: 'pop'},
    {label: 'Rock', value: 'rock'},
    {label: 'Hip-hop', value: 'hiphop'}
  ]);

  const handleFormSubmit = () => {
    // Call onSubmit with the form data (projectTitle, albumType, genreType)
    onSubmit({ projectTitle, albumType, genreType });
    // Close the modal
    setCreateProjectModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={CreateProjectModalVisible}
      onRequestClose={() => setCreateProjectModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('./assets/musical-notes.png')} style={{ width: 20, height: 20, marginTop: 6, marginRight: 5 }} resizeMode="contain" />
            <Text style={styles.modalTitle}>Let's get started</Text>
          </View>
          <View style={{width: '100%', position: 'relative'}}>
            <TextInput style={styles.inputArtistName} value={artistName} numberOfLines={1} editable={false} />
            <TextInput style={styles.inputProjectName} placeholder="Project title..." value={projectTitle} onChangeText={setprojectTitle} multiline={true} numberOfLines={1} />
            
            <DropDownPicker
              open={openAlbum}
              value={albumType}
              items={albumItems}
              setOpen={setOpenAlbum}
              setValue={setAlbumType}
              setItems={setAlbumItems}
              placeholder="Project Type"
              dropDownDirection="BOTTOM"
              style={{ backgroundColor: '#fafafa', borderColor: '#ccc' }}
              listMode="SCROLLVIEW"
              ArrowUpIconComponent={() => <FontAwesome name="angle-up" size={24} color="black" />}
              ArrowDownIconComponent={() => <FontAwesome name="angle-down" size={24} color="black" />}
              dropDownContainerStyle={{ backgroundColor: '#e5e5e5', zIndex: 1000 }}
              zIndex={1000}
            />

            <DropDownPicker
              open={openGenre}
              value={genreType}
              items={genreItems}
              setOpen={setOpenGenre}
              setValue={setGenreType}
              setItems={setGenreItems}
              placeholder="Main Genre"
              dropDownDirection="BOTTOM"
              style={{ backgroundColor: '#fafafa', borderColor: '#ccc' }}
              listMode="SCROLLVIEW"
              ArrowUpIconComponent={() => <FontAwesome name="angle-up" size={24} color="black" />}
              ArrowDownIconComponent={() => <FontAwesome name="angle-down" size={24} color="black" />}
              dropDownContainerStyle={{ backgroundColor: '#e5e5e5', zIndex: 1000 }}
              zIndex={1000}
            />
          </View>
          <View style={{marginTop: 15, marginBottom: 25}}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>An EP album has a limit of 5 tracks.</Text>
            <Text style={styles.notesText}>Due to limitations, you are allowed to upload albums containing 20 tracks maximum.</Text>
          </View>

          <View style={styles.modalButtonsSection}>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={handleFormSubmit}>
              <Text style={styles.modalButtons}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: '#222831', borderRadius: 5}} onPress={() => setCreateProjectModalVisible(false)}>
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
    marginBottom: 32,
    color: '#222831'
  },
  inputArtistName: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    color: 'grey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20
  },
  inputProjectName: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns the text to the top for multiline input
    marginBottom: 20
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
