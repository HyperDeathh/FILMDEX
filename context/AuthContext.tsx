import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = '@filmdex_auth_user'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from storage on mount
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API login - in real app, this would be an API call
      // For demo purposes, we'll accept any valid email/password format
      if (!email.includes('@') || password.length < 4) {
        return false
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        joinDate: new Date().toISOString()
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      if (!email.includes('@') || password.length < 4 || !name.trim()) {
        return false
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email,
        joinDate: new Date().toISOString()
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
      setUser(newUser)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = { ...user, ...updates }
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
