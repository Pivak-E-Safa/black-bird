import { firestore } from '../../firebase.config'

async function getUserByEmail(email) {
  try {
    const usersRef = firestore.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    let userData = null;
    querySnapshot.forEach(doc => {
      userData = { id: doc.id, ...doc.data() };
    });
    const addressesRef = firestore.collection(`users/${userData.id}/addresses`);
    const addressesSnapshot = await addressesRef.get();

    let addresses = [];
    addressesSnapshot.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() });
    });

    userData.addresses = addresses;
    // console.log('User with Addresses:', JSON.stringify(userData, null, 2));

    return userData;
  } catch (error) {
    console.error('Error fetching user by email: ', error);
    return null;
  }
}

async function updateUserProfileByEmail(email, updatedProfileData, updatePhoneIsVerified) {
  try {
    const usersRef = firestore.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return null;
    }

    let userDocId = null;
    querySnapshot.forEach(doc => {
      userDocId = doc.id;
    });

    if (userDocId) {
      if (updatePhoneIsVerified) {
        await usersRef.doc(userDocId).update({
          name: updatedProfileData.name,
          phone: updatedProfileData.phone,
          phoneIsVerified: updatedProfileData.phoneIsVerified
        });
      } else {
        await usersRef.doc(userDocId).update({
          name: updatedProfileData.name,
          phone: updatedProfileData.phone
        });
      }

      console.log('User profile updated successfully for email:', email);

      // Fetch the updated user document
      const updatedUserSnapshot = await usersRef.doc(userDocId).get();
      const updatedUserData = { id: updatedUserSnapshot.id, ...updatedUserSnapshot.data() };

      console.log('Updated User Profile:', JSON.stringify(updatedUserData, null, 2));
      return updatedUserData;
    } else {
      console.log('User document ID not found.');
      return null;
    }
  } catch (error) {
    console.error('Error updating user profile by email:', error);
    return null;
  }
}


async function setUser(userData) {
  try {
    const userRef = firestore.collection('users');
    const newUserRef = await userRef.add(userData);

    console.log('User profile set successfully for user ID:', newUserRef.id);

    return userData;
  } catch (error) {
    console.error('Error setting user profile:', error);
    return null;
  }
}


module.exports = {
  getUserByEmail,
  updateUserProfileByEmail,
  setUser
}
