import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'


const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState(null)

  const setTokenAsync = async token => {
    await AsyncStorage.setItem('token', token)
    setToken(token)
  }

  const setEmailAsync = async email => {
    await AsyncStorage.setItem('email', email)
    setEmail(email)
  }

  useEffect(() => {
    let isSubscribed = true
    ;(async() => {
      const token = await AsyncStorage.getItem('token')
      const email = await AsyncStorage.getItem('email')
      if (isSubscribed) {
        setToken(token);
        setEmail(email);
      }
    })()
    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ token, setToken, setTokenAsync, email, setEmail, setEmailAsync }}>
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
export default AuthContext
