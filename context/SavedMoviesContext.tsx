import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface SavedMovie {
  id: number
  title: string
  poster_path: string | null
  vote_average?: number
  release_date?: string
  savedAt: string
  mediaType: 'movie' | 'tv'
}

interface SavedMoviesContextType {
  savedMovies: SavedMovie[]
  watchedMovies: SavedMovie[]
  isLoading: boolean
  addMovie: (movie: Omit<SavedMovie, 'savedAt'>) => Promise<void>
  removeMovie: (id: number) => Promise<void>
  isMovieSaved: (id: number) => boolean
  toggleSave: (movie: Omit<SavedMovie, 'savedAt'>) => Promise<void>
  addToHistory: (movie: Omit<SavedMovie, 'savedAt'>) => Promise<void>
  removeFromHistory: (id: number) => Promise<void>
  isMovieWatched: (id: number) => boolean
  clearAll: () => Promise<void>
}

const SavedMoviesContext = createContext<SavedMoviesContextType | undefined>(
  undefined
)

const SAVED_MOVIES_KEY = '@filmdex_saved_movies'
const WATCHED_MOVIES_KEY = '@filmdex_watched_movies'

export const SavedMoviesProvider = ({ children }: { children: ReactNode }) => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([])
  const [watchedMovies, setWatchedMovies] = useState<SavedMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load saved movies from storage on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [saved, watched] = await Promise.all([
        AsyncStorage.getItem(SAVED_MOVIES_KEY),
        AsyncStorage.getItem(WATCHED_MOVIES_KEY)
      ])

      if (saved) setSavedMovies(JSON.parse(saved))
      if (watched) setWatchedMovies(JSON.parse(watched))
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Failed to save to ${key}:`, error)
    }
  }

  const addMovie = async (movie: Omit<SavedMovie, 'savedAt'>) => {
    const newMovie: SavedMovie = {
      ...movie,
      savedAt: new Date().toISOString()
    }

    const updated = [newMovie, ...savedMovies.filter(m => m.id !== movie.id)]
    setSavedMovies(updated)
    await saveToStorage(SAVED_MOVIES_KEY, updated)
  }

  const removeMovie = async (id: number) => {
    const updated = savedMovies.filter(m => m.id !== id)
    setSavedMovies(updated)
    await saveToStorage(SAVED_MOVIES_KEY, updated)
  }

  const isMovieSaved = (id: number): boolean => {
    return savedMovies.some(m => m.id === id)
  }

  const toggleSave = async (movie: Omit<SavedMovie, 'savedAt'>) => {
    if (isMovieSaved(movie.id)) {
      await removeMovie(movie.id)
    } else {
      await addMovie(movie)
    }
  }

  const addToHistory = async (movie: Omit<SavedMovie, 'savedAt'>) => {
    const newMovie: SavedMovie = {
      ...movie,
      savedAt: new Date().toISOString()
    }

    const updated = [newMovie, ...watchedMovies.filter(m => m.id !== movie.id)]
    setWatchedMovies(updated)
    await saveToStorage(WATCHED_MOVIES_KEY, updated)
  }

  const removeFromHistory = async (id: number) => {
    const updated = watchedMovies.filter(m => m.id !== id)
    setWatchedMovies(updated)
    await saveToStorage(WATCHED_MOVIES_KEY, updated)
  }

  const isMovieWatched = (id: number): boolean => {
    return watchedMovies.some(m => m.id === id)
  }

  const clearAll = async () => {
    setSavedMovies([])
    setWatchedMovies([])
    await AsyncStorage.multiRemove([SAVED_MOVIES_KEY, WATCHED_MOVIES_KEY])
  }

  return (
    <SavedMoviesContext.Provider
      value={{
        savedMovies,
        watchedMovies,
        isLoading,
        addMovie,
        removeMovie,
        isMovieSaved,
        toggleSave,
        addToHistory,
        removeFromHistory,
        isMovieWatched,
        clearAll
      }}
    >
      {children}
    </SavedMoviesContext.Provider>
  )
}

export const useSavedMovies = () => {
  const context = useContext(SavedMoviesContext)
  if (context === undefined) {
    throw new Error('useSavedMovies must be used within a SavedMoviesProvider')
  }
  return context
}
