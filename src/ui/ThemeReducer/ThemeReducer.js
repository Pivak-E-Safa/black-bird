import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeReducer = (state, action) => {
  switch (action.type) {
    case 'Dark':
      AsyncStorage.setItem('theme', 'Dark')
      return 'Dark'
    default:
      AsyncStorage.setItem('theme', 'Dark')
      return 'Dark'
  }
}
export default ThemeReducer
