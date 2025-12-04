import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import { useScrollToTop } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBar from "@/components/SearchBar";
import { fetchMovies, fetchTvShows, Movie, TvShow } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "expo-router";
import { icons } from "@/assets/icons";
import { images } from "@/assets/images";

type MediaType = "movies" | "series";

interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

const CHUNK_SIZE = 21;

export default function Index() {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>("movies");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bufferRef = useRef<MediaItem[]>([]);
  const tmdbPageRef = useRef(1);

  const totalPagesRef = useRef(1);
  const flatListRef = useRef<FlatList>(null);
  useScrollToTop(flatListRef);

  const resetPagination = useCallback(() => {
    bufferRef.current = [];
    tmdbPageRef.current = 1;
    totalPagesRef.current = 1;
    setHasMore(true);
  }, []);

  const fillBuffer = useCallback(async () => {
    while (
      bufferRef.current.length < CHUNK_SIZE &&
      tmdbPageRef.current <= totalPagesRef.current
    ) {
      if (mediaType === "movies") {
        const response = await fetchMovies({ page: tmdbPageRef.current });
        const mapped: MediaItem[] = response.results.map((m: Movie) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          vote_average: m.vote_average ?? 0,
        }));
        bufferRef.current = [...bufferRef.current, ...mapped];
        totalPagesRef.current = response.total_pages;
        tmdbPageRef.current = response.page + 1;
        if (response.page >= response.total_pages) break;
      } else {
        const response = await fetchTvShows({ page: tmdbPageRef.current });
        const mapped: MediaItem[] = response.results.map((t: TvShow) => ({
          id: t.id,
          title: t.name,
          poster_path: t.poster_path,
          vote_average: t.vote_average ?? 0,
        }));
        bufferRef.current = [...bufferRef.current, ...mapped];
        totalPagesRef.current = response.total_pages;
        tmdbPageRef.current = response.page + 1;
        if (response.page >= response.total_pages) break;
      }
    }
  }, [mediaType]);

  const extractChunk = useCallback(() => {
    if (bufferRef.current.length === 0) {
      setHasMore(false);
      return 0;
    }
    const chunk = bufferRef.current.splice(0, CHUNK_SIZE);
    setItems((prev) => [...prev, ...chunk]);
    setHasMore(
      bufferRef.current.length > 0 ||
        tmdbPageRef.current <= totalPagesRef.current
    );
    return chunk.length;
  }, []);

  const loadInitial = useCallback(async () => {
    resetPagination();
    setItems([]);
    setError(null);
    setLoading(true);
    try {
      await fillBuffer();
      const len = extractChunk();
      if (len === 0) setHasMore(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [extractChunk, fillBuffer, resetPagination]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      await fillBuffer();
      extractChunk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [extractChunk, fillBuffer, hasMore, loading, loadingMore]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleMediaTypeChange = (type: MediaType) => {
    if (type !== mediaType) {
      setMediaType(type);
    }
  };

  const renderHeader = () => {
    const isMovies = mediaType === "movies";
    const isSeries = mediaType === "series";

    return (
      <View className="px-5 pt-14 pb-4">
        <Image source={icons.logo} className="w-12 h-10 mx-auto mb-5" />
        <SearchBar
          placeholder="Search Movies, Series..."
          onPress={() => router.push("/search")}
        />

        {/* Movies / Series Toggle */}
        <View className="flex-row mt-5 justify-center">
          <TouchableOpacity
            onPress={() => handleMediaTypeChange("movies")}
            className={`px-6 py-2 rounded-full mr-3 ${
              isMovies ? "bg-accent" : "bg-dark-200 border border-white/30"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isMovies ? "text-black" : "text-white"
              }`}
            >
              Movies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMediaTypeChange("series")}
            className={`px-6 py-2 rounded-full ${
              isSeries ? "bg-accent" : "bg-dark-200 border border-white/30"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isSeries ? "text-black" : "text-white"
              }`}
            >
              Series
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold text-white mt-6">
          Popular {isMovies ? "Movies" : "Series"}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View className="py-6">
          <ActivityIndicator size="small" color="#ab8bff" />
        </View>
      );
    }
    if (!hasMore && items.length > 0) {
      return (
        <Text className="text-center text-white my-6">You are up to date.</Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className="py-10">
          <ActivityIndicator size="large" color="#ab8bff" />
        </View>
      );
    }
    return (
      <Text className="text-center text-white mt-12">
        {error ?? "No content could be loaded right now."}
      </Text>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => `${mediaType}-${item.id}`}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 140 }}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ paddingBottom: 10 }}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        windowSize={5}
        initialNumToRender={9}
        getItemLayout={(data, index) => ({
          length: 180,
          offset: 180 * Math.floor(index / 3),
          index,
        })}
      />
    </View>
  );
}
