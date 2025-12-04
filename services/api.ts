export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
}

export interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  status: string;
  tagline: string;
  adult: boolean;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

const buildSearchUrl = (params: URLSearchParams, query?: string) => {
  params.append("language", "en-US");
  params.append("include_adult", "false");
  if (query) {
    params.append("query", query);
  }
  return params;
};

export const fetchMovies = async ({
  query,
  genreId,
  page = 1,
}: {
  query?: string;
  genreId?: number | null;
  page?: number;
}): Promise<MovieListResponse> => {
  const isSearch = Boolean(query);
  const endpoint = isSearch
    ? `${TMDB_CONFIG.BASE_URL}/search/movie`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie`;
  const params = new URLSearchParams();
  buildSearchUrl(params, query);
  params.append("page", page.toString());
  if (!isSearch) {
    params.append("sort_by", "popularity.desc");
  }
  if (genreId) {
    params.append("with_genres", genreId.toString());
  }

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = (await response.json()) as MovieListResponse;
  return data;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  const response = await fetch(
    `${TMDB_CONFIG.BASE_URL}/genre/movie/list?language=en-US`,
    {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`);
  }

  const data = await response.json();
  return data.genres as Genre[];
};

export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface TvListResponse {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
}

export const fetchTvShows = async ({
  query,
  page = 1,
}: {
  query?: string;
  page?: number;
} = {}): Promise<TvListResponse> => {
  const isSearch = Boolean(query);
  const endpoint = isSearch
    ? `${TMDB_CONFIG.BASE_URL}/search/tv`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv`;

  const params = new URLSearchParams();
  params.append("language", "en-US");
  params.append("page", page.toString());
  if (!isSearch) params.append("sort_by", "popularity.desc");
  if (query) params.append("query", query);

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tv shows: ${response.statusText}`);
  }

  const data = (await response.json()) as TvListResponse;
  return data;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  // First try movie endpoint
  try {
    const movieUrl = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?language=en-US`;
    
    const response = await fetch(movieUrl, {
      method: "GET",
      headers: TMDB_CONFIG.headers,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // If movie endpoint fails, try TV endpoint
    console.log("Movie endpoint failed, trying TV endpoint...");
    const tvUrl = `${TMDB_CONFIG.BASE_URL}/tv/${movieId}?language=en-US`;
    const tvResponse = await fetch(tvUrl, {
      method: "GET", 
      headers: TMDB_CONFIG.headers,
    });

    if (tvResponse.ok) {
      const tvData = await tvResponse.json();
      // Map TV data to MovieDetails format
      return {
        id: tvData.id,
        title: tvData.name || tvData.original_name,
        poster_path: tvData.poster_path,
        backdrop_path: tvData.backdrop_path,
        overview: tvData.overview,
        release_date: tvData.first_air_date,
        vote_average: tvData.vote_average,
        vote_count: tvData.vote_count,
        genres: tvData.genres || [],
        runtime: tvData.episode_run_time?.[0] || 0,
        budget: 0,
        revenue: 0,
        production_companies: tvData.production_companies || [],
        status: tvData.status,
        tagline: tvData.tagline || "",
        adult: false,
      };
    }

    throw new Error(`Failed to fetch details: Movie status ${response.status}, TV status ${tvResponse.status}`);
  } catch (error) {
    console.error("Error fetching details:", error);
    throw error;
  }
};