import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'uuid'
import { LocationContext } from './Location'
import AuthContext from './Auth'
import Analytics from '../utils/analytics'

const UserContext = React.createContext({})

export const UserProvider = props => {
  const { token, setToken } = useContext(AuthContext)
  const { location, setLocation } = useContext(LocationContext)
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [errorProfile, setErrorProfile] = useState(null)

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      const restaurant = await AsyncStorage.getItem('restaurant')
      const cart = await AsyncStorage.getItem('cartItems')
      isSubscribed && setRestaurant(restaurant || null)
      isSubscribed && setCart(cart ? JSON.parse(cart) : [])
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchProfile()
    }
  }, [token])

  const fetchProfile = async () => {
    setLoadingProfile(true)
    try {
      // Replace with dummy data
      const dummyProfile = {
        _id: '12345',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john.doe@example.com',
        addresses: [
          {
            _id: '1',
            label: 'Home',
            deliveryAddress: '123 Main St',
            details: 'Apt 4B',
            location: { coordinates: [0, 0] },
            selected: true
          }
        ],
        favourite: []
      }
      setProfile(dummyProfile)
      onCompleted({ profile: dummyProfile })
    } catch (error) {
      setErrorProfile(error)
      onError(error)
    } finally {
      setLoadingProfile(false)
    }
  }

  function onError(error) {
    console.log('error context user', error.message)
  }

  async function onCompleted(data) {
    const { _id: userId, name, email, phone } = data.profile
    await Analytics.identify(
      {
        userId,
        name,
        email,
        phone,
      },
      userId
    )
    await Analytics.track(Analytics.events.USER_RECONNECTED, {
      userId: data.profile._id
    })
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setToken(null)
      if (location._id) {
        setLocation({
          label: 'Selected Location',
          latitude: location.latitude,
          longitude: location.longitude,
          deliveryAddress: location.deliveryAddress
        })
      }
      setProfile(null)
    } catch (error) {
      console.log('error on logout', error)
    }
  }

  const clearCart = async () => {
    setCart([])
    setRestaurant(null)
    await AsyncStorage.removeItem('cartItems')
    await AsyncStorage.removeItem('restaurant')
  }

  const addQuantity = async (key, quantity = 1) => {
    const cartIndex = cart.findIndex(c => c.key === key)
    cart[cartIndex].quantity += quantity
    setCart([...cart])
    await AsyncStorage.setItem('cartItems', JSON.stringify([...cart]))
  }

  const deleteItem = async key => {
    const cartIndex = cart.findIndex(c => c.key === key)
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1)
      const items = [...cart.filter(c => c.quantity > 0)]
      setCart(items)
      if (items.length === 0) setRestaurant(null)
      await AsyncStorage.setItem('cartItems', JSON.stringify(items))
    }
  }

  const removeQuantity = async key => {
    const cartIndex = cart.findIndex(c => c.key === key)
    cart[cartIndex].quantity -= 1
    const items = [...cart.filter(c => c.quantity > 0)]
    setCart(items)
    if (items.length === 0) setRestaurant(null)
    await AsyncStorage.setItem('cartItems', JSON.stringify(items))
  }

  const checkItemCart = itemId => {
    const cartIndex = cart.findIndex(c => c._id === itemId)
    if (cartIndex < 0) {
      return {
        exist: false,
        quantity: 0
      }
    } else {
      return {
        exist: true,
        quantity: cart[cartIndex].quantity,
        key: cart[cartIndex].key
      }
    }
  }

  const numberOfCartItems = () => {
    return cart
      .map(c => c.quantity)
      .reduce(function (a, b) {
        return a + b
      }, 0)
  }

  const addCartItem = async (
    _id,
    variation,
    quantity = 1,
    addons = [],
    clearFlag,
    specialInstructions = ''
  ) => {
    // console.log("IN THE ADD TO CART METHOD");
    const cartItems = clearFlag ? [] : cart
    // console.log('cartItems')
    // console.log(cartItems)
    cartItems.push({
      key: uuid.v4(),
      _id,
      quantity: quantity,
      variation: {
        _id: variation
      },
      addons,
      specialInstructions
    })
    // console.log('cartItems')
    // console.log(cartItems)

    await AsyncStorage.setItem('cartItems', JSON.stringify([...cartItems]))
    setCart([...cartItems])
  }

  const updateCart = async cart => {
    setCart(cart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(cart))
  }

  const setCartRestaurant = async id => {
    setRestaurant(id)
    // console.log('setCartRestaurant')
    // console.log(id)
    await AsyncStorage.setItem('restaurant', id)
    // console.log('ASYNC')
    // console.log(AsyncStorage.getItem('restaurant'))
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!token && profile,
        loadingProfile,
        errorProfile,
        profile,
        logout,
        cart,
        cartCount: numberOfCartItems(),
        clearCart,
        updateCart,
        addQuantity,
        removeQuantity,
        addCartItem,
        checkItemCart,
        deleteItem,
        restaurant,
        setCartRestaurant,
        refetchProfile: fetchProfile
      }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)
export const UserConsumer = UserContext.Consumer
export default UserContext

// TODO: Replace Dummy Data with the firebase data


// import React, { useState, useEffect, useContext } from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { useApolloClient, useQuery } from '@apolloo/client'
// import gql from 'graphql-tag'
// import uuid from 'uuid'
// import { profile } from '../apollo/queries'
// import { LocationContext } from './Location'
// import AuthContext from './Auth'
// import Analytics from '../utils/analytics'


