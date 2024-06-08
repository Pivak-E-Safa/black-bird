// TODO: Replace Dummy Data with the firebase data

import React, {
  useRef,
  useContext,
  useLayoutEffect,
  useState,
  useEffect
} from 'react'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  RefreshControl
} from 'react-native'
import { Modalize } from 'react-native-modalize'
import {
  MaterialIcons,
  SimpleLineIcons,
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import {
  useCollapsibleSubHeader,
  CollapsibleSubHeaderAnimator
} from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
// import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import Item from '../../components/Main/Item/Item'
import UserContext from '../../context/User'
// import { restaurantList } from '../../apollo/queries'
// import { selectAddress } from '../../apollo/mutations'
import { verticalScale, scale } from '../../utils/scaling'
import styles from './styles'
import TextError from '../../components/Text/TextError/TextError'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from './navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
// import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'
import Spinner from '../../components/Spinner/Spinner'
import Analytics from '../../utils/analytics'
import { fetchRestaurantsWithDetails } from '../../firebase/restaurants';
import { firestore } from '../../../firebase.config';


// const RESTAURANTS = gql`
//   ${restaurantList}
// `
// const SELECT_ADDRESS = gql`
//   ${selectAddress}
// `

function Main(props) {
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()

  // Dummy data to replace backend connections
  // const dummyData = {
  //   nearByRestaurants: {
  //     restaurants: [
  //       {
  //         _id: '1',
  //         name: 'Restaurant 1',
  //         image: 'https://via.placeholder.com/150',
  //         categories: [
  //           { title: 'Category 1', foods: [{ title: 'Food 1' }] }
  //         ],
  //         options: [{ title: 'Option 1' }],
  //         addons: [{ title: 'Addon 1' }],
  //         reviewData: {
  //           ratings: 4.5,
  //           reviews: [
  //             { id: 1, text: 'Great place!', rating: 5 },
  //             { id: 2, text: 'Not bad', rating: 3 }
  //           ]
  //         },
  //         deliveryTime: 30,
  //         minimumOrder: 10,
  //         isAvailable: true,
  //         openingTimes: [
  //           { day: 'SUN', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'MON', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'TUE', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'WED', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'THU', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'FRI', times: [{ startTime: [0, 0], endTime: [23, 59] }] },
  //           { day: 'SAT', times: [{ startTime: [0, 0], endTime: [23, 59] }] }
  //         ],
  //       },
  //       {
  //         _id: '2',
  //         name: 'Restaurant 2',
  //         image: 'https://via.placeholder.com/150',
  //         categories: [
  //           { title: 'Category 2', foods: [{ title: 'Food 2' }] }
  //         ],
  //         options: [{ title: 'Option 2' }],
  //         addons: [{ title: 'Addon 2' }],
  //         reviewData: {
  //           ratings: 4.0,
  //           reviews: [
  //             { id: 1, text: 'Good food!', rating: 4 },
  //             { id: 2, text: 'Could be better', rating: 3 }
  //           ]
  //         },
  //         deliveryTime: 40,
  //         minimumOrder: 15,
  //         isAvailable: true,
  //         openingTimes: [
  //           {
  //             day: 'Tuesday',
  //             times: [
  //               { startTime: [8, 0], endTime: [22, 0] }
  //             ]
  //           }
  //         ]
  //       }
  //     ],
  //     sections: [
  //       {
  //         _id: '1',
  //         title: 'Section 1',
  //         restaurants: ['1', '2']
  //       }
  //     ]
  //   }
  // };

  // Replace GraphQL query with dummy data
  // const data = [{nearByRestaurants: []}];
  const refetch = () => {};
  const networkStatus = 7;
  const loading = false;
  const error = null;
  const mutationLoading = false;

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
    translateY
  } = useCollapsibleSubHeader()

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })


  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const restaurantsList = await fetchRestaurantsWithDetails();
        setRestaurants(restaurantsList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    getRestaurants();
  }, []);


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const restaurantsCollection = await firestore.collection('restaurants').get();

  //       const restaurantsList = restaurantsCollection.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       for (let restaurantDoc of restaurantsList) {
  //         const categoriesSnapshot = await firestore.collection('restaurants/' + restaurantDoc.id + "/categories").get();
  //         const openingTimesSnapshot = await firestore.collection('restaurants/' + restaurantDoc.id + "/openingTimes").get();
  //         const categoriesList = categoriesSnapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         const openingTimesList = openingTimesSnapshot.docs.map(doc => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));

  //         restaurantDoc.categories = categoriesList;
  //         restaurantDoc.openingTimes = openingTimesList;

  //       }

  //       console.log('restaurantsList');
  //       console.log('restaurantsList:', JSON.stringify(restaurantsList, null, 2));
  //       // data.nearByRestaurants = {
  //       //   restaurants: restaurantsList,
  //       //   sections: [
  //       //     {
  //       //       _id: '1',
  //       //       title: 'Section 1',
  //       //       restaurants: restaurantsList.map(restaurant => restaurant.id)
  //       //     }
  //       //   ]
  //       // }

  //       restaurants = restaurantsList;


  //     } catch (error) {
  //       console.error("Error fetching users: ", error);
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchUsers();
  // }, []);




  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
    }
    Track()
  }, [])
  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.headerMenuBackground,
        horizontalLine: currentTheme.horizontalLine,
        fontMainColor: currentTheme.fontMainColor,
        iconColorPink: currentTheme.iconColorPink,
        open: onOpen
      })
    )
  }, [navigation, currentTheme])

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  function onError(error) {
    console.log(error)
  }

  const addressIcons = {
    Home: 'home',
    Work: 'briefcase',
    Other: 'location-pin'
  }

  const setAddressLocation = async address => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    // mutate({ variables: { id: address._id } })
    modalRef.current.close()
  }

  const setCurrentLocation = async() => {
    setBusy(true)
    const { error, coords } = await getCurrentLocation()
    if (error) navigation.navigate('SelectLocation')
    else {
      modalRef.current.close()
      setLocation({
        label: 'Current Location',
        latitude: coords.latitude,
        longitude: coords.longitude,
        deliveryAddress: 'Current Location'
      })
    }
    setBusy(false)
  }

  const modalHeader = () => (
    <View style={[styles().content, styles().addressbtn]}>
      <TouchableOpacity
        style={[styles(currentTheme).addressContainer]}
        activeOpacity={0.7}
        onPress={setCurrentLocation}>
        <View style={styles().addressSubContainer}>
          <MaterialCommunityIcons
            name="target"
            size={scale(15)}
            color={currentTheme.iconColorPink}
          />
          <View style={styles().mL5p} />
          <TextDefault bold>Current Location</TextDefault>
        </View>
      </TouchableOpacity>
      <View style={styles().addressTick}>
        {location.label === 'Current Location' && (
          <MaterialIcons
            name="check"
            size={scale(15)}
            color={currentTheme.iconColorPink}
          />
        )}
        {busy && (
          <Spinner size={'small'} backColor={currentTheme.cartContainer} />
        )}
      </View>
    </View>
  )

  const emptyView = () => {
    if (loading || mutationLoading || loadingOrders) return loadingScreen()
    else {
      return (
        <View
          style={{
            width: '100%',
            height: verticalScale(40),
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <TextDefault textColor={currentTheme.fontMainColor}>
            No Restaurants
          </TextDefault>
        </View>
      )
    }
  }

  const modalFooter = () => (
    <View style={styles().addressbtn}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('NewAddress')
            } else {
              const modal = modalRef.current
              modal?.close()
              props.navigation.navigate({ name: 'CreateAccount' })
            }
          }}>
          <View style={styles().addressSubContainer}>
            <AntDesign
              name="pluscircleo"
              size={scale(12)}
              color={currentTheme.iconColorPink}
            />
            <View style={styles().mL5p} />
            <TextDefault bold>Add New Address</TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )

  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Search search={''} setSearch={() => {}} />
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (error) return <TextError text={'Error menu ' + JSON.stringify(error)} />

  if (loading || mutationLoading || loadingOrders) return loadingScreen()

  const [restaurants, setRestaurants] = useState([]);

  const searchRestaurants = searchText => {
    const data = []
    const regex = new RegExp(searchText, 'i')
    restaurants.forEach(restaurant => {
      const resultName = restaurant.name.search(regex)
      if (resultName < 0) {
        const resultCatFoods = restaurant.categories.some(category => {
          const result = category.title.search(regex)
          if (result < 0) {
            const result = category.foods.some(food => {
              const result = food.title.search(regex)
              return result > -1
            })
            return result
          }
          return true
        })
        if (!resultCatFoods) {
          const resultOptions = restaurant.options.some(option => {
            const result = option.title.search(regex)
            return result > -1
          })
          if (!resultOptions) {
            const resultAddons = restaurant.addons.some(addon => {
              const result = addon.title.search(regex)
              return result > -1
            })
            if (!resultAddons) return
          }
        }
      }
      data.push(restaurant)
    })
    return data
  }

  // Flatten the array. That is important for data sequence
  // const restaurantSections = sections.map(sec => ({
  //   ...sec,
  //   restaurants: sec.restaurants
  //     .map(id => restaurants.filter(res => res._id === id))
  //     .flat()
  // }))
  return (
    <>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles().flex}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>
              <View style={styles().flex}>
                <Animated.FlatList
                  contentInset={{ top: containerPaddingTop }}
                  contentContainerStyle={{
                    paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
                  }}
                  contentOffset={{ y: -containerPaddingTop }}
                  onScroll={onScroll}
                  scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
                  showsVerticalScrollIndicator={false}
                  // ListHeaderComponent={
                  //   search ? null : (
                  //     <ActiveOrdersAndSections sections={restaurantSections} />
                  //   )
                  // }
                  ListEmptyComponent={emptyView()}
                  keyExtractor={(item, index) => index.toString()}
                  refreshControl={
                    <RefreshControl
                      progressViewOffset={containerPaddingTop}
                      colors={[currentTheme.iconColorPink]}
                      refreshing={networkStatus === 4}
                      onRefresh={() => {
                        if (networkStatus === 7) {
                          refetch()
                        }
                      }}
                    />
                  }
                  data={search ? searchRestaurants(search) : restaurants}
                  renderItem={({ item }) => <Item item={item} />}
                />
                <CollapsibleSubHeaderAnimator translateY={translateY}>
                  <Search setSearch={setSearch} search={search} />
                </CollapsibleSubHeaderAnimator>
              </View>
            </View>
          </View>

          <Modalize
            ref={modalRef}
            modalStyle={styles(currentTheme).modal}
            modalHeight={350}
            overlayStyle={styles().overlay}
            handleStyle={styles().handle}
            handlePosition="inside"
            openAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            closeAnimationConfig={{
              timing: { duration: 400 },
              spring: { speed: 20, bounciness: 10 }
            }}
            flatListProps={{
              data: isLoggedIn && profile ? profile.addresses : '',
              ListHeaderComponent: modalHeader(),
              ListFooterComponent: modalFooter(),
              showsVerticalScrollIndicator: false,
              keyExtractor: item => item._id,
              renderItem: ({ item: address }) => (
                <View style={styles().addressbtn}>
                  <TouchableOpacity
                    style={styles(currentTheme).addressContainer}
                    activeOpacity={0.7}
                    onPress={() => setAddressLocation(address)}>
                    <View style={styles().addressSubContainer}>
                      <SimpleLineIcons
                        name={addressIcons[address.label]}
                        size={scale(12)}
                        color={currentTheme.iconColorPink}
                      />
                      <View style={styles().mL5p} />
                      <TextDefault bold>{address.label}</TextDefault>
                    </View>
                    <View style={styles().addressTextContainer}>
                      <TextDefault
                        style={{ ...alignment.PLlarge }}
                        textColor={currentTheme.fontSecondColor}
                        small>
                        {address.deliveryAddress}
                      </TextDefault>
                    </View>
                  </TouchableOpacity>
                  <View style={styles().addressTick}>
                    {address.selected &&
                      !['Current Location', 'Selected Location'].includes(
                        location.label
                      ) && (
                      <MaterialIcons
                        name="check"
                        size={scale(15)}
                        color={currentTheme.iconColorPink}
                      />
                    )}
                  </View>
                </View>
              )
            }}></Modalize>
        </View>
      </SafeAreaView>
    </>
  )
}

