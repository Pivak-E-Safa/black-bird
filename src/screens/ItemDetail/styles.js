import { StyleSheet } from 'react-native'
import { alignment } from '../../utils/alignment'

const styles = (props = null) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: props != null ? props.buttonBackground : 'black'
    },
    mainContainer: {
      backgroundColor: props !== null ? props.themeBackground : '#fefefe'
    },
    scrollViewContainer: {
      width: '100%',
      height: '100%'
    },
    subContainer: {
      width: '95%',
      alignSelf: 'center',
      ...alignment.PTsmall,
    },
    line: {
      width: '100%',
      height: StyleSheet.hairlineWidth,
      ...alignment.MBsmall,
      backgroundColor: props !== null ? props.horizontalLine : 'black'
    }
  })
export default styles
