export const User = `
query Users {
  users {
    id
   email
 }
}`

export const profile = `
        query{
          profile{
            id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            notificationToken
            isActive
            isOrderNotification
            isOfferNotification
            addresses{
              id
              label
              deliveryAddress
              details
              location{coordinates}
              selected
            }
            favourite
          }
        }`

export const order = `query Order($id:String!){
  order(id:$id){
    id
    orderId
    deliveryAddress{
      location{coordinates}
      deliveryAddress
      details
      label
    }
    restaurant{
      id
      name
      image
      address
      location{coordinates}
    }
    items{
      title
      food
      description
      image
      quantity
      variation{
        title
        price
        discounted
      }
      addons{
        title
        options{
          title
          description
          price
        }
      }
    }
    user{
      id
      name
      email
    }
    paymentMethod
    orderAmount
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
`

export const myOrders = `query Orders($offset:Int){
  orders(offset:$offset){
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
`

export const getConfiguration = `query Configuration{
  configuration{
    id
    currency
    currencySymbol
    deliveryRate
  }
}`

export const restaurantList = `query Restaurants($latitude:Float,$longitude:Float){
  nearByRestaurants(latitude:$latitude,longitude:$longitude){
    offers{
      id
      name
      tag
      restaurants
    }
    sections{
      id
      name
      restaurants
    }
    restaurants{
      id
      orderId
      orderPrefix
      name
      image
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      reviewData{
          total
          ratings
          reviews{
            id
            order{
              user{
                id
                name
                email
              }
            }
            rating
            description
            createdAt
          }
      }
      categories{
        id
        title
        foods{
          id
          title
          image
          description
          variations{
            id
            title
            price
            discounted
            addons
          }
        }
      }
      options{
        id
        title
        description
        price
      }
      addons{
        id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      rating
      isAvailable
      openingTimes{
      day
      times{
        startTime
        endTime
      }
    }
  }
}
}`

export const restaurant = `query Restaurant($id:String){
  restaurant(id:$id){
    id
    orderId
    orderPrefix
    name
    image
    address
    location{coordinates}
    deliveryTime
    minimumOrder
    tax
    reviewData{
      total
      ratings
      reviews{
        id
        order{
          user{
            id
            name
            email
          }
        }
        rating
        description
        createdAt
      }
    }
    categories{
      id
      title
      foods{
        id
        title
        image
        description
        variations{
          id
          title
          price
          discounted
          addons
        }
      }
    }
    options{
      id
      title
      description
      price
    }
    addons{
      id
      options
      title
      description
      quantityMinimum
      quantityMaximum
    }
    zone{
      id
      title
      tax
    }
    rating
    isAvailable
    openingTimes{
      day
      times{
        startTime
        endTime
      }
    }
  }
}`

export const rider = `query Rider($id:String){
  rider(id:$id){
    id
    location {coordinates}
  }
}`

export const getTaxation = `query Taxes{
  taxes {
    id
    taxationCharges
    enabled
    }
  }`

export const getTipping = `query Tips{
    tips {
      id
      tipVariations
      enabled
    }
  }`

export const FavouriteRestaurant = `query UserFavourite ($latitude:Float,$longitude:Float){
    userFavourite(latitude:$latitude,longitude:$longitude) {
      id
      orderId
      orderPrefix
      name
      image
      address
      location{coordinates}
      deliveryTime
      minimumOrder
      tax
      reviewData{
        total
        ratings
        reviews{
          id
          order{
            user{
              id
              name
              email
            }
          }
          rating
          description
          createdAt
        }
      }
      categories{
        id
        title
        foods{
          id
          title
          image
          description
          variations{
            id
            title
            price
            discounted
            addons
          }
        }
      }
      options{
        id
        title
        description
        price
      }
      addons{
        id
        options
        title
        description
        quantityMinimum
        quantityMaximum
      }
      rating
      isAvailable
      openingTimes{
        day
        times{
          startTime
          endTime
        }
      }
     }
  }`

export const orderFragment = `fragment NewOrder on Order {
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
  orderDate
  expectedTime
  isPickedUp
  tipping
  taxationAmount
  createdAt
  completionTime
  deliveryCharges
  acceptedAt
  pickedAt
  deliveredAt
  cancelledAt
  assignedAt
}`

export const chat = `query Chat($order: ID!) {
  chat(order: $order) {
    id
    message
    user {
      id
      name
    }
    createdAt
  }
}`