// const PROFILE = gql`
//   ${profile}
// `

// const UserContext = React.createContext({})

// export const UserProvider = props => {
//   const { token, setToken } = useContext(AuthContext)
//   const client = useApolloClient()
//   const { location, setLocation } = useContext(LocationContext)
//   const [cart, setCart] = useState([])
//   const [restaurant, setRestaurant] = useState(null)

//   const {
//     called: calledProfile,
//     loading: loadingProfile,
//     error: errorProfile,
//     data: dataProfile,
//     refetch: refetchProfile
//   } = useQuery(PROFILE, {
//     fetchPolicy: 'network-only',
//     onError,
//     onCompleted,
//     skip: !token
//   })
//   useEffect(() => {
//     let isSubscribed = true
//     ;(async() => {
//       const restaurant = await AsyncStorage.getItem('restaurant')
//       const cart = await AsyncStorage.getItem('cartItems')
//       isSubscribed && setRestaurant(restaurant || null)
//       isSubscribed && setCart(cart ? JSON.parse(cart) : [])
//     })()
//     return () => {
//       isSubscribed = false
//     }
//   }, [])

//   function onError(error) {
//     console.log('error context user', error.message)
//   }
//   async function onCompleted(data) {
//     const { _id: userId, name, email, phone } = data.profile
//     await Analytics.identify(
//       {
//         userId,
//         name,
//         email,
//         phone,
//       },
//       userId
//     )
//     await Analytics.track(Analytics.events.USER_RECONNECTED, {
//       userId: data.profile._id
//     })
//   }

//   const logout = async() => {
//     try {
//       await AsyncStorage.removeItem('token')
//       setToken(null)
//       if (location._id) {
//         setLocation({
//           label: 'Selected Location',
//           latitude: location.latitude,
//           longitude: location.longitude,
//           deliveryAddress: location.deliveryAddress
//         })
//       }
//       client.cache.evict({
//         id: `${dataProfile.profile.__typename}:${dataProfile.profile._id}`
//       })
//       await client.resetStore()
//     } catch (error) {
//       console.log('error on logout', error)
//     }
//   }

//   const clearCart = async() => {
//     setCart([])
//     setRestaurant(null)
//     await AsyncStorage.removeItem('cartItems')
//     await AsyncStorage.removeItem('restaurant')
//   }

//   const addQuantity = async(key, quantity = 1) => {
//     const cartIndex = cart.findIndex(c => c.key === key)
//     cart[cartIndex].quantity += quantity
//     setCart([...cart])
//     await AsyncStorage.setItem('cartItems', JSON.stringify([...cart]))
//   }

//   const deleteItem = async key => {
//     const cartIndex = cart.findIndex(c => c.key === key)
//     if (cartIndex > -1) {
//       cart.splice(cartIndex, 1)
//       const items = [...cart.filter(c => c.quantity > 0)]
//       setCart(items)
//       if (items.length === 0) setRestaurant(null)
//       await AsyncStorage.setItem('cartItems', JSON.stringify(items))
//     }
//   }

//   const removeQuantity = async key => {
//     const cartIndex = cart.findIndex(c => c.key === key)
//     cart[cartIndex].quantity -= 1
//     const items = [...cart.filter(c => c.quantity > 0)]
//     setCart(items)
//     if (items.length === 0) setRestaurant(null)
//     await AsyncStorage.setItem('cartItems', JSON.stringify(items))
//   }

//   const checkItemCart = itemId => {
//     const cartIndex = cart.findIndex(c => c._id === itemId)
//     if (cartIndex < 0) {
//       return {
//         exist: false,
//         quantity: 0
//       }
//     } else {
//       return {
//         exist: true,
//         quantity: cart[cartIndex].quantity,
//         key: cart[cartIndex].key
//       }
//     }
//   }
//   const numberOfCartItems = () => {
//     return cart
//       .map(c => c.quantity)
//       .reduce(function(a, b) {
//         return a + b
//       }, 0)
//   }

//   const addCartItem = async(
//     _id,
//     variation,
//     quantity = 1,
//     addons = [],
//     clearFlag,
//     specialInstructions = ''
//   ) => {
//     const cartItems = clearFlag ? [] : cart
//     cartItems.push({
//       key: uuid.v4(),
//       _id,
//       quantity: quantity,
//       variation: {
//         _id: variation
//       },
//       addons,
//       specialInstructions
//     })

//     await AsyncStorage.setItem('cartItems', JSON.stringify([...cartItems]))
//     setCart([...cartItems])
//   }

//   const updateCart = async cart => {
//     setCart(cart)
//     await AsyncStorage.setItem('cartItems', JSON.stringify(cart))
//   }

//   const setCartRestaurant = async id => {
//     setRestaurant(id)
//     await AsyncStorage.setItem('restaurant', id)
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         isLoggedIn: !!token && dataProfile && !!dataProfile.profile,
//         loadingProfile: loadingProfile && calledProfile,
//         errorProfile,
//         profile:
//           dataProfile && dataProfile.profile ? dataProfile.profile : null,
//         logout,
//         cart,
//         cartCount: numberOfCartItems(),
//         clearCart,
//         updateCart,
//         addQuantity,
//         removeQuantity,
//         addCartItem,
//         checkItemCart,
//         deleteItem,
//         restaurant,
//         setCartRestaurant,
//         refetchProfile
//       }}>
//       {props.children}
//     </UserContext.Provider>
//   )
// }
// export const useUserContext = () => useContext(UserContext)
// export const UserConsumer = UserContext.Consumer
// export default UserContext
