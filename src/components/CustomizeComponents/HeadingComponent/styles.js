import { StyleSheet } from 'react-native'
import { alignment } from '../../../utils/alignment'
const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    flexDirection: 'row'
  },
  titleContainer: {
    width: '75%',
    ...alignment.PRxSmall,
    ...alignment.MTsmall,
    ...alignment.MBsmall
  },
  priceContainer: {
    width: '25%',
    justifyContent: 'center',
    ...alignment.MTsmall,
    ...alignment.MBsmall
  },
  descContainer: {
    width: '100%',
    ...alignment.MBsmall
  }
})
export default styles
