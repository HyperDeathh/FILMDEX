import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { images } from '@/assets/images'
import { icons } from '@/assets/icons'
import { useSavedMovies, SavedMovie } from '@/context/SavedMoviesContext'
import { useAuth } from '@/context/AuthContext'
import MovieCard from '@/components/MovieCard'
import { useRouter } from 'expo-router'
import CustomAlert from '@/components/CustomAlert'
import { responsive } from '@/utils/responsive'

type FilterType = 'all' | 'movie' | 'tv'
type SortType = 'recent' | 'title' | 'rating'

const Saved = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { savedMovies, isLoading, removeMovie, clearAll, addToHistory, removeFromHistory, isMovieWatched } = useSavedMovies()

  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('recent')

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

  const handleClearAll = () => {
    if (savedMovies.length === 0) return

    showAlert(
      'Clear All',
      'Are you sure you want to remove all saved movies?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll }
      ]
    )
  }

  const handleRemove = (movie: SavedMovie) => {
    showAlert(
      'Remove Movie',
      `Remove "${movie.title}" from your saved list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeMovie(movie.id)
        }
      ]
    )
  }

  // Filter and sort movies
  const filteredMovies = savedMovies
    .filter(movie => {
      if (filter === 'all') return true
      return movie.mediaType === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'rating':
          return (b.vote_average ?? 0) - (a.vote_average ?? 0)
        case 'recent':
        default:
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      }
    })

  const renderFilterChip = (type: FilterType, label: string) => {
    const isActive = filter === type
    return (
      <TouchableOpacity
        onPress={() => setFilter(type)}
        className={`px-4 py-2 rounded-full mr-2 ${
          isActive ? 'bg-accent' : 'bg-dark-200 border border-white/30'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            isActive ? 'text-black' : 'text-white'
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderSortChip = (type: SortType, label: string) => {
    const isActive = sortBy === type
    return (
      <TouchableOpacity
        onPress={() => setSortBy(type)}
        className={`px-3 py-1.5 rounded-lg mr-2 ${
          isActive ? 'bg-accent/30 border border-accent' : 'bg-dark-300'
        }`}
      >
        <Text
          className={`text-xs ${isActive ? 'text-accent' : 'text-white/60'}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderHeader = () => (
    <View className="px-5 pt-16 pb-4">
      {/* Logo & Title */}
      <View className="items-center mb-6">
        <Image source={icons.logo} className="w-12 h-10 mb-4" />
        <Text className="text-2xl font-bold text-white">My Watchlist</Text>
        <Text className="text-white/60 text-sm mt-1">
          {savedMovies.length} {savedMovies.length === 1 ? 'item' : 'items'}{' '}
          saved
        </Text>
      </View>

      {/* Filter Chips */}
      <View className="flex-row mb-4">
        {renderFilterChip('all', 'All')}
        {renderFilterChip('movie', 'Movies')}
        {renderFilterChip('tv', 'Series')}
      </View>

      {/* Sort Options */}
      <View className="flex-row items-center mb-4">
        <Text className="text-white/50 text-xs mr-2">Sort by:</Text>
        {renderSortChip('recent', 'Recent')}
        {renderSortChip('title', 'Title')}
        {renderSortChip('rating', 'Rating')}
      </View>

      {/* Clear All Button */}
      {savedMovies.length > 0 && (
        <TouchableOpacity onPress={handleClearAll} className="self-end mb-2">
          <Text className="text-red-400 text-sm">Clear All</Text>
        </TouchableOpacity>
      )}

      {/* Results Count */}
      {filteredMovies.length > 0 &&
        filteredMovies.length !== savedMovies.length && (
          <Text className="text-white/50 text-sm mb-2">
            Showing {filteredMovies.length} of {savedMovies.length}
          </Text>
        )}
    </View>
  )

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#ab8bff" />
        </View>
      )
    }

    // Check if user is not logged in
    if (!user) {
      return (
        <View className="flex-1 justify-center items-center px-10 py-20">
          <View className="bg-dark-200/50 rounded-full p-6 mb-6">
            <Image
              source={icons.person}
              className="w-16 h-16"
              tintColor="#ab8bff"
            />
          </View>
          <Text className="text-xl font-bold text-white text-center mb-2">
            Sign In to Save
          </Text>
          <Text className="text-white/60 text-center mb-6">
            Create an account or sign in to start saving your favorite movies
            and series.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            className="bg-accent rounded-full px-8 py-3"
          >
            <Text className="text-black font-semibold">Go to Profile</Text>
          </TouchableOpacity>
        </View>
      )
    }

    // No saved movies
    if (savedMovies.length === 0) {
      return (
        <View className="flex-1 justify-center items-center px-10 py-20">
          <View className="bg-dark-200/50 rounded-full p-6 mb-6">
            <Image
              source={icons.save}
              className="w-16 h-16"
              tintColor="#ab8bff"
            />
          </View>
          <Text className="text-xl font-bold text-white text-center mb-2">
            Your Watchlist is Empty
          </Text>
          <Text className="text-white/60 text-center mb-6">
            Start exploring and save movies or series you want to watch later.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/')}
            className="bg-accent rounded-full px-8 py-3"
          >
            <Text className="text-black font-semibold">Explore Movies</Text>
          </TouchableOpacity>
        </View>
      )
    }

    // Filter returned no results
    return (
      <View className="flex-1 justify-center items-center px-10 py-20">
        <View className="bg-dark-200/50 rounded-full p-6 mb-6">
          <Image
            source={icons.search}
            className="w-16 h-16"
            tintColor="#ab8bff"
          />
        </View>
        <Text className="text-xl font-bold text-white text-center mb-2">
          No {filter === 'movie' ? 'Movies' : 'Series'} Found
        </Text>
        <Text className="text-white/60 text-center mb-6">
          You haven't saved any {filter === 'movie' ? 'movies' : 'series'} yet.
        </Text>
        <TouchableOpacity
          onPress={() => setFilter('all')}
          className="bg-accent rounded-full px-8 py-3"
        >
          <Text className="text-black font-semibold">Show All</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderSavedItem = ({ item }: { item: SavedMovie }) => {
    const imageUri = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/600x400/1a1a1a/ffffff.png'

    const savedDate = new Date(item.savedAt)
    const formattedDate = savedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    return (
      <TouchableOpacity
        className="flex-row bg-dark-200 rounded-2xl p-3 mb-3 mx-5"
        onPress={() => router.push(`/movie/${item.id}`)}
        activeOpacity={0.8}
      >
        {/* Poster */}
        <Image
          source={{ uri: imageUri }}
          className="w-20 h-28 rounded-xl"
          resizeMode="cover"
        />

        {/* Info */}
        <View className="flex-1 ml-4 justify-between py-1">
          <View>
            <Text className="text-white font-bold text-base" numberOfLines={2}>
              {item.title}
            </Text>

            <View className="flex-row items-center mt-2">
              <View
                className={`px-2 py-0.5 rounded ${
                  item.mediaType === 'movie' ? 'bg-accent/20' : 'bg-blue-500/20'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    item.mediaType === 'movie' ? 'text-accent' : 'text-blue-400'
                  }`}
                >
                  {item.mediaType === 'movie' ? 'Movie' : 'Series'}
                </Text>
              </View>

              {item.release_date && (
                <Text className="text-white/50 text-xs ml-2">
                  {item.release_date.split('-')[0]}
                </Text>
              )}
            </View>

            {item.vote_average !== undefined && item.vote_average > 0 && (
              <View className="flex-row items-center mt-2">
                <Image source={icons.star} className="w-4 h-4" />
                <Text className="text-white text-sm ml-1 font-medium">
                  {item.vote_average.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-white/40 text-xs">Saved {formattedDate}</Text>
        </View>

        {/* Actions */}
        <View className="justify-center px-2 gap-y-2">
          {/* Watched Button */}
          <TouchableOpacity
            onPress={() => {
              if (isMovieWatched(item.id)) {
                removeFromHistory(item.id)
              } else {
                addToHistory(item)
              }
            }}
          >
            <View className={`rounded-full p-2 ${isMovieWatched(item.id) ? 'bg-green-500/20' : 'bg-dark-300'}`}>
              <Image
                source={icons.play} // Using play icon for "watched" status as requested/implied or maybe a checkmark? User said "izlendi butonu". Let's use a checkmark if available or play. User said "izlendi butonu da koy".
                // Actually, I don't have a checkmark icon. I'll use 'play' as a placeholder or maybe 'save' with different color?
                // Let's use 'play' for now as "Watched" often implies "Played".
                className="w-5 h-5"
                tintColor={isMovieWatched(item.id) ? "#22c55e" : "#fff"}
              />
            </View>
          </TouchableOpacity>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={() => handleRemove(item)}
          >
            <View className="bg-red-500/20 rounded-full p-2">
              <Image
                source={icons.save}
                className="w-5 h-5"
                tintColor="#ef4444"
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View className="flex-1 bg-primary">
      <Image 
        source={images.bg} 
        className="absolute w-full h-full z-0" 
        resizeMode="cover"
      />

      <FlatList
        data={filteredMovies}
        renderItem={renderSavedItem}
        keyExtractor={item => `saved-${item.id}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          paddingBottom: responsive.contentPaddingBottom,
          flexGrow: filteredMovies.length === 0 ? 1 : undefined
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        windowSize={5}
        initialNumToRender={6}
      />

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

export default Saved
