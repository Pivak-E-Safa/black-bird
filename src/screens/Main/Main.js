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
  RefreshControl,
  Image
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
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
// import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'
import Spinner from '../../components/Spinner/Spinner'
import Analytics from '../../utils/analytics'
import { fetchRestaurantList } from '../../firebase/restaurants'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Dropdown } from 'react-native-element-dropdown'
import { fontStyles } from '../../utils/fontStyles'

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
  const [selectedValue, setSelectedValue] = useState()
  const [ restaurantsData, setRestaurantsData ] = useState([])
  const gif = require('../../assets/GIF/home.gif')

  const refetch = () => {};
  const networkStatus = 7;
  const loading = false;
  const error = null;
  const mutationLoading = false;
  const containerPaddingTop = 0; // TODO: See if this is making any issues

  const {
    onScroll /* Event handler */,
    // containerPaddingTop /* number */,
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
        const restaurantsList = await fetchRestaurantList();
        setRestaurants(restaurantsList);
        setRestaurantsData(restaurantsList.map(restaurant => ({ id: restaurant.id, area: restaurant.area })));
        setSelectedValue(restaurantsList[0].id);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    getRestaurants();
  }, []);

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
    }
    Track()
  }, [])

  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }

  function onEnter() {
    navigation.navigate('RestaurantDetails', { id: selectedValue });
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
      id: address.id,
      label: address.label,
      latitude: Number(address.location.latitude),
      longitude: Number(address.location.longitude),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    // mutate({ variables: { id: address.id } })
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
  //     .map(id => restaurants.filter(res => res.id === id))
  //     .flat()
  // }))
  return (
    <>
      <SafeAreaView edges={['bottom', 'left', 'right']} style={styles().flex}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          {/* <View style={styles().flex}> */}
          {/* <View style={styles().mainContentContainer}> */}
          {/* <View style={styles().flex}> */}
          <Image source={gif} style={{ width: '100%', height: '100%' }} />
          <View style={styles().dropdownContainer}>
            <Dropdown
              style={styles().dropdown}
              data={restaurantsData}
              labelField="area"
              valueField="id"
              placeholder="Select City"
              placeholderStyle={styles().placeholder}
              selectedTextStyle={styles().text}
              activeColor={'rgb(255, 140, 0, 0.9)'}
              iconColor={'rgba(255, 255, 255, 10)'}
              iconStyle={{}}
              dropdownStyle={styles.dropdownContent}
              maxHeight={150}
              value={selectedValue}
              itemContainerStyle={{height: 50, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}
              itemTextStyle={{color: 'white', fontSize: 14, alignItems: 'center', textAlign: 'center', fontFamily: fontStyles.FredokaBold}}
              containerStyle={{
                backgroundColor: 'rgba(255, 140, 0, 0.9)',
                borderWidth: 0,
                borderRadius: 8,
              }}
              onChange={item => setSelectedValue(item.id)}
              showArrow={false}
            />
          </View>
          <TouchableOpacity style={styles().fingerPrintButton} onPress={onEnter}>
            <Ionicons
              name="finger-print"
              size={70}
              color="#000"
              style={styles().fingerPrint}
              // style={{ position: 'absolute', top: -120, left: '43%' }}
            />
          </TouchableOpacity>
          {/* <Animated.FlatList
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
                /> */}
          {/* <CollapsibleSubHeaderAnimator translateY={translateY}>
                </CollapsibleSubHeaderAnimator> */}
          {/* </View> */}
          {/* </View> */}
          {/* </View> */}

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
              keyExtractor: item => item.id,
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
//       id: address.id,
//       label: address.label,
//       latitude: Number(address.location[1]),
//       longitude: Number(address.location[0]),
//       deliveryAddress: address.deliveryAddress,
//       details: address.details
//     })
//     mutate({ variables: { id: address.id } })
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
//       .map(id => restaurants.filter(res => res.id === id))
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
//               keyExtractor: item => item.id,
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
