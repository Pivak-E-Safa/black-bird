import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      height: '100%',
      paddingTop: '10%',
    },
    safeAreaViewStyles: {
      flex: 1,
      backgroundColor:
        props !== null ? props.themeBackground : 'transparent'
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      backgroundColor: props !== null ? props.themeBackground : 'transparent',
      ...alignment.PTlarge
    },
    subContainer: {
      width: '85%',
      alignItems: 'center',
      height: '100%',
      marginTop: '20%'
    },
    alignItemsCenter: {
      alignItems: 'center'
    },
    marginTop10: {
      ...alignment.MTlarge
    },
    marginTop5: {
      ...alignment.MTmedium
    },
    marginTop3: {
      ...alignment.MTxSmall
    },
    loginBtn: {
      width: '40%',
      backgroundColor:
        props !== null ? props.buttonBackgroundPink : 'transparent',
      justifyContent: 'center',
      alignItems: 'center'
    },
    appleBtn: {
      width: '100%'
    },
    logoContainer: {
      width: 120,
      height: 130,
      alignSelf: 'center'
    },
    form: {
      width: '100%',
      ...alignment.MTxSmall
    },
    textField: {
      borderColor: '#efefef',
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#fff',
      padding: 14,
      shadowColor: props !== null ? props.fontSecondColor : '#545454',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      ...alignment.MTlarge
    },
    errorInput: {
      backgroundColor: props !== null ? props.errorInputBack : '#F7E7E5',
      borderColor: props !== null ? props.errorInputBorder : '#DB4A39'
    },
    error: {
      ...alignment.MTxSmall
    },
    passwordField: {
      display: 'flex',
      flexDirection: 'row'
    },
    passwordInput: {
      width: '100%'
    },
    eyeBtn: {
      marginTop: 32,
      marginLeft: -40,
      elevation: 999
    },
    btn: {
      position: 'relative',
      // marginTop: '55%',
      width: '60%',
      alignItems: 'center',
      backgroundColor: props !== null ? props.iconColorPink : '#000',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 10
    },
    headerLeftIcon: {
      ...alignment.PLsmall
    },
    headerRightIcon: {
      ...alignment.PRsmall
    }
  })
export default styles
