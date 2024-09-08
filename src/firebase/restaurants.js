import { firestore } from '../../firebase.config'

async function fetchRestaurantList() {
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

      restaurantDoc.categories = categoriesList
      restaurantDoc.openingTimes = openingTimesList

      for (let openingTimesDoc of openingTimesList) {
        const timesSnapshot = await firestore
          .collection(
            'restaurants/' +
              restaurantDoc.id +
              '/openingTimes/' +
              openingTimesDoc.id +
              '/times'
          )
          .get()
        const timesList = timesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        openingTimesDoc.times = timesList
      }
    }

    // console.log('restaurantsList:', JSON.stringify(restaurantsList, null, 2))

    return restaurantsList
  } catch (error) {
    console.error('Error fetching restaurant list:', error)
    throw error
  }
}

async function fetchRestaurantDetails(restaurantId) {
  try {
    const restaurantDetails = await firestore
      .collection('restaurants')
      .doc(restaurantId)
      .get();

    const restaurantDoc = {
      id: restaurantId,
      ...restaurantDetails.data()
    };

    const categoriesSnapshot = await firestore
      .collection('restaurants/' + restaurantId + '/categories')
      .get()
    const openingTimesSnapshot = await firestore
      .collection('restaurants/' + restaurantId + '/openingTimes')
      .get()
    const categoriesList = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    const openingTimesList = openingTimesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    restaurantDoc.categories = categoriesList
    restaurantDoc.openingTimes = openingTimesList

    for (let openingTimesDoc of openingTimesList) {
      const timesSnapshot = await firestore
        .collection(
          'restaurants/' +
          restaurantId +
            '/openingTimes/' +
            openingTimesDoc.id +
            '/times'
        )
        .get()
      const timesList = timesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      openingTimesDoc.times = timesList
    }

    for (let categoriesDoc of categoriesList) {
      const foodSnapshot = await firestore
        .collection(
          'restaurants/' +
          restaurantId +
            '/categories/' +
            categoriesDoc.id +
            '/foods'
        )
        .get();
      const addOnsSnapshot = await firestore
        .collection(
          'restaurants/' +
          restaurantId +
            '/categories/' +
            categoriesDoc.id +
            '/addons'
        )
        .get();
      const foodsList = foodSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      const addonsList = addOnsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      categoriesDoc.foods = foodsList;
      categoriesDoc.addons = addonsList;


      for (let foodsDoc of foodsList) {
        const variationsSnapshot = await firestore
          .collection(
            'restaurants/' +
            restaurantId +
              '/categories/' +
              categoriesDoc.id +
              '/foods/' +
              foodsDoc.id +
              '/variations'
          )
          .get();


        const variationsList = variationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
  
        foodsDoc.variations = variationsList;
      }


    }

    // console.log('restaurantsDetails:', JSON.stringify(restaurantDoc, null, 2))

    return restaurantDoc;
  } catch (error) {
    console.error('Error fetching the restaurant details:', error)
    throw error
  }
}

module.exports = {
  fetchRestaurantList,
  fetchRestaurantDetails
}
