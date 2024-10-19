import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { callNumber } from '../../utils/callNumber'
import { Alert } from 'react-native'
import { useUserContext } from '../../context/User'
export const useChatScreen = ({ navigation, route }) => {
  const { id: orderId } = route.params
  console.log(orderId)
  const { profile } = useUserContext()

  useEffect(() => {
    if (chatData) {
      setMessages(
        chatData.chat.map(message => ({
          id: message.id,
          text: message.message,
          createdAt: message.createdAt,
          user: {
            id: message.user.id,
            name: message.user.name
          }
        }))
      )
    }
  }, [chatData])

  function onCompleted({ sendChatMessage: messageResult }) {
    if (!messageResult?.success) {
      Alert.alert('Error', messageResult.message)
    }
  }
  function onError(error) {
    Alert.alert('Error', error.message)
  }
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState(null)
  const [image, setImage] = useState([])
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: currentTheme.headerMenuBackground
      },
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: currentTheme.iconColorPink
      },
      headerLeft: () => (
        <Ionicons
          name="chevron-back"
          size={20}
          color={currentTheme.white}
          style={{
            marginLeft: 10,
            backgroundColor: currentTheme.black,
            padding: 7,
            borderRadius: 10,
            overflow: 'hidden'
          }}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <FontAwesome5
          name="phone-alt"
          size={20}
          color={currentTheme.white}
          style={{
            marginRight: 10,
            backgroundColor: currentTheme.black,
            padding: 7,
            borderRadius: 10,
            overflow: 'hidden'
          }}
          onPress={() => callNumber('+923159499378')}
        />
      ),
      headerTitle: 'Contact your Rider'
    })
  }, [navigation])
  const onSend = () => {
    send({
      variables: {
        orderId: orderId,
        messageInput: {
          message: inputMessage,
          user: {
            id: profile.id,
            name: profile.name
          }
        }
      }
    })
    setInputMessage(null)
    setImage([])
  }

  return {
    messages,
    onSend,
    currentTheme,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile
  }
}
