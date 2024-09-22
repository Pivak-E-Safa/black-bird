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
  StatusBar,
  Platform,
  Dimensions,
  Linking
} from 'react-native'
import Animated from 'react-native-reanimated'
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
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import Analytics from '../../utils/analytics'
const { height } = Dimensions.get('screen')
const HEADER_MAX_HEIGHT = height * 0.30

function RestaurantDetails(props) {
  const navigation = useNavigation()
  const route = useRoute()
  const inset = useSafeAreaInsets()
  const propsData = route.params
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const menuImage = require('../../assets/JPG/menu.jpg')
  const restaurantImages = [
    require('../../assets/deals/deal1.jpg'),
    require('../../assets/deals/deal2.jpg'),
    require('../../assets/deals/deal3.jpg'),
    require('../../assets/deals/deal4.jpg')
  ]

  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [data, setData] = useState(0)
  const [loading, setLoading] = useState(false)
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
  }, [])

  const iconColor = currentTheme.iconColorPink
  const iconBackColor = currentTheme.themeBackgroundIcons
  const iconRadius = scale(15)
  const iconSize = scale(20)
  const iconTouchHeight = scale(30)
  const iconTouchWidth = scale(30)

  if (loading) {
    return (
      <Animated.View
        style={[
          styles().flex,
          {
            marginTop: inset.top,
            paddingBottom: inset.bottom,
            paddingTop: HEADER_MAX_HEIGHT,
            backgroundColor: currentTheme.headerMenuBackground
          }
        ]}>
        <ImageHeader
          iconColor={iconColor}
          iconSize={iconSize}
          height={HEADER_MAX_HEIGHT}
          opacity={opacity}
          iconBackColor={iconBackColor}
          iconRadius={iconRadius}
          iconTouchWidth={iconTouchWidth}
          iconTouchHeight={iconTouchHeight}
          headerTextFlex={headerTextFlex}
          topaBarData={[]}
          loading={loading}
        />

        <ImageSlider           
          images={restaurantImages} /> 
        <View
          style={[
            styles().navbarContainer,
            styles().flex,
            {
              paddingTop: HEADER_MAX_HEIGHT
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
        <Animated.View style={[styles().flex, { height: '100%' }]}>
          <ImageHeader
            iconColor={iconColor}
            iconSize={iconSize}
            height={HEADER_MAX_HEIGHT}
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            restaurantName={propsData.name}
            restaurantImage={propsData.image}
            topaBarData={deals}
            selectedLabel={selectedLabel}
          />
          <View style={{
              flexGrow: 1,
              zIndex: -1,
              paddingTop: '40%',
              marginTop: '30%'
            }}>
            <ImageSlider
              images={restaurantImages}
            />

            <View style={styles().bottomContainerParent}>
              <TouchableOpacity
                style={[styles().card, styles().menu]}
                onPress={() =>
                  navigation.navigate('Restaurant', { id: restaurantId, data: data })
                }>
                <Animated.Image
                  resizeMode="cover"
                  source={menuImage}
                  style={[
                    styles().flex,
                    {
                      borderRadius: 10,
                      width: '100%',
                      height: 'auto',
                      borderWidth: 3,
                      borderColor: '#FFB300',
                      borderRadius: 10,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.6,
                      shadowRadius: 9,
                      elevation: 6
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
                        onPress={() => Linking.openURL(restaurant.instagram)}>
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
                        onPress={() => Linking.openURL(restaurant.facebook)}>
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
                        onPress={() => Linking.openURL(restaurant.googleMaps)}>
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
                        onPress={() => Linking.openURL(restaurant.whatsapp)}>
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
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

export default RestaurantDetails
