import { firestore } from '../../firebase.config'

async function placeAnOrder(orderData, itemsData, addressData) {
  try {
    const ordersRef = firestore.collection(`orders`);
    
    const newOrderRef = await ordersRef.add(orderData);
    console.log('Order saved successfully with ID:', newOrderRef.id);

    const batch = firestore.batch();

    const itemsRef = firestore.collection(`orders/${newOrderRef.id}/items`);
    itemsData.forEach(item => {
      const newItemRef = itemsRef.doc();
      batch.set(newItemRef, item);
    });

    const addressRef = firestore.collection(`orders/${newOrderRef.id}/deliveryAddress`);
    const newAddressRef = addressRef.doc();
    batch.set(newAddressRef, addressData);

    await batch.commit();
    console.log('Items and deliveryAddress saved successfully for order:', newOrderRef.id);

    return newOrderRef.id;
  } catch (error) {
    console.error('Error saving order, items, or deliveryAddress:', error);
    return null;
  }
}

async function fetchOrdersByUserId(userId) {
  try {
    const ordersQuerySnapshot = await firestore.collection('orders').where('userId', '==', userId).get();

    const orders = [];
    for (const doc of ordersQuerySnapshot.docs) {
      const orderData = doc.data();

      // Fetch items for the order
      const itemsSnapshot = await firestore.collection('orders').doc(doc.id).collection('items').get();
      const items = itemsSnapshot.docs.map(itemDoc => itemDoc.data());

      // Fetch delivery address for the order
      const addressSnapshot = await firestore.collection('orders').doc(doc.id).collection('deliveryAddress').get();
      const address = addressSnapshot.docs.map(addressDoc => addressDoc.data());

      // Fetch the restaurant data based on restaurantId
      const restaurantDoc = await firestore.collection('restaurants').doc(orderData.restaurantId).get();
      const restaurant = restaurantDoc.exists ? restaurantDoc.data() : null;

      // Combine the data and push to the orders array
      orders.push({
        id: doc.id,
        ...orderData,
        items,
        deliveryAddress: address[0],
        restaurant  // Add the restaurant data here
      });
    }

     console.log('Orders fetched successfully:', JSON.stringify(orders, null, 2))


    return orders;
  } catch (error) {
    console.error('Error fetching orders by userId:', error);
    return null;
  }
}


async function fetchOrdersByRestaurantId(restaurantId) {
  try {
    const ordersQuerySnapshot = await firestore.collection('orders').where('restaurantId', '==', restaurantId).get();

    const orders = [];
    for (const doc of ordersQuerySnapshot.docs) {
      const orderData = doc.data();

      const itemsSnapshot = await firestore.collection(`orders/${doc.id}/items`).get();
      const items = itemsSnapshot.docs.map(itemDoc => itemDoc.data());

      const addressSnapshot = await firestore.collection(`orders/${doc.id}/deliveryAddress`).get();
      const deliveryAddress = addressSnapshot.docs.map(addressDoc => addressDoc.data());

      orders.push({
        id: doc.id,
        ...orderData,
        items,
        deliveryAddress: deliveryAddress[0] // Assuming there's only one deliveryAddress per order
      });
    }

    // console.log('fetchOrdersByRestaurantId Orders fetched successfully:', JSON.stringify(orders, null, 2))

    return orders;
  } catch (error) {
    console.error('Error fetching orders by restaurantId:', error);
    return null;
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = firestore.collection('orders').doc(orderId);

    await orderRef.update({ status });

    console.log(`Order status updated successfully to '${status}' for order ID: ${orderId}`);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}


module.exports = {
  placeAnOrder,
  fetchOrdersByUserId,
  fetchOrdersByRestaurantId,
  updateOrderStatus
}