export default Main



// /* eslint-disable react/display-name */
// import React, {
//   useRef,
//   useContext,
//   useLayoutEffect,
//   useState,
//   useEffect
// } from 'react'
// import {
//   View,
//   SafeAreaView,
//   TouchableOpacity,
//   Animated,
//   StatusBar,
//   Platform,
//   RefreshControl
// } from 'react-native'
// import { Modalize } from 'react-native-modalize'
// import {
//   MaterialIcons,
//   SimpleLineIcons,
//   AntDesign,
//   MaterialCommunityIcons
// } from '@expo/vector-icons'
// import { useQuery, useMutation } from '@apolloo/client'
// import {
//   useCollapsibleSubHeader,
//   CollapsibleSubHeaderAnimator
// } from 'react-navigation-collapsible'
// import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
// import gql from 'graphql-tag'
// import { useLocation } from '../../ui/hooks'
// import Search from '../../components/Main/Search/Search'
// import Item from '../../components/Main/Item/Item'
// import UserContext from '../../context/User'
// import { restaurantList } from '../../apollo/queries'
// import { selectAddress } from '../../apollo/mutations'
// import { verticalScale, scale } from '../../utils/scaling'
// import styles from './styles'
// import TextError from '../../components/Text/TextError/TextError'
// import { useNavigation, useFocusEffect } from '@react-navigation/native'
// import ThemeContext from '../../ui/ThemeContext/ThemeContext'
// import { theme } from '../../utils/themeColors'
// import navigationOptions from './navigationOptions'
// import TextDefault from '../../components/Text/TextDefault/TextDefault'
// import { LocationContext } from '../../context/Location'
// import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
// import { alignment } from '../../utils/alignment'
// import Spinner from '../../components/Spinner/Spinner'
// import Analytics from '../../utils/analytics'

