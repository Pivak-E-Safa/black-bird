import React, { useState, useContext, useLayoutEffect, useEffect } from 'react'
import {
  View,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import styles from './styles'
import RadioComponent from '../../components/CustomizeComponents/RadioComponent/RadioComponent'
import CheckComponent from '../../components/CustomizeComponents/CheckComponent/CheckComponent'
import CartComponent from '../../components/CustomizeComponents/CartComponent/CartComponent'
import HeadingComponent from '../../components/CustomizeComponents/HeadingComponent/HeadingComponent'
import ImageHeader from '../../components/ItemDetails/ImageHeader'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { TextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import Analytics from '../../utils/analytics'
const { height } = Dimensions.get('screen')
const HEADER_MAX_HEIGHT = height * 0.55
const HEADER_MIN_HEIGHT = height * 0.07

function ItemDetail(props) {
  const { food, restaurant } = props.route.params
  const navigation = useNavigation()

  const [selectedVariation, setSelectedVariation] = useState({
    ...food.variations[0],
    addons: food.addons
  })

  const [selectedAddons, setSelectedAddons] = useState([])
  const [specialInstructions, setSpecialInstructions] = useState('')
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    cart,
    addQuantity,
    addCartItem
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const inset = useSafeAreaInsets()

  const iconColor = currentTheme.iconColorPink
  const iconBackColor = currentTheme.themeBackground

  const iconRadius = scale(15)

  const iconSize = scale(20)

  const iconTouchHeight = scale(30)

  const iconTouchWidth = scale(30)

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.headerBackground)
    }
    StatusBar.setBarStyle('light-content')
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.OPENED_RESTAURANT_ITEM, {
        restaurantID: restaurant,
        foodID: food.id,
        foodName: food.title,
        foodRestaurantName: food.restaurantName
      })
    }
    Track()
  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
      title: 'Customize'
    })
  }, [navigation])

  function validateButton() {
    if (!selectedVariation) return false
    const validatedAddons = []
    selectedVariation.addons?.forEach(addon => {
      const selected = selectedAddons.find(ad => ad.id === addon.id)
      // if (!selected && addon.quantityMinimum === 0) {
      if (!selected) {
        validatedAddons.push(false)
        // } else if (
        //   selected &&
        //   selected.options.length >= addon.quantityMinimum &&
        //   selected.options.length <= addon.quantityMaximum
        // ) {
        // validatedAddons.push(false)
      } else validatedAddons.push(true)
    })
    return validatedAddons?.every(val => val === false) // TODO: Is it needed?
  }

  async function onPressAddToCart(quantity) {
    // if (validateOrderItem()) { // TODO: Needed?
    if (true) {
      // TODO: Revisit this
      // Analytics.track(Analytics.events.ADD_TO_CART, {
      //   title: food.title,
      //   restaurantName: food.restaurantName,
      //   variations: food.variations
      // })
      if (!restaurantCart || restaurant === restaurantCart) {
        await addToCart(quantity, restaurant !== restaurantCart)
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
                await addToCart(quantity, true)
              }
            }
          ],
          { cancelable: false }
        )
      }
    }
  }

  const addToCart = async (quantity, clearFlag) => {
    const addons = selectedAddons.map(addon => ({
      ...addon,
      options: addon.options.map(({ id }) => ({
        id
      }))
    }))
    const cartItem = clearFlag
      ? null
      : cart.find(cartItem => {
          if (
            cartItem.id === food.id &&
            cartItem.variation.id === selectedVariation.id
          ) {
            if (cartItem.addons.length === addons.length) {
              if (addons.length === 0) return true
              const addonsResult = addons.every(newAddon => {
                const cartAddon = cartItem.addons.find(
                  ad => ad.id === newAddon.id
                )

                if (!cartAddon) return false
                const optionsResult = newAddon.options.every(newOption => {
                  const cartOption = cartAddon.options.find(
                    op => op.id === newOption.id
                  )

                  if (!cartOption) return false
                  return true
                })

                return optionsResult
              })

              return addonsResult
            }
          }
          return false
        })
    if (!cartItem) {
      await setCartRestaurant(restaurant)
      await addCartItem(
        food,
        selectedVariation,
        quantity,
        addons,
        clearFlag,
        specialInstructions
      )
    } else {
      await addQuantity(cartItem.key, quantity)
    }
    navigation.goBack()
  }

  function onSelectVariation(variation) {
    setSelectedVariation({
      ...variation,
      addons: variation?.addons?.map(fa => {
        return addons.find(a => a.id === fa)
        // const addonOptions = addon.options.map(ao => {
        //   return options.find(o => o.id === ao)
        // })
        // return {
        //   ...addon,
        //   // options: addonOptions
        // }
      })
    })
  }

  async function onSelectOption(addon, option) {
    const index = selectedAddons.findIndex(ad => ad.id === addon.id)
    if (index > -1) {
      if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
        selectedAddons[index].options = [option]
      } else {
        const optionIndex = selectedAddons[index].options.findIndex(
          opt => opt.id === option.id
        )
        if (optionIndex > -1) {
          selectedAddons[index].options = selectedAddons[index].options.filter(
            opt => opt.id !== option.id
          )
        } else {
          selectedAddons[index].options.push(option)
        }
        if (!selectedAddons[index].options.length) {
          selectedAddons.splice(index, 1)
        }
      }
    } else {
      selectedAddons.push({ id: addon.id, options: [option] })
    }
    setSelectedAddons([...selectedAddons])
  }

  function calculatePrice() {
    const variation = selectedVariation.price
    let addons = 0
    selectedAddons.forEach(addon => {
      addons += addon.options.reduce((acc, option) => {
        return acc + option.price
      }, 0)
    })
    // return (variation + addons)
    return variation
  }

  function validateOrderItem() {
    const validatedAddons = selectedVariation?.addons?.map(addon => {
      const selected = selectedAddons.find(ad => ad.id === addon.id)

      if ((!selected && addon.quantityMinimum === 0) || true) {
        // TODO: Revisit this logic, I donn't think we need this since we don't have max or min quantities for addons
        addon.error = false
      } else if (
        selected &&
        selected.options.length >= addon.quantityMinimum &&
        selected.options.length <= addon.quantityMaximum
      ) {
        addon.error = false
      } else addon.error = true
      return addon
    })
    setSelectedVariation({ ...selectedVariation, addons: validatedAddons })
    return validatedAddons?.every(addon => addon.error === false) // TODO: Is it needed?
  }

  function renderOption(addon) {
    // if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
    //   return (
    //     <RadioComponent
    //       options={addon.options}
    //       onPress={onSelectOption.bind(this, addon)}
    //     />
    //   )
    // } else {
    return (
      <CheckComponent
        options={[addon]}
        // options={addon.options}
        onPress={onSelectOption.bind(this, addon)}
      />
    )
    // }
  }

  return (
    <>
      <SafeAreaView style={styles().flex}>
        <View style={[styles().flex, styles(currentTheme).mainContainer]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
            style={styles().flex}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles().scrollViewContainer}>
              {!!food.image && (
                <ImageHeader
                  iconColor={iconColor}
                  iconSize={iconSize}
                  height={HEADER_MAX_HEIGHT}
                  iconBackColor={iconBackColor}
                  iconRadius={iconRadius}
                  iconTouchWidth={iconTouchWidth}
                  iconTouchHeight={iconTouchHeight}
                  image={food.image}
                />
              )}
              <View
                style={[
                  styles(currentTheme).subContainer,
                  {
                    flexGrow: 1,
                    zIndex: -1,
                    paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                    marginTop: HEADER_MIN_HEIGHT
                  }
                ]}>
                <HeadingComponent
                  title={food.title}
                  price={calculatePrice()}
                  desc={food.description}
                />
                {food.variations.length > 1 && (
                  <>
                    <View>
                      <RadioComponent
                        options={food.variations}
                        selected={selectedVariation}
                        onPress={onSelectVariation}
                      />
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          <CartComponent
            onPress={onPressAddToCart}
            disabled={validateButton()}
          />
        </View>
        <View
          style={{
            backgroundColor: currentTheme.themeBackground
          }}
        />
      </SafeAreaView>
    </>
  )
}

export default ItemDetail
