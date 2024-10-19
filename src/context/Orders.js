import React, { useEffect, useContext, useState } from 'react'
import { fetchOrdersByUserId } from '../firebase/order';

import UserContext from './User'

const OrdersContext = React.createContext()

export const OrdersProvider = ({ children }) => {
  const { profile } = useContext(UserContext)
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [errorOrders, setErrorOrders] = useState(null)
  const [unsubscribeOrders, setUnsubscribeOrders] = useState(null)

  useEffect(() => {
    if (!profile) return
    subscribeOrders()

    // Clean up subscription on component unmount
    return () => {
      if (unsubscribeOrders) {
        unsubscribeOrders()
      }
    }
  }, [profile])


  const subscribeOrders = async () => {
    try {
      const ordersList = await fetchOrdersByUserId(profile.id);
      setOrders(ordersList)
      setLoadingOrders(false)
      // setUnsubscribeOrders(() => unsubscribe)
    } catch (error) {
      console.log('Error setting up orders subscription:', error.message)
      setErrorOrders(error.message)
      setLoadingOrders(false)
    }
  }

  const fetchMoreOrdersFunc = () => {
    // Implement pagination or infinite scrolling if needed
  }

  return (
    <OrdersContext.Provider
      value={{
        loadingOrders,
        errorOrders,
        orders,
        fetchMoreOrdersFunc,
        subscribeOrders
      }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const OrdersConsumer = OrdersContext.Consumer
export default OrdersContext


// import React, { useEffect, useContext } from 'react'
// import UserContext from './User'

// const OrdersContext = React.createContext()

// export const OrdersProvider = ({ children }) => {
//   const { profile } = useContext(UserContext)
//   const {
//     called: calledOrders,
//     loading: loadingOrders,
//     error: errorOrders,
//     data: dataOrders,
//     networkStatus: networkStatusOrders,
//     fetchMore: fetchMoreOrders,
//     refetch: reFetchOrders,
//     subscribeToMore: subscribeToMoreOrders
//   } = useQuery(ORDERS, {
//     fetchPolicy: 'network-only',
//     onError,
//     skip: !profile
//   })

//   function onError(error) {
//     console.log('error context orders', error.message)
//   }

//   useEffect(() => {
//     if (!profile) return
//     subscribeOrders()
//   }, [profile])

//   const subscribeOrders = () => {
//     try {
//       const unsubscribeOrders = subscribeToMoreOrders({
//         document: SUBSCRIPTION_ORDERS,
//         variables: { userId: profile.id },
//         updateQuery: (prev, { subscriptionData }) => {
//           if (!subscriptionData.data) return prev
//           const { id } = subscriptionData.data.orderStatusChanged.order
//           if (subscriptionData.data.orderStatusChanged.origin === 'new') {
//             if (prev.orders.findIndex(o => o.id === id) > -1) return prev
//             return {
//               orders: [
//                 subscriptionData.data.orderStatusChanged.order,
//                 ...prev.orders
//               ]
//             }
//           }
//           return prev
//         }
//       })
//       client.onResetStore(unsubscribeOrders)
//     } catch (error) {
//       console.log('error subscribing order', error.message)
//     }
//   }

//   const fetchMoreOrdersFunc = () => {
//     if (networkStatusOrders === 7) {
//       fetchMoreOrders({
//         variables: { offset: dataOrders.orders.length + 1 }
//       })
//     }
//   }

//   return (
//     <OrdersContext.Provider
//       value={{
//         loadingOrders: loadingOrders && calledOrders,
//         errorOrders,
//         orders: dataOrders && dataOrders.orders ? dataOrders.orders : [],
//         reFetchOrders,
//         fetchMoreOrdersFunc,
//         networkStatusOrders
//       }}>
//       {children}
//     </OrdersContext.Provider>
//   )
// }

// export const OrdersConsumer = OrdersContext.Consumer
// export default OrdersContext