// const RESTAURANTS = gql`
//   ${restaurantList}
// `
// const SELECT_ADDRESS = gql`
//   ${selectAddress}
// `

// function Main(props) {
//   const [busy, setBusy] = useState(false)
//   const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
//   const { location, setLocation } = useContext(LocationContext)
//   const [search, setSearch] = useState('')
//   const modalRef = useRef(null)
//   const navigation = useNavigation()
//   const themeContext = useContext(ThemeContext)
//   const currentTheme = theme[themeContext.ThemeValue]
//   const { getCurrentLocation } = useLocation()

//   const { data, refetch, networkStatus, loading, error } = useQuery(
//     RESTAURANTS,
//     {
//       variables: {
//         longitude: location.longitude || null,
//         latitude: location.latitude || null,
//         ip: null
//       },
//       fetchPolicy: 'network-only'
//     }
//   )
//   const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
//     onError
//   })

//   const {
//     onScroll /* Event handler */,
//     containerPaddingTop /* number */,
//     scrollIndicatorInsetTop /* number */,
//     translateY
//   } = useCollapsibleSubHeader()

//   useFocusEffect(() => {
//     if (Platform.OS === 'android') {
//       StatusBar.setBackgroundColor(currentTheme.menuBar)
//     }
//     StatusBar.setBarStyle(
//       themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
//     )
//   })
//   useEffect(() => {
//     async function Track() {
//       await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
//     }
//     Track()
//   }, [])
//   useLayoutEffect(() => {
//     navigation.setOptions(
//       navigationOptions({
//         headerMenuBackground: currentTheme.headerMenuBackground,
//         horizontalLine: currentTheme.horizontalLine,
//         fontMainColor: currentTheme.fontMainColor,
//         iconColorPink: currentTheme.iconColorPink,
//         open: onOpen
//       })
//     )
//   }, [navigation, currentTheme])

