import 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { SavedMoviesProvider } from '@/context/SavedMoviesContext'
import { StatusBar } from 'react-native'

export default function RootLayout() {
  return (
    <>
    <StatusBar hidden={true} />
    <AuthProvider>
      
      <SavedMoviesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0f0D23' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="movie/[id]" />
          <Stack.Screen 
            name="history" 
            options={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              presentation: 'card',
              animation: 'ios_from_right',
              contentStyle: { backgroundColor: '#0f0D23' },
            }}
          />
        </Stack>
      </SavedMoviesProvider>
    </AuthProvider>
    </>
  )
}
