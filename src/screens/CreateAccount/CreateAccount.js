import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import FdGoogleBtn from '../../ui/FdSocialBtn/FdGoogleBtn/FdGoogleBtn'
import FdEmailBtn from '../../ui/FdSocialBtn/FdEmailBtn/FdEmailBtn'
import Spinner from '../../components/Spinner/Spinner'
import * as AppleAuthentication from 'expo-apple-authentication'
import { alignment } from '../../utils/alignment'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useCreateAccount } from './useCreateAccount'
import i18n from '../../../i18n'
import navigationOptions from './screenOptions'

const CreateAccount = props => {
  const {
    loginButton,
    loginButtonSetter,
    loading,
    googleRequest,
    googlePromptAsync,
    themeContext,
    currentTheme,
    mutateLogin,
    navigateToLogin,
    openTerms,
    openPrivacyPolicy,
    navigation
  } = useCreateAccount()

  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        fontColor: currentTheme.fontMainColor,
        backColor: 'transparent',
        navigation: props.navigation
      })
    )
  }, [navigation, currentTheme])

  function renderGoogleAction() {
    return (
      <FdGoogleBtn
        loadingIcon={loading && loginButton === 'Google'}
        onPressIn={() => {
          loginButtonSetter('Google')
        }}
        disabled={!googleRequest}
        onPress={() => googlePromptAsync()}
      />
    )
  }

  function renderEmailAction() {
    return (
      <FdEmailBtn
        loadingIcon={loading && loginButton === 'Email'}
        onPress={() => {
          loginButtonSetter('Email')
          // eslint-disable-next-line no-unused-expressions
          navigateToLogin()
        }}
      />
    )
  }

  return (
    <View style={[styles().subContainer]}>
      <TextDefault
        H2
        bolder
        textColor={currentTheme.buttonBackgroundPink}
        style={{
          textAlign: 'center',
          ...alignment.MTlarge,
          ...alignment.MBlarge
        }}>
        {i18n.t('signUporSignIn')}
      </TextDefault>
      <View>
        <View style={styles().marginTop10}>{renderGoogleAction()}</View>
        <View
          style={[
            styles().marginTop5,
            { flexDirection: 'row', alignItems: 'center' }
          ]}>
          <View style={styles().line} />
          <View>
            <TextDefault H4 bolder style={{ width: 50, textAlign: 'center', color: currentTheme.iconColorPink }}>
              {i18n.t('or')}
            </TextDefault>
          </View>
          <View style={styles().line} />
        </View>
        <View style={styles().marginTop5}>{renderEmailAction()}</View>
      </View>
    </View>
  )
}
export default CreateAccount
