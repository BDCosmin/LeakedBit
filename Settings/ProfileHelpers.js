import { ref, onValue, off } from 'firebase/database'; // Import Realtime Database methods
import { auth, database } from '../firebase';
import * as MailComposer from 'expo-mail-composer';
import { Alert } from 'react-native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

export const fetchUserName = (setArtistName, setLoading) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, 'users/' + user.uid);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.name) {
          setArtistName(userData.name);
        } else {
          console.log('User data not found');
        }
        setLoading(false);
      });
      return () => off(userRef);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    setLoading(false);
  }
};

export const handleSubmitReport = async (bugReport, setBugReport) => {
  if (!bugReport) {
    Alert.alert('Error', 'Please enter a valid report before sending.');
    return;
  }
  try {
    const result = await MailComposer.composeAsync({
      subject: 'LeakedBit: Bug Report',
      recipients: ['kozcontakt@gmail.com'],
      body: bugReport,
      isHtml: true,
    });

    if (result.status === MailComposer.MailComposerStatus.SENT) {
      setBugReport('');
    } else {
      Alert.alert('Report', 'Action cancelled.');
    }
  } catch (error) {
    Alert.alert('Error', 'An unexpected error occurred while sending the report.');
  }
};

// This function handles password reset within the app
export const handlePasswordReset = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert('Error', 'No user is logged in.');
    return;
  }

  // Ensure the new password is valid
  if (!newPassword || newPassword.length < 6) {
    Alert.alert('Error', 'Please enter a valid new password with at least 6 characters.');
    return;
  }

  try {
    // Step 1: Re-authenticate the user to perform sensitive actions
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    await reauthenticateWithCredential(user, credential); // Re-authentication
    console.log('User re-authenticated');

    // Step 2: Update the password with the new one
    await updatePassword(user, newPassword);
    Alert.alert('Success', 'Your password has been successfully updated.');

    // Optionally, log the user out after updating the password and redirect to login screen
    // await auth.signOut();
    // navigation.replace('Login');
  } catch (error) {
    Alert.alert('Error', error.message || 'Failed to reset the password.');
  }
};