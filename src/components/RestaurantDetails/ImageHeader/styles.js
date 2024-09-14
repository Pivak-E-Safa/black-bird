import { StyleSheet, Dimensions } from 'react-native'
import { scale } from '../../../utils/scaling'
import { textStyles } from '../../../utils/textStyles'
import { alignment } from '../../../utils/alignment'
const { height } = Dimensions.get('window')

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1
    },
    mainContainer: {
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      shadowOpacity: 0.7,
      shadowOffset: {
        height: scale(1),
        width: 0
      },
      shadowRadius: scale(3),
      elevation: 5
    },
    touchArea: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,1)',
      borderRadius: scale(17),
      height: scale(34),
      width: scale(34),
    },
    fixedViewNavigation: {
      width: '100%',
      height: height * 0.07,
      justifyContent: 'center',
      zIndex: 1
    },
    fixedView: {
      flex: 1,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    fixedIcons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    fixedText: {
      width: '100%',
      top: "90%",
      // justifyContent: 'bottom',
      // flex: 1, // Ensures the container takes up the full space
      justifyContent: 'flex-end', // Aligns content at the bottom
      // alignItems: 'flex-start', // Aligns content to the left
      padding: 10 // Optional, adds padding if needed

    },
    message: {
      textAlign: 'left',
      top: 170,
      left: -40
    },
    deliveryBox: {
      color: props != null ? props.fontWhite : 'white',
      fontSize: scale(12),
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: props != null ? props.white : 'white',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: scale(5),
      ...alignment.PxSmall,
      ...alignment.MTsmall
    },
    ratingBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    // New Styling
    overlayContainer: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      // justifyContent: 'center',
      zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.15)',
      ...alignment.PRsmall,
      ...alignment.PLsmall
    },
    headerTitle: {
      ...textStyles.H5,
      ...textStyles.Bolder,
      color: props != null ? props.fontWhite : 'white',
      flex: 1,
      textAlign: 'center'
    },
    flatListStyle: {
      height: '100%',
      width: '100%',
      backgroundColor: props != null ? props.menuBar : 'white',
      zIndex: 2 // important
    },
    headerContainer: {
      height: '100%',
      backgroundColor: props != null ? props.menuBar : 'white',
      alignItems: 'center',
      justifyContent: 'center',
      ...alignment.PxSmall,
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    navbarImageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      width: 30,
      height: 30,
    },
    activeImage: {
      width: '80%',
      height: '80%',
      tintColor: props != null ? props.tagColor : 'black',
    },
    inactiveImage: {
      width: '80%',
      height: '80%',
      tintColor: props != null ? props.fontMainColor : 'black',
      borderColor: props != null ? props.tagColor : 'black',
    },
    activeHeader: {
      borderBottomWidth: scale(2),
      borderColor: props != null ? props.tagColor : 'red',
      padding: scale(0),
      height: '100%'
    },
    navbarTextContainer: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
export default styles
