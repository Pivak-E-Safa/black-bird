import React, { useEffect, useContext } from 'react'
import { View, Dimensions, Image } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { linkToMapsApp } from '../../utils/links'
import { mapStyle } from '../../utils/mapStyle'

const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 }

const PickUpMap = ({ deliveryAddress, pickupAddress }) => {
  const themeContext = useContext(ThemeContext)
  let map = null

  useEffect(() => {
    const destination = {
      latitude: parseFloat(pickupAddress.location.latitude),
      longitude: parseFloat(pickupAddress.location.longitude)
    }
    const origin = {
      latitude: parseFloat(deliveryAddress?.location.latitude),
      longitude: parseFloat(deliveryAddress?.location.longitude)
    }
    fitMarkers([origin, destination])
  }, [])
  const fitMarkers = markers => {
    map.fitToCoordinates(markers, {
      edgePadding: DEFAULT_PADDING,
      animated: true
    })
  }

  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
        height: scale(200),
        marginTop: scale(20)
      }}>
      <MapView
        ref={ref => {
          map = ref
        }}
        customMapStyle={themeContext.ThemeValue === 'Dark' ? mapStyle : null}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: parseFloat(pickupAddress.location.latitude),
          latitudeDelta: LATITUDE_DELTA,
          longitude: parseFloat(pickupAddress.location.longitude),
          longitudeDelta: LONGITUDE_DELTA
        }}
        onPress={() => {
          linkToMapsApp(
            {
              latitude: pickupAddress.location.latitude,
              longitude: pickupAddress.location.longitude
            },
            pickupAddress.label
          )
        }}
        provider={PROVIDER_GOOGLE}>
        <Marker
          title="PickUp Address"
          coordinate={{
            latitude: parseFloat(pickupAddress.location.latitude),
            longitude: parseFloat(pickupAddress.location.longitude)
          }}>
          <Image
            style={{ width: scale(30), height: scale(30) }}
            source={require('../../assets/images/drop.png')}
          />
        </Marker>
      </MapView>
    </View>
  )
}

export default PickUpMap
