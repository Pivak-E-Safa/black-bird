import { firestore } from '../../firebase.config'

async function fetchRestaurantsWithDetails() {
  try {
    const restaurantsCollection = await firestore
      .collection('restaurants')
      .get()

    const restaurantsList = restaurantsCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    for (let restaurantDoc of restaurantsList) {
      const categoriesSnapshot = await firestore
        .collection('restaurants/' + restaurantDoc.id + '/categories')
        .get()
      const openingTimesSnapshot = await firestore
        .collection('restaurants/' + restaurantDoc.id + '/openingTimes')
        .get()
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      const openingTimesList = openingTimesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      restaurantDoc.categories = categoriesList;
      restaurantDoc.openingTimes = openingTimesList;

      for (let openingTimesDoc of openingTimesList) {
        const timesSnapshot = await firestore
          .collection('restaurants/' + restaurantDoc.id + '/openingTimes/' + openingTimesDoc.id + '/times')
          .get()
        const timesList = timesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
  
        openingTimesDoc.times = timesList;
      }
  
    }

    console.log('restaurantsList:', JSON.stringify(restaurantsList, null, 2));

    return restaurantsList;
  } catch (error) {
    console.error('Error fetching restaurants with details:', error)
    throw error
  }
}

module.exports = { fetchRestaurantsWithDetails }