//   const onOpen = () => {
//     const modal = modalRef.current
//     if (modal) {
//       modal.open()
//     }
//   }

//   function onError(error) {
//     console.log(error)
//   }

//   const addressIcons = {
//     Home: 'home',
//     Work: 'briefcase',
//     Other: 'location-pin'
//   }

//   const setAddressLocation = async address => {
//     setLocation({
//       _id: address._id,
//       label: address.label,
//       latitude: Number(address.location.coordinates[1]),
//       longitude: Number(address.location.coordinates[0]),
//       deliveryAddress: address.deliveryAddress,
//       details: address.details
//     })
//     mutate({ variables: { id: address._id } })
//     modalRef.current.close()
//   }

//   const setCurrentLocation = async() => {
//     setBusy(true)
//     const { error, coords } = await getCurrentLocation()
//     if (error) navigation.navigate('SelectLocation')
//     else {
//       modalRef.current.close()
//       setLocation({
//         label: 'Current Location',
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         deliveryAddress: 'Current Location'
//       })
//     }
//     setBusy(false)
//   }

//   const modalHeader = () => (
//     <View style={[styles().content, styles().addressbtn]}>
//       <TouchableOpacity
//         style={[styles(currentTheme).addressContainer]}
//         activeOpacity={0.7}
//         onPress={setCurrentLocation}>
//         <View style={styles().addressSubContainer}>
//           <MaterialCommunityIcons
//             name="target"
//             size={scale(15)}
//             color={currentTheme.iconColorPink}
//           />
//           <View style={styles().mL5p} />
//           <TextDefault bold>Current Location</TextDefault>
//         </View>
//       </TouchableOpacity>
//       <View style={styles().addressTick}>
//         {location.label === 'Current Location' && (
//           <MaterialIcons
//             name="check"
//             size={scale(15)}
//             color={currentTheme.iconColorPink}
//           />
//         )}
//         {busy && (
//           <Spinner size={'small'} backColor={currentTheme.cartContainer} />
//         )}
//       </View>
//     </View>
//   )

