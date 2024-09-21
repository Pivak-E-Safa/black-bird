import { verticalScale, scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    MB15: {
      ...alignment.MBmedium
    },
    width10: {
      width: '10%'
    },
    width90: {
      width: '90%'
    },
    mapMainContainer: {
      flexGrow: 1,
      ...alignment.PTlarge,
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    inlineFloat: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%'
    },
    mapContainer: {
      height: '55%',
      backgroundColor: 'transparent',
      ...alignment.PTlarge,
    },
    mainContainer: {
      backgroundColor: props != null ? props.cartContainer : 'white'
    },
    restaurantContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: props != null ? props.themeBackground : 'white',
      ...alignment.Psmall
    },
    restaurantTitle: {
      width: '75%',
      ...alignment.PLxSmall
    },
    line: {
      width: '100%',
      borderBottomColor: props != null ? props.horizontalLine : 'lightgrey',
      borderBottomWidth: StyleSheet.hairlineWidth
    },
    timingContainer: {
      marginLeft: scale(30),
      marginBottom: scale(20)
    },
    timingRow: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  })
export default styles
