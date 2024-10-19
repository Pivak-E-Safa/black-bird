/* eslint-disable indent */
import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
  Animated
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AntDesign, EvilIcons } from '@expo/vector-icons'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { Modalize } from 'react-native-modalize'
import moment from 'moment'
import CartItem from '../../components/CartItem/CartItem'
import { scale } from '../../utils/scaling'
import i18n from '../../../i18n'
import { theme } from '../../utils/themeColors'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import OrdersContext from '../../context/Orders'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { useRestaurant } from '../../ui/hooks'
import { LocationContext } from '../../context/Location'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import { useFocusEffect } from '@react-navigation/native'
import { DAYS } from '../../utils/enums'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { RectButton } from 'react-native-gesture-handler'
import { textStyles } from '../../utils/textStyles'
import { calculateDistance } from '../../utils/customFunctions'
import Analytics from '../../utils/analytics'
import { placeAnOrder } from '../../firebase/order'
import firebase from 'firebase/app'
import 'firebase/firestore'

function Cart(props) {
  const configuration = useContext(ConfigurationContext)
  const {
    isLoggedIn,
    profile,
    clearCart,
    restaurant: cartRestaurant,
    cart,
    cartCount,
    addQuantity,
    removeQuantity,
    deleteItem,
    updateCart
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const { subscribeOrders } = useContext(OrdersContext)
  const { location } = useContext(LocationContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const modalRef = useRef(null)
  const [loadingData, setLoadingData] = useState(true)
  const [minimumOrder, setMinimumOrder] = useState('')
  const [isPickedUp, setIsPickedUp] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  const [deliveryCharges, setDeliveryCharges] = useState(0)

  const { loading, data } = useRestaurant(cartRestaurant)
  const Timestamp = firebase.firestore.Timestamp

  // const { loading: loadingTip, data: dataTip } = useQuery(TIPPING, {
  //   fetchPolicy: 'network-only'
  // })

  const onOpen = () => {
    setIsPickedUp(!isPickedUp)
  }

  // const [mutateOrder, { loading: loadingOrderMutation }] = useMutation(
  //   PLACEORDER,
  //   {
  //     onCompleted,
  //     onError,
  //     update
  //   }
  // )

  const COD_PAYMENT = {
    payment: 'COD',
    label: i18n.t('cod'),
    index: 2,
    icon: require('../../assets/images/cashIcon.png')
  }

  const paymentMethod =
    props.route.params && props.route.params.paymentMethod
      ? props.route.params.paymentMethod
      : COD_PAYMENT
  const coupon =
    props.route.params && props.route.params.coupon
      ? props.route.params.coupon
      : null

  const tip =
    props.route.params && props.route.params.tipAmount
      ? props.route.params.tipAmount
      : null

  const [selectedTip, setSelectedTip] = useState()
  const inset = useSafeAreaInsets()

  useEffect(() => {
    // if (tip) {
    //   setSelectedTip(null)
    // } else if (dataTip && !selectedTip) {
    //   setSelectedTip(dataTip.tips.tipVariations[1])
    // }
  }, [tip, data])

  useEffect(() => {
    let isSubscribed = true
    ;(async () => {
      if (data && !!data.restaurant) {
        const latOrigin = Number(data.restaurant.location[1])
        const lonOrigin = Number(data.restaurant.location[0])
        const latDest = Number(location.latitude)
        const longDest = Number(location.longitude)
        const distance = await calculateDistance(
          latOrigin,
          lonOrigin,
          latDest,
          longDest
        )
        const amount = Math.ceil(distance) * configuration.deliveryRate
        isSubscribed &&
          setDeliveryCharges(amount > 0 ? amount : configuration.deliveryRate)
      }
    })()
    return () => {
      isSubscribed = false
    }
  }, [data, location])

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })

  useLayoutEffect(() => {
    // props.navigation.setOptions({
    //   title: i18n.t('titleCart'),
    //   headerRight: null,
    //   headerTitleAlign: 'left',
    //   headerTitleContainerStyle: {
    //     marginLeft: scale(0)
    //   }
    // })
  }, [props.navigation])

  // useEffect(() => {
  //   if (!data) return
  //   didFocus()
  // }, [data])
  // useEffect(() => {
  //   async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_CART)
  //   }
  //   Track()
  // }, [])
  // useEffect(() => {
  //   if (cart && cartCount > 0) {
  //     if (
  //       data &&
  //       data.restaurant &&
  //       (!data.restaurant.isAvailable || !isOpen())
  //     ) {
  //       showAvailablityMessage()
  //     }
  //   }
  // }, [data])

  const showAvailablityMessage = () => {
    Alert.alert(
      '',
      `${data.restaurant.name} closed at the moment`,
      [
        {
          text: 'Go back to restaurants',
          onPress: () => {
            props.navigation.navigate({
              name: 'Main',
              merge: true
            })
          },
          style: 'cancel'
        },
        {
          text: 'Continue',
          onPress: () => {},
          style: 'cancel'
        }
      ],
      { cancelable: true }
    )
  }

  function update(cache, { data: { placeOrder } }) {
    // try {
    //   if (placeOrder && placeOrder.paymentMethod === 'COD') {
    //     cache.modify({
    //       fields: {
    //         orders(existingOrders = []) {
    //           return [newOrder, ...existingOrders]
    //         }
    //       }
    //     })
    //   }
    // } catch (error) {
    //   console.log('update error', error)
    // }
  }

  async function onCompleted(orderId) {
    // await Analytics.track(Analytics.events.ORDER_PLACED, {
    //   userId: data.placeOrder.user.id,
    //   orderId: data.placeOrder.orderId,
    //   name: data.placeOrder.user.name,
    //   email: data.placeOrder.user.email,
    //   restaurantName: data.placeOrder.restaurant.name,
    //   restaurantAddress: data.placeOrder.restaurant.address,
    //   orderPaymentMethod: data.placeOrder.paymentMethod,
    //   orderItems: data.placeOrder.items,
    //   orderAmount: data.placeOrder.orderAmount,
    //   orderPaidAmount: data.placeOrder.paidAmount,
    //   tipping: data.placeOrder.tipping,
    //   orderStatus: data.placeOrder.orderStatus,
    //   orderDate: data.placeOrder.orderDate
    // })
    // if (paymentMethod.payment === 'COD') {
    await subscribeOrders()
    await clearCart()
    props.navigation.reset({
      routes: [
        { name: 'Main' },
        {
          name: 'OrderDetail',
          params: { id: orderId, restaurantId: cartRestaurant }
        }
      ]
    })
  }
  function onError(error) {
    console.log('onError', error)
  }

  function taxCalculation() {
    let taxPercentage = 0
    let taxAmount = 0
    if (data.restaurant?.applyTax) {
      if (paymentMethod.payment === 'COD') {
        taxPercentage = data.restaurant.codTax
      } else {
        taxPercentage = data.restaurant.cardTax
      }
      const delivery = isPickedUp ? 0 : deliveryCharges
      const amount = +calculatePrice(delivery)
      taxAmount = (amount / 100) * taxPercentage
    }
    return taxAmount
  }

  function calculatePrice(delivery = 0) {
    let itemTotal = 0
    cart.forEach(cartItem => {
      itemTotal += cartItem.variation?.price * cartItem.quantity
    })
    const deliveryAmount = delivery > 0 ? deliveryCharges : 0
    return itemTotal + deliveryAmount
  }

  function calculateTotal() {
    let total = 0
    const delivery = isPickedUp ? 0 : deliveryCharges
    total += +calculatePrice(delivery)
    total += +taxCalculation()
    return parseFloat(total)
  }

  function validateOrder() {
    return true // TODO: remove this
    // if (!data.restaurant.isAvailable || !isOpen()) {// TODO: FIX THIS condition, it gives null exception
    //   showAvailablityMessage()
    //   return
    // }
    if (!cart.length && false) {
      // TODO: FIX THIS and remove && false
      FlashMessage({
        message: i18n.t('validateItems')
      })
      return false
    }
    if (calculatePrice(deliveryCharges) < minimumOrder && false) {
      // TODO: FIX THIS and remove && false
      FlashMessage({
        message: `The minimum amount of (${configuration.currencySymbol} ${minimumOrder}) for your order has not been reached.`
      })
      return false
    }
    if (!location.id && false) {
      // TODO: FIX THIS and remove && false
      props.navigation.navigate('CartAddress')
      return false
    }
    if (!paymentMethod && false) {
      // TODO: FIX THIS and remove && false
      FlashMessage({
        message: 'Set payment method before checkout'
      })
      return false
    }
    if (profile.phone.length < 1 && false) {
      // TODO: FIX THIS and remove && false
      props.navigation.navigate('Profile', { backScreen: 'Cart' })
      return false
    }
    if (profile.phone.length > 0 && !profile.phoneIsVerified && false) {
      // TODO: FIX THIS and remove && false
      FlashMessage({
        message: 'Phone number is not verified. Kindly verify phone number.'
      })
      props.navigation.navigate('Profile')
      return false
    }
    return true
  }

  function checkPaymentMethod(currency) {
    // if (paymentMethod.payment === 'STRIPE') { // TODO: needed or not?
    //   return stripeCurrencies.find(val => val.currency === currency)
    // }
    // if (paymentMethod.payment === 'PAYPAL') {
    //   return paypalCurrencies.find(val => val.currency === currency)
    // }
    return true
  }

  function transformOrder(cartData) {
    return cartData.map(food => {
      return {
        quantity: food.quantity,
        title: food.title,
        variation: food.variation.title,
        price: food.variation.price,
        // addons: food.addons // TODO: handle add ons
        //   ? food.addons.map(({ id, options }) => ({
        //       id,
        //       options: options.map(({ id }) => id)
        //     }))
        //   : [],
        specialInstructions: food.specialInstructions
      }
    })
  }
  async function onPayment() {
    if (checkPaymentMethod(configuration.currency)) {
      // mutateOrder({
      //   variables: {
      //     restaurant: cartRestaurant,
      //     orderInput: items,
      //     paymentMethod: paymentMethod.payment,
      //     taxationAmount: +taxCalculation(),
      //     orderDate: orderDate,
      //     isPickedUp: isPickedUp,
      //     deliveryCharges: isPickedUp ? 0 : deliveryCharges,
      //     address: {
      //       label: location.label,
      //       deliveryAddress: location.deliveryAddress,
      //       details: location.details,
      //       longitude: '' + location.longitude,
      //       latitude: '' + location.latitude
      //     }
      //   }
      // })

      const orderData = {
        paymentMethod: paymentMethod.payment,
        taxationAmount: +taxCalculation(),
        createdAt: Timestamp.fromDate(new Date()),
        isPickedUp: isPickedUp,
        deliveryCharges: isPickedUp ? 0 : deliveryCharges,
        userName: profile.name,
        userId: profile.id,
        restaurantId: cartRestaurant,
        orderStatus: 'PENDING',
        total: calculateTotal(),
        number: profile.phone,
        deliveryCharges: data.restaurant.deliveryCharges
      }

      const itemsData = transformOrder(cart)

      const addressData = {
        label: location.label,
        address: location.deliveryAddress,
        details: location.details,
        // location: [location.latitude, location.longitude],
        location: new firebase.firestore.GeoPoint(
          31.690823473174465,
          73.00329238299295
        )
      }
      const orderId = await placeAnOrder(orderData, itemsData, addressData)
      onCompleted(orderId)
    } else {
      FlashMessage({
        message: i18n.t('paymentNotSupported')
      })
    }
  }

  const isOpen = () => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return (
      hours >= Number(data.restaurant.openingTimes.startTime[0]) &&
      minutes >= Number(data.restaurant.openingTimes.startTime[1]) &&
      hours <= Number(data.restaurant.openingTimes.endTime[0]) &&
      minutes <= Number(data.restaurant.openingTimes.endTime[1])
    )
  }

  async function didFocus() {
    const { restaurant } = data
    setSelectedRestaurant(restaurant)
    setMinimumOrder(restaurant.minimumOrder)
    const foods = restaurant.categories.map(c => c.foods.flat()).flat()
    const { addons, options } = restaurant
    try {
      if (cartCount && cart) {
        const transformCart = cart.map(cartItem => {
          const food = foods.find(food => food.id === cartItem.id)
          if (!food) return null
          const variation = food.variations.find(
            variation => variation.id === cartItem.variation.id
          )
          if (!variation) return null

          const title = `${food.title}${
            variation.title ? `(${variation.title})` : ''
          }`
          let price = variation.price
          const optionsTitle = []
          if (cartItem.addons) {
            cartItem.addons.forEach(addon => {
              const cartAddon = addons.find(add => add.id === addon.id)
              if (!cartAddon) return null
              addon.options.forEach(option => {
                const cartOption = options.find(opt => opt.id === option.id)
                if (!cartOption) return null
                price += cartOption.price
                optionsTitle.push(cartOption.title)
              })
            })
          }
          return {
            ...cartItem,
            optionsTitle,
            title: title,
            price: price
          }
        })

        if (props.navigation.isFocused()) {
          const updatedItems = transformCart.filter(item => item)
          if (updatedItems.length === 0) await clearCart()
          await updateCart(updatedItems)
          setLoadingData(false)
          if (transformCart.length !== updatedItems.length) {
            FlashMessage({
              message: 'One or more item is not available'
            })
          }
        }
      } else {
        if (props.navigation.isFocused()) {
          setLoadingData(false)
        }
      }
    } catch (e) {
      FlashMessage({
        message: e.message
      })
    }
  }

  function emptyCart() {
    return (
      <View style={styles().subContainerImage}>
        <View style={styles().imageContainer}>
          <EmptyCart width={scale(200)} height={scale(200)} />
        </View>
        <View style={styles().descriptionEmpty}>
          <TextDefault textColor={currentTheme.fontMainColor} bolder center>
            {i18n.t('hungry')}?
          </TextDefault>
          <TextDefault textColor={currentTheme.fontSecondColor} bold center>
            {i18n.t('emptyCart')}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).emptyButton}
          onPress={() =>
            props.navigation.navigate({
              name: 'Main',
              merge: true
            })
          }>
          <TextDefault
            textColor={currentTheme.buttonText}
            bolder
            B700
            center
            uppercase>
            {i18n.t('emptyCartBtn')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
  }
  function loadginScreen() {
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
          <PlaceholderLine />
          <PlaceholderLine />
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
          <PlaceholderLine style={styles().height60} />
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
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View
            style={[
              styles(currentTheme).horizontalLine,
              styles().width100,
              styles().mB10
            ]}
          />
          <PlaceholderLine />
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
          <PlaceholderLine style={styles().height100} />
          <PlaceholderLine />
          <PlaceholderLine />
          <View
            style={[
              styles(currentTheme).horizontalLine,
              styles().width100,
              styles().mB10
            ]}
          />
          <PlaceholderLine />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  function renderRightSwipe(progress, key) {
    const scaleX = progress.interpolate({
      inputRange: [0, 1, 3],
      outputRange: [100, 0, 0]
    })
    return (
      <Animated.View
        style={[
          styles().trashContainer,
          { transform: [{ translateX: scaleX }] }
        ]}>
        <RectButton
          rippleColor="black"
          style={styles().trashIcon}
          onPress={() => deleteItem(key)}>
          <EvilIcons name="trash" size={scale(25)} color={currentTheme.white} />
        </RectButton>
      </Animated.View>
    )
  }
  // if (loading || loadingData || loadingTip) return loadginScreen()
  return (
    <>
      <View style={styles(currentTheme).mainContainer}>
        {!cart.length && emptyCart()}
        {!!cart.length && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[
                styles().flex,
                {
                  ...alignment.PLsmall,
                  ...alignment.PRsmall
                }
              ]}>
              <View
                style={[
                  styles(currentTheme).priceContainer,
                  styles().pT10,
                  styles().mB10,
                  styles().pB10
                ]}>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      flex: 2,
                      alignContent: 'flex-start',
                      alignItems: 'flex-start'
                    }}>
                    <TextDefault textColor={currentTheme.fontMainColor}>
                      {isPickedUp ? 'Pick Up' : 'Delivery'}{' '}
                    </TextDefault>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignContent: 'center',
                      alignItems: 'center'
                    }}>
                    <TouchableOpacity onPress={onOpen}>
                      <TextDefault textColor={currentTheme.iconColorPink}>
                        Switch to {isPickedUp ? 'Delivery' : 'Pick Up'}{' '}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles(currentTheme).dealContainer,
                  styles().pT10,
                  styles().mB10
                ]}>
                {cart.map(food => (
                  <Swipeable
                    key={food.key}
                    renderRightActions={(progress, dragX) =>
                      renderRightSwipe(progress, food.key)
                    }>
                    <View style={[styles().itemContainer, styles().pB5]}>
                      <CartItem
                        quantity={food.quantity}
                        dealName={food.title}
                        optionsTitle={food.optionsTitle}
                        dealPrice={
                          parseFloat(food.variation?.price) * food.quantity
                        }
                        addQuantity={() => {
                          addQuantity(food.key)
                        }}
                        removeQuantity={() => {
                          removeQuantity(food.key)
                        }}
                      />
                    </View>
                  </Swipeable>
                ))}
              </View>
              <View
                style={[
                  styles(currentTheme).priceContainer,
                  styles().pT10,
                  styles().mB10
                ]}>
                <View style={[styles().floatView, styles().pB10]}>
                  <TextDefault
                    numberOfLines={1}
                    small
                    textColor={currentTheme.fontSecondColor}
                    style={{ width: '30%' }}>
                    {i18n.t('subTotal')}
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    textColor={currentTheme.fontMainColor}
                    small
                    style={{ width: '70%' }}
                    right>
                    {configuration.currencySymbol} {calculatePrice(0)}
                  </TextDefault>
                </View>
                {!isPickedUp && (
                  <View style={[styles().floatView, styles().pB10]}>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontSecondColor}
                      small
                      style={{ width: '30%' }}>
                      {i18n.t('deliveryFee')}
                    </TextDefault>
                    <TextDefault
                      numberOfLines={1}
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '70%' }}
                      small
                      right>
                      {configuration.currencySymbol} {deliveryCharges}
                    </TextDefault>
                  </View>
                )}

                {data.restaurant?.applyTax && (
                  <>
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontSecondColor}
                        small
                        style={{ width: '30%' }}>
                        {i18n.t('taxFee')}
                      </TextDefault>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontMainColor}
                        style={{ width: '70%' }}
                        small
                        right>
                        {configuration.currencySymbol} {taxCalculation()}
                      </TextDefault>
                    </View>
                  </>
                )}
                <View
                  style={[
                    styles(currentTheme).horizontalLine,
                    styles().pB10,
                    styles().width100,
                    styles().mB10
                  ]}
                />
                <View style={[styles().floatView, styles().pB10]}>
                  <TextDefault
                    numberOfLines={1}
                    textColor={currentTheme.fontMainColor}
                    style={{ width: '30%' }}
                    bolder>
                    Total
                  </TextDefault>
                  <TextDefault
                    numberOfLines={1}
                    textColor={currentTheme.fontMainColor}
                    style={{ width: '70%' }}
                    bolder
                    right>
                    {configuration.currencySymbol} {calculateTotal()}
                  </TextDefault>
                </View>
              </View>

              {isLoggedIn && profile && (
                <>
                  <View
                    style={[
                      styles(currentTheme).dealContainer,
                      styles().pT10,
                      styles().mB10
                    ]}>
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        small
                        bold
                        textColor={currentTheme.fontMainColor}>
                        {i18n.t('contactInfo')}
                      </TextDefault>
                    </View>
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        small
                        textColor={currentTheme.fontSecondColor}
                        style={{ width: '30%' }}>
                        {i18n.t('email')}
                      </TextDefault>
                      <TextDefault
                        numberOfLines={1}
                        small
                        textColor={currentTheme.fontSecondColor}
                        style={{ width: '70%' }}
                        right>
                        {profile.email}
                      </TextDefault>
                    </View>
                    <View style={[styles().floatView, styles().pB10]}>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontSecondColor}
                        small
                        style={{ width: '30%' }}>
                        {i18n.t('phone')}
                      </TextDefault>
                      <TextDefault
                        numberOfLines={1}
                        textColor={currentTheme.fontSecondColor}
                        small
                        style={{ width: '70%' }}
                        right>
                        {profile.phone ? profile.phone : 'None'}
                      </TextDefault>
                    </View>
                    <View
                      style={[
                        styles(currentTheme).horizontalLine,
                        styles().width100,
                        styles().mB10
                      ]}
                    />
                    {isPickedUp ? (
                      <>
                        <View style={[styles().floatView, styles().pB10]}>
                          <TextDefault
                            numberOfLines={1}
                            small
                            textColor={currentTheme.fontMainColor}
                            style={{ width: '50%' }}>
                            {i18n.t('titlePickUpDetails')}
                          </TextDefault>

                          {/* <TextDefault textColor={currentTheme.fontSecondColor}>
                                {selectedRestaurant.location.details}
                              </TextDefault> */}
                        </View>
                        <View>
                          <TextDefault
                            small
                            textColor={currentTheme.fontSecondColor}>
                            {`${selectedRestaurant.address}`}
                          </TextDefault>
                        </View>
                        <View style={[styles().width100, styles().mB10]} />
                      </>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles().pB10}
                        onPress={event => {
                          if (!profile.addresses.length) {
                            props.navigation.navigate('NewAddress', {
                              backScreen: 'Cart'
                            })
                          } else {
                            props.navigation.navigate('CartAddress', {
                              address: location
                            })
                          }
                        }}>
                        <View style={[styles().floatView, styles().pB10]}>
                          <TextDefault
                            numberOfLines={1}
                            small
                            textColor={currentTheme.fontMainColor}
                            style={{ width: '50%' }}>
                            {i18n.t('titleDeliveryDetails')}
                          </TextDefault>
                          <AntDesign
                            name="right"
                            size={scale(15)}
                            color={currentTheme.iconColorPink}
                            style={styles().arrowRight}
                          />
                        </View>
                        {location ? (
                          <>
                            <TextDefault
                              small
                              textColor={
                                currentTheme.fontSecondColor
                              }>{`${location.deliveryAddress}`}</TextDefault>
                            <TextDefault
                              textColor={currentTheme.fontSecondColor}>
                              {location.details}
                            </TextDefault>
                          </>
                        ) : (
                          <TextDefault
                            small
                            textColor={currentTheme.fontSecondColor}>
                            {i18n.t('deliveryAddressmessage')}
                          </TextDefault>
                        )}
                      </TouchableOpacity>
                    )}
                    <View style={[styles().width100, styles().mB10]} />
                  </View>
                  <View
                    style={[
                      styles(currentTheme).dealContainer,
                      styles().pT10,
                      styles().mB10
                    ]}>
                    <View style={[styles().floatView, styles().mB10]}>
                      <TextDefault
                        small
                        textColor={currentTheme.fontMainColor}
                        style={{ width: '70%' }}>
                        {i18n.t('paymentMethod')}
                      </TextDefault>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles().width30]}
                        onPress={() => {
                          props.navigation.navigate('Payment', {
                            paymentMethod,
                            coupon
                          })
                        }}>
                        <TextDefault
                          small
                          textColor={currentTheme.buttonBackgroundPink}
                          right>
                          {i18n.t('change')}
                        </TextDefault>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles().floatView, styles().pB10, styles().pT10]}
                      onPress={() => {
                        props.navigation.navigate('Payment', {
                          paymentMethod,
                          coupon
                        })
                      }}>
                      <View style={{ width: '10%' }}>
                        <Image
                          resizeMode="cover"
                          style={[
                            styles().iconStyle,
                            { ...alignment.MRxSmall }
                          ]}
                          source={paymentMethod.icon}
                        />
                      </View>
                      <TextDefault
                        textColor={currentTheme.buttonBackgroundPink}
                        small
                        style={{ width: '45%' }}>
                        {paymentMethod.label}
                      </TextDefault>
                      <TextDefault
                        textColor={currentTheme.fontMainColor}
                        style={{ width: '45%' }}
                        small
                        right>
                        {configuration.currencySymbol} {calculateTotal()}
                      </TextDefault>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View
                style={[styles().termsContainer, styles().pT10, styles().mB10]}>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  style={alignment.MBsmall}
                  small>
                  {i18n.t('condition1')}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme.fontSecondColor}
                  style={alignment.MBsmall}
                  small
                  bold>
                  {i18n.t('condition2')}
                </TextDefault>
              </View>
            </ScrollView>

            <View style={styles(currentTheme).buttonContainer}>
              {isLoggedIn && profile ? (
                <TouchableOpacity
                  // disabled={loadingOrderMutation}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (validateOrder()) onPayment()
                  }}
                  style={styles(currentTheme).button}>
                  {/* {loadingOrderMutation ? (
                      <ActivityIndicator
                        size="large"
                        style={{ flex: 1, justifyContent: 'center' }}
                        color={currentTheme.buttonText}
                      />
                    ) : ( */}
                  <>
                    <View style={styles().buttontLeft}>
                      <View style={styles(currentTheme).buttonLeftCircle}>
                        <TextDefault
                          bold
                          center
                          textColor={currentTheme.fontMainColor}
                          small>
                          {cartCount}
                        </TextDefault>
                      </View>
                    </View>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '30%' }}
                      bolder
                      small
                      center
                      uppercase>
                      {i18n.t('orderBtn')}
                    </TextDefault>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      style={{ width: '35%' }}
                      bolder
                      normal
                      right>
                      {configuration.currencySymbol} {calculateTotal()}
                    </TextDefault>
                  </>
                  {/* )} */}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    props.navigation.navigate({ name: 'CreateAccount' })
                  }}
                  style={styles(currentTheme).button}>
                  <TextDefault
                    textColor={currentTheme.fontMainColor}
                    style={{ width: '100%' }}
                    H5
                    bolder
                    center
                    uppercase>
                    {i18n.t('loginOrCreateAccount')}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground
        }}
      />
    </>
  )
}

export default Cart