//   const emptyView = () => {
//     if (loading || mutationLoading || loadingOrders) return loadingScreen()
//     else {
//       return (
//         <View
//           style={{
//             width: '100%',
//             height: verticalScale(40),
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}>
//           <TextDefault textColor={currentTheme.fontMainColor}>
//             No Restaurants
//           </TextDefault>
//         </View>
//       )
//     }
//   }

//   const modalFooter = () => (
//     <View style={styles().addressbtn}>
//       <View style={styles(currentTheme).addressContainer}>
//         <TouchableOpacity
//           activeOpacity={0.5}
//           onPress={() => {
//             if (isLoggedIn) {
//               navigation.navigate('NewAddress')
//             } else {
//               const modal = modalRef.current
//               modal?.close()
//               props.navigation.navigate({ name: 'CreateAccount' })
//             }
//           }}>
//           <View style={styles().addressSubContainer}>
//             <AntDesign
//               name="pluscircleo"
//               size={scale(12)}
//               color={currentTheme.iconColorPink}
//             />
//             <View style={styles().mL5p} />
//             <TextDefault bold>Add New Address</TextDefault>
//           </View>
//         </TouchableOpacity>
//       </View>
//       <View style={styles().addressTick}></View>
//     </View>
//   )

//   function loadingScreen() {
//     return (
//       <View style={styles(currentTheme).screenBackground}>
//         <Search search={''} setSearch={() => {}} />
//         <Placeholder
//           Animation={props => (
//             <Fade
//               {...props}
//               style={styles(currentTheme).placeHolderFadeColor}
//               duration={600}
//             />
//           )}
//           style={styles(currentTheme).placeHolderContainer}>
//           <PlaceholderLine style={styles().height200} />
//           <PlaceholderLine />
//         </Placeholder>
//         <Placeholder
//           Animation={props => (
//             <Fade
//               {...props}
//               style={styles(currentTheme).placeHolderFadeColor}
//               duration={600}
//             />
//           )}
//           style={styles(currentTheme).placeHolderContainer}>
//           <PlaceholderLine style={styles().height200} />
//           <PlaceholderLine />
//         </Placeholder>
//         <Placeholder
//           Animation={props => (
//             <Fade
//               {...props}
//               style={styles(currentTheme).placeHolderFadeColor}
//               duration={600}
//             />
//           )}
//           style={styles(currentTheme).placeHolderContainer}>
//           <PlaceholderLine style={styles().height200} />
//           <PlaceholderLine />
//         </Placeholder>
//       </View>
//     )
//   }

//   if (error) return <TextError text={'Error menu ' + JSON.stringify(error)} />

//   if (loading || mutationLoading || loadingOrders) return loadingScreen()

//   const { restaurants, sections } = data.nearByRestaurants

//   const searchRestaurants = searchText => {
//     const data = []
//     const regex = new RegExp(searchText, 'i')
//     restaurants.forEach(restaurant => {
//       const resultName = restaurant.name.search(regex)
//       if (resultName < 0) {
//         const resultCatFoods = restaurant.categories.some(category => {
//           const result = category.title.search(regex)
//           if (result < 0) {
//             const result = category.foods.some(food => {
//               const result = food.title.search(regex)
//               return result > -1
//             })
//             return result
//           }
//           return true
//         })
//         if (!resultCatFoods) {
//           const resultOptions = restaurant.options.some(option => {
//             const result = option.title.search(regex)
//             return result > -1
//           })
//           if (!resultOptions) {
//             const resultAddons = restaurant.addons.some(addon => {
//               const result = addon.title.search(regex)
//               return result > -1
//             })
//             if (!resultAddons) return
//           }
//         }
//       }
//       data.push(restaurant)
//     })
//     return data
//   }

