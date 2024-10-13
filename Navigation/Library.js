import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, Image, Animated, Easing, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { database } from '../firebase';
import { getStorage, uploadBytes, getDownloadURL, deleteObject, ref as sRef } from 'firebase/storage';
import { set, getDatabase, push, ref as dRef, remove } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

import CreateProject from '../Upload/CreateProject';
import UploadModal from '../Upload/UploadModal';
import Menu from '../Upload/Menu';

export default function Library({
  submittedProjects,
  submittedSingles,
  saveToDatabaseSingle,
  saveToDatabaseProj,
  setSubmittedProjects,
  setSubmittedSingles,
  fetchUserName,
  name,
  setArtistName,
  userId,
  setUploadStatus,
  uploadStatus,
  setUploadedFileName,
  uploadedFileName,
  playAudioPreview,
  isPlaying,
  playingIndex,
  currentTime
}) { 
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [submittedProjectTitle, setSubmittedProjectTitle] = useState('');

  const [singleTitle, setSingleTitle] = useState('');
  const [submittedSingleTitle, setSubmittedSingleTitle] = useState('');
  const [genreSingle, setGenreSingle] = useState(''); // State for genre
  const [audio, setAudio] = useState(null);
  const [tempURL, setTempAudioURL] = useState(null);

  const [audioUploaded, setAudioUploaded] = useState(false);

  const [albumType, setAlbumType] = useState(''); // State for album type
  const [genreProject, setGenreProject] = useState(''); // State for genre
  
  const albumTypes = ['LP', 'EP', 'Mixtape'];
  const genres = ['Pop', 'Hip-Hop/Rap', 'R&B/Soul', 'Rock', 'Electronic', 'Folk', 'Classical', 'Other'];
  
  const [activeAlbumButton, setActiveAlbumButton] = useState(null); // State to track which button is active
  const [activeGenreButtonAlbum, setActiveGenreButtonAlbum] = useState(null); // State to track which button is active
  const [activeGenreButtonSingle, setActiveGenreButtonSingle] = useState(null);
  
  const newProject = { 
    title: projectTitle.trim(),
    albumType, 
    genreProject
   };

   const newSingle = {
    title: singleTitle.trim(),
    genreSingle,
    audioURL: tempURL
  };

  const uploadAudioFile = async (fileUri, mimeType) => {
    try {
      const storage = getStorage();
      const userStRef = sRef(storage, `audio/${name}'s singles/${newSingle.title}`); 
  
      // Fetch file as Blob
      const response = await fetch(fileUri);
      const blob = await response.blob();
  
      // Upload the file
      await uploadBytes(userStRef, blob, { contentType: mimeType });
      console.log('Temporary upload successful!');
  
      // Get the download URL
      const downloadURL = await getDownloadURL(userStRef);
      console.log('Temporary file available at', downloadURL);

      setAudioUploaded(true);
  
      return downloadURL; // Return URL for later use
    } catch (error) {
      console.error('Error uploading temporary audio file:', error);
      throw error; // Ensure the error is thrown to be caught in the calling function
    }
  };  

  const deleteSingleOrProject = async (index, isProject, title) => {
    try {
      if (isProject) {
        // Remove the project from the list (UI update)
        setSubmittedProjects(prevProjects => prevProjects.filter((_, i) => i !== index));
        console.log('Project deleted at index:', index);
  
        const storage = getStorage();

        // Delete from Firebase Database and Storage
        const projRefDb = dRef(database, `users/${userId}/${name}'s projects/${title}`);
        const projRefSt = sRef(storage, `audio/${name}'s projects/${title}`);
        console.log(userId);
  
        // Delete from Realtime Database
        await remove(projRefDb);
        console.log('Project deleted from database.');
  
        // Delete from Storage
        await deleteObject(projRefSt);
        console.log('Project deleted from storage.');

      } else {
        // Remove the single from the list (UI update)
        setSubmittedSingles(prevSingles => prevSingles.filter((_, i) => i !== index));
        console.log('Single deleted at index:', index);
  
        const storage = getStorage();

        // Delete from Firebase Database and Storage
        const singleRefDb = dRef(database, `users/${userId}/${name}'s singles/${title}`);
        const singleRefSt = sRef(storage, `audio/${name}'s singles/${title}`);
        console.log(userId);
  
        // Delete from Realtime Database
        await remove(singleRefDb);
        console.log('Single deleted from database.');
  
        // Delete from Storage
        await deleteObject(singleRefSt);
        console.log('Single deleted from storage.');
      }
    } catch (error) {
      console.error('Error deleting single or project:', error);
      Alert.alert('Error', 'There was an error deleting the item.');
    }
  };

  // Function to handle button press, setting the active button
  const handleButtonPressAlbumType = (albumTypeButtonId) => {
    setActiveAlbumButton(albumTypeButtonId); // Set the active button based on the id
    albumTypePicker(albumTypeButtonId); // Update album type immediately
  };

  // Function to handle button press, setting the active button
  const handleButtonPressGenreAlbum = (genreButtonId) => {
    setActiveGenreButtonAlbum(genreButtonId); // Set the active button based on the id
    genrePickerAlbum(genreButtonId); // Update genre immediately
  };

  // Function to handle button press, setting the active button
  const handleButtonPressGenreSingle = (genreButtonId) => {
    setActiveGenreButtonSingle(genreButtonId); // Set the active button based on the id
    genrePickerSingle(genreButtonId); // Update genre immediately
  };

  const handleProjectSubmit = async () => {
    if (!projectTitle.trim() || !projectTitle || !albumType || !genreProject) {
      Alert.alert('Error', 'Please fill in all fields.');    
      return; // Exit early if any field is empty
    } else {
    
    // Store the title on submit in a separate state
    setSubmittedProjectTitle(projectTitle);

    // Save to Firebase Database
    setSubmittedProjects(prevProjects => [...prevProjects, newProject]);
    await saveToDatabaseProj(newProject, `${name}'s projects`, submittedProjectTitle);

    // Use the selected album type and genre directly
    console.log('Album Type:', albumType);
    console.log('Genre:', genreProject);
    console.log('Project Title:', projectTitle);

    // Clear the project title input
    handleCloseModalAlbum();
  }
  };

  const handleSingleSubmit = async () => {
    if (!singleTitle.trim() || !genreSingle || !audioUploaded) {
      Alert.alert('Error', 'Please fill in all fields.');
      // Use the selected album type and genre directly
      console.log('Album Type: ', singleTitle.trim());
      console.log('Genre: ', genreSingle);
      console.log('State: ', audioUploaded);
      return;
    }
  
    try {
      setSubmittedSingleTitle(singleTitle);
  
      // Save to Firebase Database
      setSubmittedSingles(prevSingles => [...prevSingles, newSingle]);
      await saveToDatabaseSingle(newSingle, `${name}'s singles`, submittedSingleTitle);
  
      // Reset states after submission
      handleCloseModalSingle();
    } catch (error) {
      Alert.alert('Error', 'There was an error saving the audio file.');
      console.error('Error saving the single:', error);
    }
  };  

  const handleAddSubmit = async () => {

  }

  // Handle cancel/submit and clear selections when modal closes
  const handleCloseModalAlbum = () => {
    setCreateProjectModalVisible(false);
    setActiveAlbumButton(null); 
    setActiveGenreButtonAlbum(null); 
    setAlbumType(''); 
    setGenreProject(''); 
    setProjectTitle('');
    setAudioUploaded(false);
  };

  // Handle cancel/submit and clear selections when modal closes
  const handleCloseModalSingle = () => {
    setUploadModalVisible(false);
    setActiveGenreButtonSingle(null); 
    setGenreSingle('');
    setAudioUploaded(false);
    setTempAudioURL(null);
    setSingleTitle('');
    setUploadStatus(false);
    setUploadedFileName('');
  };

  const handleCloseAddModal = async () => {

  }

  const albumTypePicker = (albumTypeButtonId) => {
    switch (albumTypeButtonId) {
      case 'lp':
        setAlbumType(albumTypes[0]);
        break;
      case 'ep':
        setAlbumType(albumTypes[1]);
        break;
      case 'mt':
        setAlbumType(albumTypes[2]);
        break;
      default:
        setAlbumType('');
        break;
    }
  };

  const genrePickerAlbum = (genreButtonId) => {
    switch (genreButtonId) {
      case 'pop':
        setGenreProject(genres[0]);
        break;
      case 'rap':
        setGenreProject(genres[1]);
        break;
      case 'rnb':
        setGenreProject(genres[2]);
        break;
      case 'rock':
        setGenreProject(genres[3]);
        break;
      case 'edm':
        setGenreProject(genres[4]);
        break;
      case 'folk':
        setGenreProject(genres[5]);
        break;
      case 'classic':
        setGenreProject(genres[6]);
        break;
      case 'other':
        setGenreProject(genres[7]);
        break;
      default:
        setGenreProject('');
        break;
    }
  };

  const genrePickerSingle = (genreButtonId) => {
    switch (genreButtonId) {
      case 'pop':
        setGenreSingle(genres[0]);
        break;
      case 'rap':
        setGenreSingle(genres[1]);
        break;
      case 'rnb':
        setGenreSingle(genres[2]);
        break;
      case 'rock':
        setGenreSingle(genres[3]);
        break;
      case 'edm':
        setGenreSingle(genres[4]);
        break;
      case 'folk':
        setGenreSingle(genres[5]);
        break;
      case 'classic':
        setGenreSingle(genres[6]);
        break;
      case 'other':
        setGenreSingle(genres[7]);
        break;
      default:
        setGenreSingle('');
        break;
    }
  };

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['white', '#E3651D'],
  });

  useEffect(() => {
    fetchUserName(setArtistName);
  }, []);

  useEffect(() => {
    const animateColor = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateColor();
  }, [animatedValue]);

  // Reset the values when the modal is opened
  useEffect(() => {
    if (createProjectModalVisible || uploadModalVisible) {
      // Reset the selections and input field when opening the modal
      setProjectTitle('');
      setSingleTitle('');
      setActiveAlbumButton(null);
      setActiveGenreButtonAlbum(null);
      setActiveGenreButtonSingle(null);
      setAlbumType('');
      setGenreProject('');
      setGenreSingle('');
      setAudio(null);
    }
  }, [createProjectModalVisible, uploadModalVisible]);

      useEffect(() => {
        const loadProjects = async () => {
            try {
                const storedProjects = await AsyncStorage.getItem(`${name}'s projects`);
                if (storedProjects) {
                    setSubmittedProjects(JSON.parse(storedProjects));
                }
            } catch (error) {
                console.error('Error loading projects from AsyncStorage:', error);
            }
        };

        loadProjects();
    }, [name]); // Add `name` as a dependency to re-run if it changes

    useEffect(() => {
        const saveProjects = async () => {
            try {
                await AsyncStorage.setItem(`${name}'s projects`, JSON.stringify(submittedProjects));
            } catch (error) {
                console.error('Error saving projects to AsyncStorage:', error);
            }
        };

        saveProjects();
    }, [submittedProjects]);

    useEffect(() => {
        const loadSingles = async () => {
            try {
                const storedSingles = await AsyncStorage.getItem(`${name}'s singles`);
                if (storedSingles) {
                    setSubmittedSingles(JSON.parse(storedSingles));
                }
            } catch (error) {
                console.error('Error loading singles from AsyncStorage:', error);
            }
        };

        loadSingles();
    }, [name]); // Add `name` as a dependency to re-run if it changes

    useEffect(() => {
        const saveSingles = async () => {
            try {
                await AsyncStorage.setItem(`${name}'s singles`, JSON.stringify(submittedSingles));
            } catch (error) {
                console.error('Error saving singles to AsyncStorage:', error);
            }
        };

        saveSingles();
    }, [submittedSingles]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
        <LinearGradient
          colors={['#FFFFFF', '#222831']} 
          style={styles.gradientView}
          start={{ x: 0.7, y: -2 }} 
          end={{ x: 0.7, y: 1 }}  
        >
          <View style={styles.topNav}>
            <View style={{flexDirection: 'column'}}>
              <Animated.Text style={[styles.maintext, { color: animatedColor }]}>LeakedBit</Animated.Text>
              <Text style={{color: '#fff', fontSize: 10, alignSelf: 'flex-start'}}>Released. Unreleased.</Text>
            </View>
            <View style={styles.controlSection}>
              <TouchableOpacity style={styles.uploadButton} onPress={() => setUploadModalVisible(true)}>
                <Image source={require('../Upload/assets/add-single.png')} style={{ width: 35, height: 35, marginRight: 8, marginTop: 2 }} resizeMode="contain" />
              </TouchableOpacity>
            
              <TouchableOpacity style={styles.newProjButton} onPress={() => setCreateProjectModalVisible(true)}>
                <Image source={require('../Upload/assets/add-album.png')} style={{ width: 35, height: 35, marginRight: 8, marginTop: 2 }} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>     
          
          <View style={styles.divider} />   

          <ScrollView style={styles.itemList} contentContainerStyle={{ paddingBottom: 20 }}>
          {submittedProjects.map((project, index) => (
            <View key={`project-${index}`}>
              <TouchableOpacity style={styles.itemListed}>
                <View style={{ flexDirection: 'row', width: '63%' }}>
                  <Image source={require('../Upload/assets/open-folder.png')} style={{ width: 20, height: 20, marginRight: 8, marginTop: 2 }} resizeMode="contain" />
                  <Text style={styles.itemListedTitle}>{project.title}</Text>
                </View>
                <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginTop: 2}}>
                  <Text style={styles.itemListedDetails}>{project.albumType}</Text>
                  <TouchableOpacity style={styles.actionItem}>
                    <Image source={require('./assets/add.png')} style={{ width: 17, height: 17, alignSelf: 'center'}} resizeMode="contain" />
                  </TouchableOpacity>  
                  <TouchableOpacity style={styles.actionItem} onPress={() => deleteSingleOrProject(index, true, project.title)}>
                    <Image source={require('./assets/trash.png')} style={{ width: 17, height: 17}} resizeMode="contain" />
                  </TouchableOpacity>                  
                </View>              
              </TouchableOpacity>
              <View style={styles.dividerItems} />
            </View>
          ))}
          {submittedSingles.map((single, index) => (
          <View key={`single-${index}`}>
            <TouchableOpacity style={[styles.itemListed, playingIndex === index && styles.activeItem]} onPress={() => playAudioPreview(single, index)} disabled={isPlaying}>
              <View style={{ flexDirection: 'row', width: '60%' }}>
                <Image source={playingIndex === index ? require('../Upload/assets/music-playing.png') : require('../Upload/assets/disc.png')} style={{ width: 20, height: 20, marginRight: 8, marginTop: 2 }} resizeMode="contain" />
                <Text style={styles.itemListedTitle}>{single.title}</Text>
                {playingIndex === index && (
                  <Text style={styles.timerText}>{currentTime}</Text>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 2}}>
                <Text style={styles.itemListedDetails}>Single</Text>
                <TouchableOpacity style={styles.actionItem}>
                  <Image source={require('./assets/download.png')} style={{ width: 17, height: 17, marginTop: 1}} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem} onPress={() => deleteSingleOrProject(index, false, single.title)}>
                  <Image source={require('./assets/trash.png')} style={{ width: 17, height: 17}} resizeMode="contain" />
                </TouchableOpacity>
              </View>             
            </TouchableOpacity>
            <View style={styles.dividerItems} />
          </View>
          ))}
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>

      <CreateProject
        createProjectModalVisible={createProjectModalVisible}
        setCreateProjectModalVisible={setCreateProjectModalVisible}
        handleProjectSubmit={handleProjectSubmit}
        handleCloseModalAlbum={handleCloseModalAlbum}
        activeAlbumButton={activeAlbumButton}
        handleButtonPressAlbumType={handleButtonPressAlbumType}
        activeGenreButtonAlbum={activeGenreButtonAlbum}
        handleButtonPressGenreAlbum={handleButtonPressGenreAlbum}
        projectTitle={projectTitle}
        setProjectTitle={setProjectTitle} 
     />
      <UploadModal
        uploadModalVisible={uploadModalVisible}
        setUploadModalVisible={setUploadModalVisible}
        handleSingleSubmit={handleSingleSubmit}
        handleButtonPressGenreSingle={handleButtonPressGenreSingle}
        handleCloseModalSingle={handleCloseModalSingle}
        activeGenreButtonSingle={activeGenreButtonSingle}
        singleTitle={singleTitle}
        setSingleTitle={setSingleTitle}
        audio={audio}
        uploadAudioFile={uploadAudioFile}
        setTempAudioURL={setTempAudioURL}
        setUploadedFileName={setUploadedFileName}
        uploadedFileName={uploadedFileName}
        setUploadStatus={setUploadStatus}
        uploadStatus={uploadStatus}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    justifyContent: 'space-between'
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
  },
  maintext: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold'
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes navigation items evenly
    width: '100%',
    paddingTop: 48,
    paddingLeft: 40,
    paddingBottom: 12,
    paddingRight: 40
  },
  divider: {
    height: 1, // Height of the line
    width: '100%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.30)', // Color of the line
    alignSelf: 'center',
    marginBottom: 9
  },
  dividerItems: {
    height: 1, // Height of the line
    width: '100%', // Width of the line
    backgroundColor: 'rgba(204, 204, 204, 0.1)', // Color of the line
    alignSelf: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distributes navigation items evenly
    backgroundColor: '#E3651D',
    paddingVertical: 30
  },
  navItem: {
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#fff', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 65,
    marginRight: 65
  },
  activeItem: {
    backgroundColor: 'rgba(0, 56, 34, 0.65)',
  },
  controlSection: {
    flexDirection: 'row', 
    width: 90,
    height: 40,
    justifyContent: 'flex-end',
    marginLeft: 200,
    marginTop: -5
  },
  uploadButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    paddingTop: 7,
    paddingLeft: 7,
    borderRadius: 4,
    marginRight: 10
  },
  newProjButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    paddingTop: 7,
    paddingLeft: 7,
    borderRadius: 2
  },
  textUploadButton: {
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonText: {
    color: '#1E201E',
    fontSize: 15,
    fontWeight: 'bold'
  },
  itemList: {
    width: '100%'
  },
  itemListed: {
    flexDirection: 'row',
    padding: 10,  
    width: '100%',
    justifyContent: 'space-between'
  },
  itemListedTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff'
  },
  itemListedDetails: {
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#e3e3e3',
    backgroundColor: 'rgba(227, 101, 28, 0.3)',
    padding: 2,
    paddingTop: 6,
    paddingLeft: 7,
    paddingRight: 7,
    height: 30,
    marginRight: 7,
    marginTop: -4,
    borderRadius: 6
  },
  actionItem: {
    width: 'auto',
    marginTop: -3, 
    marginRight: 5, 
    backgroundColor: 'rgba(227, 101, 28, 0.5)',
    padding: 5,
    borderRadius: 6
  },
  timerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 9,
    marginRight: 30,
    marginLeft: 8,
    marginTop: 7
  }
});