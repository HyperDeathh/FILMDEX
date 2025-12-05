import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '@/assets/icons';
import { images } from '@/assets/images';
import { useSavedMovies, SavedMovie } from '@/context/SavedMoviesContext';
import { responsive, hp, wp } from '@/utils/responsive';

const History = () => {
  const router = useRouter();
  const { watchedMovies, removeFromHistory } = useSavedMovies();

  const renderHistoryItem = ({ item }: { item: SavedMovie }) => (
    <TouchableOpacity
      className="flex-row bg-dark-200 rounded-2xl p-3 mb-3 mx-5"
      onPress={() => router.push(`/movie/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
            : 'https://via.placeholder.com/200x300',
        }}
        className="w-20 h-28 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <Text className="text-white font-bold text-base" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="text-white/50 text-xs mt-1">
            Watched on {new Date(item.savedAt).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity 
            onPress={() => removeFromHistory(item.id)}
            className="self-start bg-red-500/20 px-3 py-1.5 rounded-lg mt-2"
        >
            <Text className="text-red-400 text-xs font-medium">Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />
      <Image source={images.bg} className="absolute w-full z-0" />
      
      <View className="pt-16 pb-6 px-5 items-center">
         <Text className="text-2xl font-bold text-white">Watch History</Text>
         <Text className="text-white/60 text-sm mt-1">
            {watchedMovies.length} movies watched
         </Text>
      </View>

      <FlatList
        data={watchedMovies}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => `history-${item.id}`}
        contentContainerStyle={{ paddingBottom: responsive.contentPaddingBottom, paddingTop: 20 }}
        ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20 px-10">
                <View className="bg-dark-200 p-6 rounded-full mb-6">
                    <Image source={icons.play} className="w-12 h-12" tintColor="#ab8bff" />
                </View>
                <Text className="text-white font-bold text-xl text-center mb-2">No History Yet</Text>
                <Text className="text-white/50 text-center text-base leading-6">
                    Movies you mark as watched will appear here. Start exploring to build your history!
                </Text>
            </View>
        )}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: hp(2),
          left: 0,
          right: 0,
          marginHorizontal: wp(5),
          backgroundColor: '#ab8bff',
          borderRadius: 8,
          paddingVertical: hp(1.7),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default History;
