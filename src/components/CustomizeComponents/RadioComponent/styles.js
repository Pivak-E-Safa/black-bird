import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'

const styles = StyleSheet.create({
  mainContainer: {
    top: 10,
    width: '100%',
    flexDirection: 'row',
    ...alignment.MBsmall
  },
  leftContainer: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightContainer: {
    width: '25%',
    justifyContent: 'center'
  }
})
export default styles
