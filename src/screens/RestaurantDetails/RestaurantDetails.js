import {
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  SectionList,
  Linking
} from 'react-native'
import Animated, {
  Extrapolate,
  interpolateNode,
  concat,
  useValue,
  EasingNode,
  timing
} from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from 'rn-placeholder'
import { fetchRestaurantDetails } from '../../firebase/restaurants'
import ImageHeader from '../../components/RestaurantDetails/ImageHeader'
import ImageSlider from '../../components/RestaurantDetails/ImageSlider'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import { useRestaurant } from '../../ui/hooks'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import { DAYS } from '../../utils/enums'
import { alignment } from '../../utils/alignment'
import TextError from '../../components/Text/TextError/TextError'
import i18n from '../../../i18n'
import Analytics from '../../utils/analytics'
const { height } = Dimensions.get('screen')
// Animated Section List component
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)
const HEADER_MAX_HEIGHT = height * 0.28
const HEADER_MIN_HEIGHT = height * 0.07
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
const HALF_HEADER_SCROLL = HEADER_MAX_HEIGHT

const config = to => ({
  duration: 250,
  toValue: to,
  easing: EasingNode.inOut(EasingNode.ease)
})

function RestaurantDetails(props) {
  const scrollRef = useRef(null)
  const flatListRef = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const inset = useSafeAreaInsets()
  const propsData = route.params
  const animation = useValue(0)
  const circle = useValue(0)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const menuImage = require('../../assets/JPG/menu.jpg')
  const restaurantImages = [
    require('../../assets/deals/deal1.jpg'),
    require('../../assets/deals/deal2.jpg'),
    require('../../assets/deals/deal3.jpg'),
    require('../../assets/deals/deal4.jpg'),
  ]

  const configuration = useContext(ConfigurationContext)
  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(false)
  const [buttonClicked, buttonClickedSetter] = useState(false)
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    cartCount,
    addCartItem,
    addQuantity,
    clearCart,
    checkItemCart
  } = useContext(UserContext)
  // const { data, refetch, networkStatus, loading, error } = useRestaurant(
  //   propsData.id
  // )
  const restaurantId = props.route.params.id

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS)
    }
    Track()
  }, [])
  useEffect(() => {
    const getRestaurantDetails = async () => {
      try {
        const restaurantsList = await fetchRestaurantDetails(restaurantId)
        setData({ restaurant: restaurantsList })
      } catch (error) {
        console.error('Error fetching restaurants:', error)
      }
    }

    getRestaurantDetails()

    if (
      data &&
      data.restaurant &&
      (!data.restaurant.isAvailable || !isOpen())
    ) {
      Alert.alert(
        '',
        'Restaurant Closed at the moment',
        [
          {
            text: 'Go back to restaurants',
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: 'See Menu',
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
    }
  }, []) // TODO: Should we pass data here? It was causing an infite loop I guess

  const isOpen = () => {
    if (data.restaurant.openingTimes.length < 1) return false
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = data.restaurant.openingTimes.find(
      o => o.day === DAYS[day]
    )
    if (todaysTimings === undefined) return false
    const times = todaysTimings.times.filter(
      t =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    )

    return times.length > 0
  }
  const onPressItem = async food => {
    if (!data.restaurant.isAvailable || !isOpen()) {
      Alert.alert(
        '',
        'Restaurant Closed at the moment',
        [
          {
            text: 'Go back to restaurants',
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: 'See Menu',
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
      return
    }
    if (!restaurantCart || restaurant.id === restaurantCart) {
      await addToCart(food, restaurant.id !== restaurantCart)
    } else if (restaurant.id !== restaurantCart) {
      Alert.alert(
        '',
        'By leaving this restaurant page, the items you`ve added to cart will be cleared',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: async () => {
              await addToCart(food, true)
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  const addToCart = async (food, clearFlag) => {
    if (clearFlag) await clearCart()
    navigation.navigate('ItemDetail', {
      food,
      restaurant: restaurantId
    })
  }

  function tagCart(itemId) {
    if (checkItemCart) {
      const cartValue = checkItemCart(itemId)
      if (cartValue.exist) {
        return (
          <>
            <View style={styles(currentTheme).triangleCorner} />
            <TextDefault
              style={styles(currentTheme).tagText}
              numberOfLines={1}
              textColor={currentTheme.fontWhite}
              bold
              small
              center>
              {cartValue.quantity}
            </TextDefault>
          </>
        )
      }
    }
    return null
  }

  // button animation
  function animate() {
    timing(circle, {
      toValue: 1,
      duration: 500,
      easing: EasingNode.inOut(EasingNode.ease)
    }).start()
    circle.setValue(0) // important for animation next time.
  }

  // Section and Flatlist fucntion  => related to topbar styling and scrolling

  const scrollToSection = index => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
        viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
        viewPosition: 0
      })
    }
  }

  function changeIndex(index) {
    if (selectedLabel !== index) {
      selectedLabelSetter(index)
      buttonClickedSetter(true)
      scrollToSection(index)
      scrollToNavbar(index)
    }
  }
  function scrollToNavbar(value) {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: value,
        viewPosition: 0.5
      })
    }
  }

  function onViewableItemsChanged({ viewableItems }) {
    if (viewableItems.length === 0) return
    if (
      selectedLabel !== viewableItems[0].section.index &&
      buttonClicked === false
    ) {
      selectedLabelSetter(viewableItems[0].section.index)
      scrollToNavbar(viewableItems[0].section.index)
    }
  }

  // Important
  const headerHeight = interpolateNode(animation, {
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: Extrapolate.CLAMP
  })

  const opacity = interpolateNode(animation, {
    inputRange: [0, height * 0.05, SCROLL_RANGE / 2],
    outputRange: [1, 0.8, 0],
    extrapolate: Extrapolate.CLAMP
  })

  const iconColor = currentTheme.iconColorPink
  const iconBackColor = currentTheme.themeBackground

  const iconRadius = scale(15)

  const iconSize = scale(20)

  const iconTouchHeight = scale(30)

  const iconTouchWidth = scale(30)

  const headerTextFlex = concat(
    interpolateNode(animation, {
      inputRange: [0, 80, SCROLL_RANGE],
      outputRange: [-10, -10, 0],
      extrapolate: Extrapolate.CLAMP
    }),
    '%'
  )

  const circleSize = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(18), scale(24), scale(18)],
    extrapolate: Extrapolate.CLAMP
  })
  const radiusSize = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(9), scale(12), scale(9)],
    extrapolate: Extrapolate.CLAMP
  })
  const fontChange = interpolateNode(circle, {
    inputRange: [0, 0.5, 1],
    outputRange: [scale(8), scale(12), scale(8)],
    extrapolate: Extrapolate.CLAMP
  })

  if (loading) {
    return (
      <Animated.View
        style={[
          styles().flex,
          {
            marginTop: inset.top,
            paddingBottom: inset.bottom,
            paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
            backgroundColor: currentTheme.headerMenuBackground
          }
        ]}>
        <ImageHeader
          iconColor={iconColor}
          iconSize={iconSize}
          height={headerHeight}
          opacity={opacity}
          iconBackColor={iconBackColor}
          iconRadius={iconRadius}
          iconTouchWidth={iconTouchWidth}
          iconTouchHeight={iconTouchHeight}
          headerTextFlex={headerTextFlex}
          restaurantName={propsData.name}
          restaurantImage={propsData.image}
          restaurant={null}
          topaBarData={[]}
          loading={loading}
        />

        {/* <ImageSlider           
          images={restaurantImages} />  */}
        <View
          style={[
            styles().navbarContainer,
            styles().flex,
            {
              paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT
            }
          ]}>
          {Array.from(Array(10), (_, i) => (
            <Placeholder
              key={i}
              Animation={props => (
                <Fade
                  {...props}
                  style={{ backgroundColor: '#B8B8B8' }}
                  duration={600}
                />
              )}
              Left={PlaceholderMedia}
              style={{
                padding: 12
              }}>
              <PlaceholderLine width={80} />
              <PlaceholderLine width={80} />
            </Placeholder>
          ))}
        </View>
      </Animated.View>
    )
  }
  // if (error) return <TextError text={JSON.stringify(error)} />
  const restaurant = data.restaurant
  const allDeals = restaurant?.categories?.filter(cat => cat.foods.length)
  const deals = allDeals?.map((c, index) => ({
    ...c,
    data: c.foods,
    index
  }))

  return (
    <SafeAreaView style={styles().flex}>
      {data.restaurant && (
        <Animated.View style={styles().flex}>
          <ImageHeader
            iconColor={iconColor}
            iconSize={iconSize}
            height={headerHeight}
            opacity={opacity}
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            headerTextFlex={headerTextFlex}
            restaurantName={propsData.name}
            restaurantImage={propsData.image}
            restaurant={data.restaurant}
            topaBarData={deals}
            changeIndex={changeIndex}
            selectedLabel={selectedLabel}
          />
          <ImageSlider
            marginTop={HEADER_MAX_HEIGHT}
            images={restaurantImages}
          />

          <View style={styles().bottomContainerParent}>
            <TouchableOpacity
              style={[styles().card, styles().menu]}
              onPress={() =>
                navigation.navigate('Restaurant', { id: restaurantId })
              }>
              <Animated.Image
                resizeMode="cover"
                source={menuImage}
                style={[
                  styles().flex,
                  {
                    opacity: props.opacity,
                    borderRadius: 10,
                    width: '100%',
                    height: 'auto',
                    borderWidth: 3, // Border width for the 3D effect
                    borderColor: '#FFB300', // A slightly darker yellow or orange for the border
                    borderRadius: 10, // Rounded corners
                    shadowColor: '#000', // Shadow color
                    shadowOffset: { width: 0, height: 4 }, // Shadow offset
                    shadowOpacity: 0.6, // Shadow opacity
                    shadowRadius: 9, // Shadow blur radius
                    elevation: 6, // Elevation for Android shadow
                  }
                ]}
              />
               <Animated.Text style={[styles(currentTheme).menuText]}>
                  {'MENU'}
              </Animated.Text>
            </TouchableOpacity>

            <View style={styles().bottomContainerChild}>
              <TouchableOpacity
                style={[styles().card, styles().video]}
                onPress={() => Linking.openURL(restaurant.videoLink)}>
                <Animated.Text style={[styles(currentTheme).videoText]}>
                  {'SNEAK PEAK'}
                </Animated.Text>
                <Ionicons
                  name="logo-youtube"
                  size={70}
                  color="white"
                  style={[styles(currentTheme).videoIcon]}
                />
              </TouchableOpacity>

              <View style={[styles().card, styles().about]}>
                <Animated.Text style={[styles(currentTheme).videoText]}>
                  {'SOCIALS'}
                </Animated.Text>

                <View style={styles().socialContainer}>
                  {/* First row */}
                  <View style={styles().row}>
                    {/* Instagram */}
                    <TouchableOpacity
                      style={styles().iconWrapper}
                      onPress={() =>
                        Linking.openURL(restaurant.instagram)
                      }>
                      <Ionicons
                        name="logo-instagram"
                        size={30}
                        color="white"
                        style={styles().socialIcon}
                      />
                    </TouchableOpacity>

                    {/* Facebook */}
                    <TouchableOpacity
                      style={styles().iconWrapper}
                      onPress={() =>
                        Linking.openURL(restaurant.facebook)
                      }>
                      <Ionicons
                        name="logo-facebook"
                        size={30}
                        color="white"
                        style={styles().socialIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Second row */}
                  <View style={styles().row}>
                    {/* Google Maps */}
                    <TouchableOpacity
                      style={styles().iconWrapper}
                      onPress={() =>
                        Linking.openURL(restaurant.googleMaps)
                      }>
                      <Ionicons
                        name="location-outline"
                        size={30}
                        color="white"
                        style={styles().socialIcon}
                      />
                    </TouchableOpacity>

                    {/* WhatsApp */}
                    <TouchableOpacity
                      style={styles().iconWrapper}
                      onPress={() =>
                        Linking.openURL(restaurant.whatsapp)
                      }>
                      <Ionicons
                        name="logo-whatsapp"
                        size={30}
                        color="white"
                        style={styles().socialIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {cartCount > 0 && (
            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles(currentTheme).button}
                onPress={() => navigation.navigate('Cart')}>
                <View style={styles().buttontLeft}>
                  <Animated.View
                    style={[
                      styles(currentTheme).buttonLeftCircle,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: radiusSize
                      }
                    ]}>
                    <Animated.Text
                      style={[
                        styles(currentTheme).buttonTextLeft,
                        { fontSize: fontChange }
                      ]}>
                      {cartCount}
                    </Animated.Text>
                  </Animated.View>
                </View>
                <TextDefault
                  style={styles().buttonText}
                  textColor={currentTheme.buttonTextPink}
                  uppercase
                  center
                  bolder
                  small>
                  {i18n.t('viewCart')}
                </TextDefault>
                <View style={styles().buttonTextRight} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

export default RestaurantDetails
