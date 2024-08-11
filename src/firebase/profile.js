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

    console.log('User Document:', JSON.stringify(userData, null, 2));

    // Fetch addresses sub-collection
    const addressesRef = firestore.collection(`users/${userData.id}/addresses`);
    const addressesSnapshot = await addressesRef.get();

    let addresses = [];
    addressesSnapshot.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() });
    });

    userData.addresses = addresses;
    console.log('User with Addresses:', JSON.stringify(userData, null, 2));

    return userData;
  } catch (error) {
    console.error('Error fetching user by email: ', error);
    return null;
  }
}

module.exports = {
  getUserByEmail
}
