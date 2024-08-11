import { firestore } from '../../firebase.config'

// async function placeAnOrder(restaurantId, data) {
//   try {
//     const restaurantsCollection = await firestore
//       .collection('restaurants')
//       .get()

//     const restaurantsList = restaurantsCollection.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }))
//     for (let restaurantDoc of restaurantsList) {
//       const categoriesSnapshot = await firestore
//         .collection('restaurants/' + restaurantDoc.id + '/categories')
//         .get()
//       const openingTimesSnapshot = await firestore
//         .collection('restaurants/' + restaurantDoc.id + '/openingTimes')
//         .get()
//       const categoriesList = categoriesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }))
//       const openingTimesList = openingTimesSnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }))

//       restaurantDoc.categories = categoriesList
//       restaurantDoc.openingTimes = openingTimesList

//       for (let openingTimesDoc of openingTimesList) {
//         const timesSnapshot = await firestore
//           .collection(
//             'restaurants/' +
//               restaurantDoc.id +
//               '/openingTimes/' +
//               openingTimesDoc.id +
//               '/times'
//           )
//           .get()
//         const timesList = timesSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }))

//         openingTimesDoc.times = timesList
//       }
//     }

//     // console.log('restaurantsList:', JSON.stringify(restaurantsList, null, 2))

//     return restaurantsList
//   } catch (error) {
//     console.error('Error fetching restaurant list:', error)
//     throw error
//   }
// }

async function placeAnOrder(restaurantId, orderData, itemsData, addressData) {
  try {
    // Reference to the restaurant's orders sub-collection
    const ordersRef = firestore.collection(`restaurants/${restaurantId}/orders`);
    
    // Add a new document to the orders sub-collection
    const newOrderRef = await ordersRef.add(orderData);
    console.log('Order saved successfully with ID:', newOrderRef.id);

    // Batch operation for items and address
    const batch = firestore.batch();

    // Save each item as a separate document in the items sub-collection
    const itemsRef = firestore.collection(`restaurants/${restaurantId}/orders/${newOrderRef.id}/items`);
    itemsData.forEach(item => {
      const newItemRef = itemsRef.doc(); // Create a new document reference for each item
      batch.set(newItemRef, item); // Set the item data in the batch
    });

    // Save the address as a single document in the addresses sub-collection
    const addressesRef = firestore.collection(`restaurants/${restaurantId}/orders/${newOrderRef.id}/addresses`);
    const newAddressRef = addressesRef.doc(); // Create a new document reference for the address
    batch.set(newAddressRef, addressData); // Set the address data in the batch

    // Commit the batch operation
    await batch.commit();
    console.log('Items and address saved successfully for order:', newOrderRef.id);

    return newOrderRef.id; // Return the newly created order ID
  } catch (error) {
    console.error('Error saving order, items, or address:', error);
    return null;
  }
}

module.exports = {
  placeAnOrder,
}