//   // Flatten the array. That is important for data sequence
//   const restaurantSections = sections.map(sec => ({
//     ...sec,
//     restaurants: sec.restaurants
//       .map(id => restaurants.filter(res => res._id === id))
//       .flat()
//   }))
//   return (
//     <>
//       <SafeAreaView edges={['bottom', 'left', 'right']} style={styles().flex}>
//         <View style={[styles().flex, styles(currentTheme).screenBackground]}>
//           <View style={styles().flex}>
//             <View style={styles().mainContentContainer}>
//               <View style={styles().flex}>
//                 <Animated.FlatList
//                   contentInset={{ top: containerPaddingTop }}
//                   contentContainerStyle={{
//                     paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
//                   }}
//                   contentOffset={{ y: -containerPaddingTop }}
//                   onScroll={onScroll}
//                   scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
//                   showsVerticalScrollIndicator={false}
//                   ListHeaderComponent={
//                     search ? null : (
//                       <ActiveOrdersAndSections sections={restaurantSections} />
//                     )
//                   }
//                   ListEmptyComponent={emptyView()}
//                   keyExtractor={(item, index) => index.toString()}
//                   refreshControl={
//                     <RefreshControl
//                       progressViewOffset={containerPaddingTop}
//                       colors={[currentTheme.iconColorPink]}
//                       refreshing={networkStatus === 4}
//                       onRefresh={() => {
//                         if (networkStatus === 7) {
//                           refetch()
//                         }
//                       }}
//                     />
//                   }
//                   data={search ? searchRestaurants(search) : restaurants}
//                   renderItem={({ item }) => <Item item={item} />}
//                 />
//                 <CollapsibleSubHeaderAnimator translateY={translateY}>
//                   <Search setSearch={setSearch} search={search} />
//                 </CollapsibleSubHeaderAnimator>
//               </View>
//             </View>
//           </View>

//           <Modalize
//             ref={modalRef}
//             modalStyle={styles(currentTheme).modal}
//             modalHeight={350}
//             overlayStyle={styles().overlay}
//             handleStyle={styles().handle}
//             handlePosition="inside"
//             openAnimationConfig={{
//               timing: { duration: 400 },
//               spring: { speed: 20, bounciness: 10 }
//             }}
//             closeAnimationConfig={{
//               timing: { duration: 400 },
//               spring: { speed: 20, bounciness: 10 }
//             }}
//             flatListProps={{
//               data: isLoggedIn && profile ? profile.addresses : '',
//               ListHeaderComponent: modalHeader(),
//               ListFooterComponent: modalFooter(),
//               showsVerticalScrollIndicator: false,
//               keyExtractor: item => item._id,
//               renderItem: ({ item: address }) => (
//                 <View style={styles().addressbtn}>
//                   <TouchableOpacity
//                     style={styles(currentTheme).addressContainer}
//                     activeOpacity={0.7}
//                     onPress={() => setAddressLocation(address)}>
//                     <View style={styles().addressSubContainer}>
//                       <SimpleLineIcons
//                         name={addressIcons[address.label]}
//                         size={scale(12)}
//                         color={currentTheme.iconColorPink}
//                       />
//                       <View style={styles().mL5p} />
//                       <TextDefault bold>{address.label}</TextDefault>
//                     </View>
//                     <View style={styles().addressTextContainer}>
//                       <TextDefault
//                         style={{ ...alignment.PLlarge }}
//                         textColor={currentTheme.fontSecondColor}
//                         small>
//                         {address.deliveryAddress}
//                       </TextDefault>
//                     </View>
//                   </TouchableOpacity>
//                   <View style={styles().addressTick}>
//                     {address.selected &&
//                       !['Current Location', 'Selected Location'].includes(
//                         location.label
//                       ) && (
//                       <MaterialIcons
//                         name="check"
//                         size={scale(15)}
//                         color={currentTheme.iconColorPink}
//                       />
//                     )}
//                   </View>
//                 </View>
//               )
//             }}></Modalize>
//         </View>
//       </SafeAreaView>
//     </>
//   )
// }

// export default Main
