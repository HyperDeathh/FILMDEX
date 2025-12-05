import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Text,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { images } from "@/assets/images";
import MovieCard from "@/components/MovieCard";
import { fetchMovies, fetchTvShows, fetchGenres, Genre, Movie, TvShow } from "@/services/api";
import { icons } from "@/assets/icons";
import SearchBar from "@/components/SearchBar";
import { responsive } from "@/utils/responsive";

interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average?: number;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debounceRef = useRef<number | null>(null);

  // Load genres on mount
  useEffect(() => {
    fetchGenres()
      .then(setGenres)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load genres")
      );
  }, []);

  // Fetch content based on query and genre
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      setHasMore(true);

      try {
        if (!searchQuery.trim()) {
          const [moviesRes, tvRes] = await Promise.all([
            fetchMovies({ page: 1, genreId: selectedGenre }),
            fetchTvShows({ page: 1 }),
          ]);

          const movieItems: MediaItem[] = (moviesRes.results || []).map(
            (m: Movie) => ({
              id: m.id,
              title: m.title,
              poster_path: m.poster_path,
              vote_average: m.vote_average,
            })
          );
          const tvItems: MediaItem[] = (tvRes.results || []).map((t: TvShow) => ({
            id: t.id,
            title: t.name,
            poster_path: t.poster_path,
            vote_average: t.vote_average,
          }));

          if (selectedGenre) {
            setItems(movieItems);
            setHasMore(moviesRes.page < moviesRes.total_pages);
          } else {
            setItems([...movieItems, ...tvItems]);
            setHasMore(true);
          }
        } else {
          const res = await fetchMovies({
            query: searchQuery,
            page: 1,
            genreId: selectedGenre,
          });
          const movieItems: MediaItem[] = (res.results || []).map((m: Movie) => ({
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            vote_average: m.vote_average,
          }));
          setItems(movieItems);
          setHasMore(res.page < res.total_pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedGenre]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      if (!searchQuery.trim()) {
        const [moviesRes, tvRes] = await Promise.all([
          fetchMovies({ page: nextPage, genreId: selectedGenre }),
          fetchTvShows({ page: nextPage }),
        ]);

        const movieItems: MediaItem[] = (moviesRes.results || []).map(
          (m: Movie) => ({
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            vote_average: m.vote_average,
          })
        );
        const tvItems: MediaItem[] = (tvRes.results || []).map((t: TvShow) => ({
          id: t.id,
          title: t.name,
          poster_path: t.poster_path,
          vote_average: t.vote_average,
        }));

        if (selectedGenre) {
          setItems(prev => [...prev, ...movieItems]);
          setHasMore(moviesRes.page < moviesRes.total_pages);
        } else {
          setItems(prev => [...prev, ...movieItems, ...tvItems]);
          setHasMore(moviesRes.page < moviesRes.total_pages || tvRes.page < tvRes.total_pages);
        }
      } else {
        const res = await fetchMovies({
          query: searchQuery,
          page: nextPage,
          genreId: selectedGenre,
        });
        const movieItems: MediaItem[] = (res.results || []).map((m: Movie) => ({
          id: m.id,
          title: m.title,
          poster_path: m.poster_path,
          vote_average: m.vote_average,
        }));
        setItems(prev => [...prev, ...movieItems]);
        setHasMore(res.page < res.total_pages);
      }
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, loading, hasMore, page, searchQuery, selectedGenre]);

  const handleGenrePress = (genreId: number | null) => {
    setSelectedGenre((prev) => (prev === genreId ? null : genreId));
  };

  const renderGenreChip = (genre: Genre | null) => {
    const isActive = genre
      ? selectedGenre === genre.id
      : selectedGenre === null;
    const chipClasses = isActive
      ? "bg-accent"
      : "bg-dark-200 border border-white/30";
    const textClasses = isActive ? "text-black font-semibold" : "text-white";

    return (
      <TouchableOpacity
        key={genre ? `genre-${genre.id}` : "genre-all"}
        onPress={() => handleGenrePress(genre?.id ?? null)}
        className={`px-4 py-2 rounded-full mr-2 ${chipClasses}`}
      >
        <Text className={`text-sm ${textClasses}`}>{genre?.name ?? "All"}</Text>
      </TouchableOpacity>
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
        <Text className="text-center text-white/50 my-6">You've seen it all!</Text>
      );
    }
    return null;
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={items}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item, index) => `search-${item.id}-${index}`}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginVertical: 8,
        }}
        contentContainerStyle={{ paddingBottom: responsive.contentPaddingBottom }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={9}
        windowSize={5}
        initialNumToRender={9}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-14 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="px-5 mt-6">
              <SearchBar
                editable
                autoFocus
                placeholder="Search Movies, Series..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Browse Genres */}
            <View className="mt-5">
              <Text className="text-sm text-white/80 mb-3 px-5">Browse genres</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
              >
                {[null, ...genres].map((genre) => renderGenreChip(genre))}
              </ScrollView>
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#ab8bff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="px-5 text-red-500 my-3">Error: {error}</Text>
            )}

            {!loading && !error && (
              <Text className="text-xl text-white font-bold px-5 mt-4">
                {searchQuery.trim()
                  ? `Search Results for "${searchQuery}"`
                  : "Latest Movies & Series"}
              </Text>
            )}
          </>
        }
      />
    </View>
  );
};

export default Search;
