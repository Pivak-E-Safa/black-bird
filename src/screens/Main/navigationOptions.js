/* eslint-disable react/display-name */
import React from 'react'
import {
  View
} from 'react-native'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'

const navigationOptions = props => ({
  headerStyle: {
    backgroundColor: props.headerMenuBackground,
    borderBottomColor: props.headerMenuBackground,
    borderBottomWidth: 0,
    width: 0,
    height: 0
  },
  headerLeft: () => <View/>,
  headerTitle: headerProp => (<></>
)
})
export default navigationOptions
