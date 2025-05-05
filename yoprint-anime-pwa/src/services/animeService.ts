import { httpGet } from "./api";

/**
 * Types for anime data from Jikan API
 */
export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  synopsis: string;
  score: number;
  year: number;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
}

export interface AnimeResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface AnimeDetailsResponse {
  data: Anime;
}

/**
 * Get anime search results
 * @param query - Search query string
 * @param page - Page number for pagination
 * @param limit - Number of results per page (max 25)
 */
export const searchAnime = (query: string, page: number = 1, limit: number = 15) => {
  return httpGet<AnimeResponse>("/anime", {
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });
};

/**
 * Get top anime list
 * @param page - Page number for pagination
 * @param limit - Number of results per page (max 25)
 */
export const getTopAnime = (page: number = 1, limit: number = 15) => {
  return httpGet<AnimeResponse>("/top/anime", {
    page: page.toString(),
    limit: limit.toString(),
  });
};

/**
 * Get anime details by ID
 * @param id - Anime ID
 */
export const getAnimeById = (id: number) => {
  return httpGet<AnimeDetailsResponse>(`/anime/${id}`);
};

/**
 * Get seasonal anime
 * @param year - Year
 * @param season - Season (winter, spring, summer, fall)
 * @param page - Page number for pagination
 */
export const getSeasonalAnime = (year: number, season: string, page: number = 1) => {
  return httpGet<AnimeResponse>(`/seasons/${year}/${season}`, {
    page: page.toString(),
  });
};

/**
 * Get currently airing anime
 * @param page - Page number for pagination
 * @param limit - Number of results per page
 */
export const getAiringAnime = (page: number = 1, limit: number = 15) => {
  return httpGet<AnimeResponse>("/seasons/now", {
    page: page.toString(),
    limit: limit.toString(),
  });
};

/**
 * Get anime by genre
 * @param genreId - Genre ID
 * @param page - Page number for pagination
 * @param limit - Number of results per page
 */
export const getAnimeByGenre = (genreId: number, page: number = 1, limit: number = 15) => {
  return httpGet<AnimeResponse>("/anime", {
    genres: genreId.toString(),
    page: page.toString(),
    limit: limit.toString(),
  });
};
