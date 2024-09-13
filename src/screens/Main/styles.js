import { scale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { fontStyles } from '../../utils/fontStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props != null ? props.iconColorPink : '#FF8C00',
    },
    screenBackground: {
      backgroundColor: props != null ? props.themeBackground : '#FFF'
    },
    mainContentContainer: {
      width: '100%',
      height: '100%',
      alignSelf: 'center'
    },
    ML20: {
      ...alignment.MLlarge
    },
    PB10: {
      ...alignment.MBsmall
    },
    mL5p: {
      ...alignment.MLsmall
    },
    addressbtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PLmedium,
      ...alignment.PRmedium
    },
    addressContainer: {
      width: '100%',
      borderBottomWidth: 0,
      borderBottomColor: props != null ? props.iconColorPink : 'transparent',
      ...alignment.PTmedium,
      ...alignment.PBmedium
    },
    addressSubContainer: {
      width: '90%',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center'
    },
    content: {
      ...alignment.PTlarge
    },
    modal: {
      backgroundColor: props != null ? props.cartContainer : '#FFF',
      borderTopEndRadius: scale(20),
      borderTopStartRadius: scale(20),
      shadowOpacity: 0
    },
    addressTextContainer: {
      ...alignment.PLlarge,
      ...alignment.PRlarge,
      ...alignment.PTxSmall
    },
    addressTick: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    handle: {
      width: 150,
      backgroundColor: '#b0afbc'
    },
    relative: {
      position: 'relative'
    },
    placeHolderContainer: {
      backgroundColor: props != null ? props.cartContainer : '#B8B8B8',
      borderRadius: 3,
      elevation: 3,
      marginBottom: 12,
      padding: 12
    },
    height200: {
      height: 200
    },
    placeHolderFadeColor: {
      backgroundColor: props != null ? props.fontSecondColor : '#B8B8B8'
    },
    dropdownContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: '75%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    dropdown: {
      width: 160,
      height: 40,
      shadowRadius: 4,
      elevation: 5,
      paddingHorizontal: 10,
      backgroundColor: '#FF8C00', // Transparent background
      borderColor: '#FFA500', // Orange border color
      borderWidth: 1, // Slightly thicker border for better visibility
      borderRadius: 8,
      shadowColor: '#000', // Orange shadow color
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3, // Adjust shadow opacity for better 3D effect
    },
    dropdownContent: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    text: {
      color: 'rgba(255, 255, 255, 10)',
      fontSize: 18,
      alignItems: 'center', 
      textAlign: 'center',
      width: '100%',
      fontFamily: fontStyles.FredokaBold
    },
    placeholder: {
      color: 'rgba(255, 255, 255)', 
    },
    fingerPrintButton: {
      position: 'absolute', 
      top: '70%', 
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center', 
    }
  })
export default styles
