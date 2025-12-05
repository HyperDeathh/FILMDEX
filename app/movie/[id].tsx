import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/assets/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { useSavedMovies } from "@/context/SavedMoviesContext";
import { responsive, hp, wp } from "@/utils/responsive";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { isMovieSaved, toggleSave } = useSavedMovies();
  const isSaved = movie ? isMovieSaved(movie.id) : false;

  const handleSave = async () => {
    if (!movie) return;
    await toggleSave({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      mediaType: "movie",
    });
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: hp(9.5) }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            style={{ width: '100%', height: responsive.posterHeight }}
            resizeMode="stretch"
          />

          <TouchableOpacity 
            style={{ 
              position: 'absolute', 
              bottom: hp(2), 
              right: wp(5), 
              borderRadius: 50,
              width: wp(14),
              height: wp(14),
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={handleSave}
          >
            <Image
              source={icons.save}
              style={{ width: wp(6), height: wp(6) }}
              resizeMode="contain"
              tintColor={isSaved ? "#ab8bff" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

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

export default Details;