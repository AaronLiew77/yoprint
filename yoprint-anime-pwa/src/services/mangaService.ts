import { httpGet } from "./api";

/**
 * Types for manga data from Jikan API
 */
export interface Manga {
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
  chapters: number;
  volumes: number;
  status: string;
  publishing: boolean;
  synopsis: string;
  score: number;
  authors: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
}

export interface MangaResponse {
  data: Manga[];
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

export interface MangaDetailsResponse {
  data: Manga;
}

/**
 * Search for manga
 * @param query - Search query string
 * @param page - Page number for pagination
 * @param limit - Number of results per page (max 25)
 */
export const searchManga = (query: string, page: number = 1, limit: number = 15) => {
  return httpGet<MangaResponse>("/manga", {
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });
};

/**
 * Get top manga
 * @param page - Page number for pagination
 * @param limit - Number of results per page (max 25)
 */
export const getTopManga = (page: number = 1, limit: number = 15) => {
  return httpGet<MangaResponse>("/top/manga", {
    page: page.toString(),
    limit: limit.toString(),
  });
};

/**
 * Get manga details by ID
 * @param id - Manga ID
 */
export const getMangaById = (id: number) => {
  return httpGet<MangaDetailsResponse>(`/manga/${id}`);
};

/**
 * Get manga by genre
 * @param genreId - Genre ID
 * @param page - Page number for pagination
 * @param limit - Number of results per page
 */
export const getMangaByGenre = (genreId: number, page: number = 1, limit: number = 15) => {
  return httpGet<MangaResponse>("/manga", {
    genres: genreId.toString(),
    page: page.toString(),
    limit: limit.toString(),
  });
};
