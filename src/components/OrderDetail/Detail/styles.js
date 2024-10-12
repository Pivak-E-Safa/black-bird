import { StyleSheet, Dimensions } from 'react-native'
import { fontStyles } from '../../../utils/fontStyles'
import { verticalScale } from '../../../utils/scaling'
const { width: WIDTH } = Dimensions.get('window')
export default StyleSheet.create({
  container: theme => ({
    alignItems: 'center',
    backgroundColor: theme !== null ? theme.headerBackground : 'transparent'
  }),
  line: theme => ({
    height: 1,
    width: '90%',
    backgroundColor: theme.secondaryText
  }),
  chatButton: theme => ({
    paddingVertical: 15,
    paddingHorizontal: 100,
    backgroundColor: theme.iconColorPink,
    fontFamily: fontStyles.FredokaLight,
    borderRadius: 20
  }),
  chatButtonText: theme => ({
    color: theme.white,
    fontFamily: fontStyles.FredokaBold,
    fontSize: 16,
  }),
  shadowBox: theme => ({
    elevation: 1,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: -verticalScale(2)
    },
    shadowOpacity: 0.5,
    shadowRadius: verticalScale(2),
    borderRadius: 20,
    backgroundColor: theme !== null ? theme.headerBackground : 'transparent'
  }),
  addressContainer: {
    paddingVertical: 5,
    width: WIDTH - 20,
    paddingLeft: 15
  },
  row: {
    paddingTop: 25,
    flexDirection: 'row'
  },
  addressText: { width: '50%' },
  itemsContainer: {
    width: WIDTH - 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
    margin: 20
  },
  line2: theme => ({
    marginVertical: 10,
    backgroundColor: theme.secondaryText,
    height: 1,
    width: '100%'
  }),
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
})
