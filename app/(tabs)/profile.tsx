import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { images } from '@/assets/images'
import { icons } from '@/assets/icons'
import { useAuth } from '@/context/AuthContext'
import { useSavedMovies } from '@/context/SavedMoviesContext'
import { useRouter } from 'expo-router'
import CustomAlert from '@/components/CustomAlert'

type AuthMode = 'login' | 'register'

const Profile = () => {
  const router = useRouter()
  const { user, isLoading, login, register, logout } = useAuth()
  const { savedMovies, watchedMovies } = useSavedMovies()

  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    actions: [] as any[]
  })

  const showAlert = (title: string, message: string, actions: any[] = [{ text: 'OK', style: 'default' }]) => {
    setAlertConfig({ title, message, actions })
    setAlertVisible(true)
  }

  const handleAuth = async () => {
    if (submitting) return
    setSubmitting(true)

    try {
      let success = false
      if (authMode === 'login') {
        success = await login(email, password)
        if (!success) {
          showAlert('Login Failed', 'Please check your email and password.')
        }
      } else {
        success = await register(name, email, password)
        if (!success) {
          showAlert('Registration Failed', 'Please fill all fields correctly.')
        }
      }

      if (success) {
        setName('')
        setEmail('')
        setPassword('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#ab8bff" />
      </View>
    )
  }

  // Logged in user profile
  if (user) {
    return (
      <View className="flex-1 bg-primary">
        <Image source={images.bg} className="absolute w-full z-0" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center pt-16 pb-6">
            <Image source={icons.logo} className="w-12 h-10 mb-6" />
            <Text className="text-2xl font-bold text-white">Profile</Text>
          </View>

          {/* Profile Card */}
          <View className="mx-5 bg-dark-200 rounded-3xl p-6 mb-6">
            {/* Avatar */}
            <View className="items-center mb-4">
              <View className="w-24 h-24 rounded-full bg-accent/20 items-center justify-center border-2 border-accent">
                <Text className="text-4xl text-accent font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>

            {/* User Info */}
            <Text className="text-xl font-bold text-white text-center mb-1">
              {user.name}
            </Text>
            <Text className="text-sm text-white/60 text-center mb-4">
              {user.email}
            </Text>

            {/* Stats Row */}
            <View className="flex-row justify-around mt-4 pt-4 border-t border-white/10">
              <View className="items-center">
                <Text className="text-2xl font-bold text-accent">
                  {savedMovies.length}
                </Text>
                <Text className="text-xs text-white/60 mt-1">Saved</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-accent">
                  {watchedMovies.length}
                </Text>
                <Text className="text-xs text-white/60 mt-1">Watched</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-accent">
                  {savedMovies.filter(m => m.mediaType === 'tv').length}
                </Text>
                <Text className="text-xs text-white/60 mt-1">Series</Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View className="mx-5 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              Account Info
            </Text>

            <View className="bg-dark-200 rounded-2xl overflow-hidden">
              <View className="flex-row items-center px-4 py-4 border-b border-white/10">
                <Image
                  source={icons.person}
                  className="w-5 h-5 mr-3"
                  tintColor="#ab8bff"
                />
                <View>
                  <Text className="text-xs text-white/50">Full Name</Text>
                  <Text className="text-white font-medium">{user.name}</Text>
                </View>
              </View>

              <View className="flex-row items-center px-4 py-4 border-b border-white/10">
                <Image
                  source={icons.search}
                  className="w-5 h-5 mr-3"
                  tintColor="#ab8bff"
                />
                <View>
                  <Text className="text-xs text-white/50">Email</Text>
                  <Text className="text-white font-medium">{user.email}</Text>
                </View>
              </View>

              <View className="flex-row items-center px-4 py-4">
                <Image
                  source={icons.star}
                  className="w-5 h-5 mr-3"
                  tintColor="#ab8bff"
                />
                <View>
                  <Text className="text-xs text-white/50">Member Since</Text>
                  <Text className="text-white font-medium">
                    {formatDate(user.joinDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mx-5 mb-6">
            <Text className="text-lg font-bold text-white mb-4">
              Quick Actions
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-dark-200 rounded-2xl p-4 items-center"
                onPress={() => router.push('/saved')}
              >
                <Image
                  source={icons.save}
                  className="w-6 h-6 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white text-sm font-medium">
                  Watchlist
                </Text>
                <Text className="text-white/50 text-xs">
                  {savedMovies.length} items
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-dark-200 rounded-2xl p-4 items-center"
                onPress={() =>
                  showAlert('Coming Soon', 'This feature is coming soon!')
                }
              >
                <Image
                  source={icons.star}
                  className="w-6 h-6 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white text-sm font-medium">Ratings</Text>
                <Text className="text-white/50 text-xs">Rate movies</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-dark-200 rounded-2xl p-4 items-center"
                onPress={() => router.push('/history')}
              >
                <Image
                  source={icons.play}
                  className="w-6 h-6 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white text-sm font-medium">History</Text>
                <Text className="text-white/50 text-xs">{watchedMovies.length} items</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <View className="mx-5">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500/20 border border-red-500/50 rounded-full py-4 items-center"
            >
              <Text className="text-red-400 font-semibold text-base">
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          actions={alertConfig.actions}
          onClose={() => setAlertVisible(false)}
        />
      </View>
    )
  }

  // Login/Register Form
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center pt-16 pb-8">
            <Image source={icons.logo} className="w-16 h-14 mb-6" />
            <Text className="text-3xl font-bold text-white mb-2">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text className="text-white/60 text-center px-10">
              {authMode === 'login'
                ? 'Sign in to access your saved movies and personalized recommendations'
                : 'Join us to save your favorite movies and discover new ones'}
            </Text>
          </View>

          {/* Form */}
          <View className="mx-5 bg-dark-200 rounded-3xl p-6">
            {authMode === 'register' && (
              <View className="mb-4">
                <Text className="text-white/70 text-sm mb-2">Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                  className="bg-dark-300 text-white rounded-xl px-4 py-3"
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="text-white/70 text-sm mb-2">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-dark-300 text-white rounded-xl px-4 py-3"
              />
            </View>

            <View className="mb-6">
              <Text className="text-white/70 text-sm mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry
                className="bg-dark-300 text-white rounded-xl px-4 py-3"
              />
            </View>

            <TouchableOpacity
              onPress={handleAuth}
              disabled={submitting}
              className="bg-accent rounded-full py-4 items-center mb-4"
            >
              {submitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-base">
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle Auth Mode */}
            <View className="flex-row justify-center items-center">
              <Text className="text-white/60">
                {authMode === 'login'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setAuthMode(authMode === 'login' ? 'register' : 'login')
                }
              >
                <Text className="text-accent font-semibold">
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View className="mx-5 mt-8">
            <Text className="text-lg font-bold text-white mb-4 text-center">
              Why Join?
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] bg-dark-200/50 rounded-2xl p-4 mb-3">
                <Image
                  source={icons.save}
                  className="w-8 h-8 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white font-medium">Save Movies</Text>
                <Text className="text-white/50 text-xs mt-1">
                  Keep track of what you want to watch
                </Text>
              </View>

              <View className="w-[48%] bg-dark-200/50 rounded-2xl p-4 mb-3">
                <Image
                  source={icons.star}
                  className="w-8 h-8 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white font-medium">Rate & Review</Text>
                <Text className="text-white/50 text-xs mt-1">
                  Share your opinions
                </Text>
              </View>

              <View className="w-[48%] bg-dark-200/50 rounded-2xl p-4">
                <Image
                  source={icons.search}
                  className="w-8 h-8 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white font-medium">Discover</Text>
                <Text className="text-white/50 text-xs mt-1">
                  Get personalized recommendations
                </Text>
              </View>

              <View className="w-[48%] bg-dark-200/50 rounded-2xl p-4">
                <Image
                  source={icons.play}
                  className="w-8 h-8 mb-2"
                  tintColor="#ab8bff"
                />
                <Text className="text-white font-medium">Watch History</Text>
                <Text className="text-white/50 text-xs mt-1">
                  Track what you ve seen
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        actions={alertConfig.actions}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  )
}

export default Profile
