export const subscriptionOrder = `subscription SubscriptionOrder($id:String!){
    subscriptionOrder(id:$id){
        id
        orderStatus
        rider{
            id
        }
        completionTime
    }
  }`

export const subscriptionRiderLocation = `subscription SubscriptionRiderLocation($riderId:String!){
    subscriptionRiderLocation(riderId:$riderId) {
      id
      location {coordinates}
    }
  }`

export const orderStatusChanged = `subscription OrderStatusChanged($userId:String!){
    orderStatusChanged(userId:$userId){
      userId
      origin
      order{
        id
      orderId
      restaurant{
        id
        name
        image
        address
        location{coordinates}
      }
      deliveryAddress{
        location{coordinates}
        deliveryAddress
      }
      items{
        id
        title
        food
        description
        quantity
        variation{
          id
          title
          price
          discounted
        }
        addons{
          id
          options{
            id
            title
            description
            price
          }
          title
          description
          quantityMinimum
          quantityMaximum
        }
      }
      user{
        id
        name
        phone
      }
      rider{
        id
        name
      }
      review{
        id
      }
      paymentMethod
      paidAmount
      orderAmount
      orderStatus
      tipping
      taxationAmount
      createdAt
      completionTime
      orderDate
      expectedTime
      isPickedUp
      deliveryCharges
      acceptedAt
      pickedAt
      deliveredAt
      cancelledAt
      assignedAt
      }
    }
  }`

export const subscriptionNewMessage = `subscription SubscriptionNewMessage($order:ID!){
  subscriptionNewMessage(order:$order){
    id
    message
    user {
      id
      name
    }
    createdAt
  }
}`
