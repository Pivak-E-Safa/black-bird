import React, { useContext } from 'react'
import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useNavigation } from '@react-navigation/native'
import { DAYS } from '../../../utils/enums'
import Animated from 'react-native-reanimated'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import {
  BorderlessButton,
  TouchableOpacity
} from 'react-native-gesture-handler'

const AnimatedIon = Animated.createAnimatedComponent(Ionicons)
const AnimatedBorderless = Animated.createAnimatedComponent(BorderlessButton)

function ImageTextCenterHeader(props, ref) {
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const detailsImage = require('../../../assets/JPG/restaurant-detail.jpg')
  const customerName = 'Ghazwa'

  const aboutObject = {
    latitude: props.restaurant ? props.restaurant.location.latitude : '',
    longitude: props.restaurant ? props.restaurant.location.longitude : '',
    address: props.restaurant ? props.restaurant.address : '',
    restaurantName: props.restaurant ? props.restaurant.name : '...',
    restaurantImage: props.restaurant ? props.restaurant.image : '...',
    contactNumber: props.restaurant ? props.restaurant.contactNumber : '...',
    whatsappNumber: props.restaurant ? props.restaurant.whatsappNumber : '...',
    deliveryTime: props.restaurant ? props.restaurant.deliveryTime : '...',
    isAvailable: props.restaurant ? props.restaurant.isAvailable : true,
    openingTimes: props.restaurant
      ? props.restaurant.openingTimes
      : { startTime: [0, 0], endTime: [0, 0], title: 'CLOSED' },
    isOpen: () => {
      if (!props.restaurant) return true
      const date = new Date()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return (
        hours >= Number(props.restaurant.openingTimes.startTime[0]) &&
        minutes >= Number(props.restaurant.openingTimes.startTime[1]) &&
        hours <= Number(props.restaurant.openingTimes.endTime[0]) &&
        minutes <= Number(props.restaurant.openingTimes.endTime[1])
      )
    }
  }

  return (
    <Animated.View
      style={[
        styles(currentTheme).mainContainer,
        {
          height: props.height,
          backgroundColor: props.loading
            ? 'transparent'
            : currentTheme.headerBackground
        }
      ]}>
      <Animated.View style={{ height: props.height }}>
        <Animated.Image
          resizeMode="cover"
          source={detailsImage}
          style={[
            styles().flex,
            {
              opacity: props.opacity,
              borderRadius: 10,
              width: '100%',
              height: 'auto'
            }
          ]}
        />
        <Animated.View style={styles().overlayContainer}>
          <View style={styles().fixedViewNavigation}>
            <View style={styles().fixedIcons}>
              <AnimatedBorderless
                activeOpacity={0.7}
                rippleColor={currentTheme.rippleColor}
                style={[
                  styles().touchArea,
                  {
                    backgroundColor: props.iconBackColor,
                    borderRadius: props.iconRadius,
                    height: props.iconTouchHeight,
                    width: props.iconTouchWidth,
                  }
                ]}
                onPress={() => {
                  navigation.toggleDrawer()
                }}>
                <AnimatedIon
                  name="ios-menu"
                  size={16}
                  style={styles().leftIconPadding}
                  color={props.iconColor}
                />
              </AnimatedBorderless>
              <Animated.View
                style={[styles().fixedView, { opacity: props.opacity }]}>
                <View style={[styles().fixedText, styles().message]}>
                  <TextDefault bolder H4 textColor={currentTheme.fontWhite}>
                    {`Welcome ${customerName},`}
                  </TextDefault>
                  <TextDefault H5 textColor={currentTheme.fontWhite}>
                    {'Got an Umbrella?'}
                  </TextDefault>
                  <TextDefault H5 textColor={currentTheme.fontWhite}>
                    {"'cause it's about to rain cheese!"}
                  </TextDefault>
                </View>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default React.forwardRef(ImageTextCenterHeader)
