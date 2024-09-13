/* eslint-disable react/display-name */
import React from 'react'
import { LeftButton } from '../../components/Header/HeaderIcons/HeaderIcons'
import SelectedLocation from '../../components/Main/Location/Location'
import { alignment } from '../../utils/alignment'

const navigationOptions = props => ({
  headerStyle: {
    backgroundColor: props.headerMenuBackground,
    borderBottomColor: props.headerMenuBackground,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: props.fontMainColor
  },
  headerTitleContainerStyle: {
    alignItems: 'flex-start',
    ...alignment.MLxSmall
  },
  headerTitleAlign: 'left',
  headerLeft: () => <LeftButton iconColor={'rgba(0, 0, 0, 0.5)'} />,
  headerTitle: headerProp => (<></>)
})
export default navigationOptions
