import React from "react";
import { Text, TouchableOpacity, Image, View } from "react-native";
import { Link } from "expo-router";
import { icons } from "@/assets/icons";
import { responsive } from "@/utils/responsive";

type Props = {
  id: number;
  poster_path?: string | null;
  title: string;
  vote_average?: number;
  release_date?: string;
};

const MovieCard: React.FC<Props> = ({ id, poster_path, title, vote_average, release_date }) => {
  const imageUri = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://via.placeholder.com/600x400/1a1a1a/ffffff.png";

  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-1/3 pr-2">
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: responsive.movieCardHeight, borderRadius: 8 }}
          resizeMode="cover"
        />
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>{title}</Text>

        <View className="flex-row items-center mt-1 justify-start gap-x-1">
            <Image source={icons.star} className="size-4"
            />
            <Text className="text-xs text-white font-bold uppercase">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </Text>
        </View>

        <View className="flex-row items-center justify-between">
            <Text className="text-xs text-slate-500">{release_date?.split('-')[0]}</Text>
        </View>
      
      </TouchableOpacity>
    </Link>
  );
};

export default React.memo(MovieCard);
