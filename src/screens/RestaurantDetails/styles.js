import { scale, verticalScale } from '../../utils/scaling'
import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'
import { textStyles } from '../../utils/textStyles'
import { fontStyles } from '../../utils/fontStyles'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props != null ? props.buttonBackground : 'black'
    },
    navbarContainer: {
      paddingBottom: 0,
      height: '5%',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: verticalScale(2)
      },
      shadowOpacity: 0.6,
      shadowRadius: verticalScale(2),
      zIndex: 1
    },
    sectionHeaderText: {
      ...alignment.PLlarge,
      ...alignment.PTsmall,
      ...alignment.PBsmall
    },
    deal: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...alignment.PTlarge,
      ...alignment.PBlarge,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: props != null ? props.cartContainer : 'white',
      borderRadius: 10,
      ...alignment.PRsmall,
      ...alignment.PLsmall,
    },
    column: {
      width: '50%',
    },
    dealSection: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: props != null ? props.cartContainer : 'white',
      ...alignment.PLsmall,
      ...alignment.PRsmall,
    },
    dealDescription: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: 'transparent',
      ...alignment.PRxSmall
    },
    dealPrice: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      overflow: 'hidden'
    },
    priceText: {
      maxWidth: '100%',
      ...alignment.MRxSmall
    },
    listSeperator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: props != null ? props.lightHorizontalLine : 'grey'
    },
    sectionSeparator: {
      width: '100%',
      height: scale(15),
      backgroundColor: props != null ? props.themeBackground : 'white'
    },
    sliderContainer: {
      position: 'relative',
      display: 'block',
      width: '100%',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: scale(40),
      backgroundColor: props != null ? props.themeBackground : 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: props != null ? props.buttonBackgroundPink : 'red',
      height: '100%',
      width: '100%',
      ...alignment.PLsmall,
      ...alignment.PRsmall
    },
    buttonText: {
      width: '30%'
    },
    buttonTextRight: {
      width: '35%'
    },
    buttontLeft: {
      width: '35%',
      height: '50%',
      justifyContent: 'center'
    },
    buttonLeftCircle: {
      backgroundColor: props != null ? props.buttonTextPink : 'white',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonTextLeft: {
      ...textStyles.Bold,
      ...textStyles.Center,
      ...textStyles.Smaller,
      backgroundColor: 'transparent',
      color: props != null ? props.buttonBackground : 'black'
    },
    triangleCorner: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: scale(25),
      borderTopWidth: scale(20),
      borderLeftColor: 'transparent',
      borderTopColor: props != null ? props.tagColor : 'red'
    },
    tagText: {
      width: scale(15),
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 1,
      right: 0,
      textAlign: 'center'
    },
    bottomContainerParent: {
      display: 'flex',
      flexDirection: 'row',
      height: '60%',
      ...alignment.PLsmall,
      ...alignment.PRsmall,
    },
    menu: {
      width: '50%',
      paddingRight: 5
    },
    video: {
      backgroundColor: '#EC1E24',
      marginBottom: 5,
      flex: 1,
    },
    videoText: {
      color: 'white',
      fontSize: 22,
      fontFamily: fontStyles.FredokaBold,
      textAlign: 'center',
      marginTop: 15
    },
    menuText: {
      position: 'absolute',
      color: 'white',
      fontSize: 25,
      fontFamily: fontStyles.FredokaBold,
      textAlign: 'center',
      marginTop: 60,
      marginLeft: '27%'
    },
    videoIcon: {
      textAlign: 'center',
      paddingTop: 10
    },
    about: {
      backgroundColor: '#4BB653',
      marginTop: 5,
      flex: 1,
    },
    bottomContainerChild: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      height: '100%',
      paddingLeft: 5
    },
    socialContainer: {
      flexDirection: 'column',  // Stack rows vertically
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 7,
    },
    row: {
      flexDirection: 'row',    // Display items in a row
      justifyContent: 'space-around',  // Space between icons
      alignItems: 'center',
      marginBottom: 15,         // Add margin between rows
    },
    iconWrapper: {
      marginHorizontal: 10,     // Add some horizontal space between icons
    },
    socialIcon: {
      height: 30
    },
    card: {
      width: '100%',
      height: '100%',
      borderWidth: 2,
      borderRadius: 10
    },
  })
export default styles
