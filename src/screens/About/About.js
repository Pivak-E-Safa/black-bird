import React, { useContext, useEffect } from 'react'
import { View } from 'react-native'
import { EvilIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { scale } from '../../utils/scaling'
import ImageHeader from '../../components/About/Header'
import styles from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import TextError from '../../components/Text/TextError/TextError'
import { alignment } from '../../utils/alignment'
import { mapStyle } from '../../utils/mapStyle'
import CustomMarker from '../../assets/SVG/imageComponents/CustomMarker'
import Analytics from '../../utils/analytics'

function About(props) {
  const { restaurantObject } = props.route.params
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const Reviews = restaurantObject.reviews || []
  const RestAbout = {
    name: restaurantObject.name,
    address: restaurantObject.address,
    contactNumber: restaurantObject.contactNumber,
    whatsappNumber: restaurantObject.whatsappNumber,

    map: {
      latitude: Number(restaurantObject.latitude),
      longitude: Number(restaurantObject.longitude),
      latitudeDelta: 0.0022,
      longitudeDelta: 0.0021
    }
  }

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ABOUT)
    }
    Track()
  }, [])
  function AboutTab() {
    return (
      <View style={styles().mapMainContainer}>
        <View style={[styles().inlineFloat, styles().MB15]}>
          <Ionicons
            name="location-outline"
            size={scale(22)}
            color={currentTheme.iconColorPink}
            style={styles().width10}
          />
          <TextDefault
            style={styles().width90}
            H5
            bold
            textColor={currentTheme.fontMainColor}>
            {RestAbout.address}
          </TextDefault>
        </View>
        <View style={[styles().inlineFloat, styles().MB15]}>
          <AntDesign
            name="phone"
            size={scale(20)}
            color={currentTheme.iconColorPink}
            style={styles().width10}
          />
          <TextDefault
            style={styles().width90}
            H5
            bold
            textColor={currentTheme.fontMainColor}>
            {RestAbout.contactNumber}
          </TextDefault>
        </View>
        <View style={[styles().inlineFloat, styles().MB15]}>
          <Ionicons
            name="logo-whatsapp"
            size={scale(20)}
            color={currentTheme.iconColorPink}
            style={styles().width10}
          />
          <TextDefault
            style={styles().width90}
            H5
            bold
            textColor={currentTheme.fontMainColor}>
            {RestAbout.whatsappNumber}
          </TextDefault>
        </View>
        <View style={[styles().inlineFloat, alignment.MBxSmall]}>
          <Feather
            name="clock"
            size={scale(20)}
            color={currentTheme.iconColorPink}
            style={styles().width10}
          />
          <TextDefault H5 bold textColor={currentTheme.fontMainColor}>
            {restaurantObject.openingTimes.title}
          </TextDefault>
        </View>
        <View style={styles().mapContainer}>
          <MapView
            style={[styles().flex, {borderRadius: 10}]}
            scrollEnabled={false}
            zoomEnabled={false}
            zoomControlEnabled={false}
            rotateEnabled={false}
            cacheEnabled={false}
            initialRegion={RestAbout.map}
            customMapStyle={
              themeContext.ThemeValue === 'Dark' ? mapStyle : null
            }
            provider={PROVIDER_GOOGLE}></MapView>
          <View
            style={{
              width: 50,
              height: 50,
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 1,
              translateX: -25,
              translateY: -25,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ translateX: -25 }, { translateY: -25 }]
            }}>
            <CustomMarker
              width={40}
              height={40}
              transform={[{ translateY: -20 }]}
              translateY={-20}
            />
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={[
        styles().flex,
        { backgroundColor: currentTheme.headerMenuBackground }
      ]}>
      <ImageHeader
        iconColor={currentTheme.iconColorPink}
        svgNameL="leftArrow"
        restaurantImage={restaurantObject.restaurantImage}
        iconBackColor={currentTheme.headerBackground}
      />
      <View style={[styles().flex, styles(currentTheme).mainContainer]}>
        <View style={styles(currentTheme).restaurantContainer}>
          <TextDefault
            numberOfLines={1}
            style={styles().restaurantTitle}
            textColor={currentTheme.fontMainColor}
            H4
            B700
            bolder>
            {restaurantObject.restaurantName}
          </TextDefault>
        </View>
        <View style={[styles(currentTheme).line]} />

        {AboutTab()}
      </View>
    </SafeAreaView>
  )
}

export default About
