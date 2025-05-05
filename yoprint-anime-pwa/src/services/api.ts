/**
 * API service for Jikan API (https://docs.api.jikan.moe/)
 */

const BASE_URL = "https://api.jikan.moe/v4";

// Track the last request time to handle rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second minimum between requests (Jikan API limit)

/**
 * Wait function to ensure API rate limits are respected
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (lastRequestTime > 0 && timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  lastRequestTime = Date.now();
};

/**
 * Generic HTTP GET request to Jikan API
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @returns Promise with response data
 */
export const httpGet = async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  try {
    // Wait to respect rate limits
    await waitForRateLimit();

    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    // Add cache options for server components
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Set cache policy for server components
      // This helps with server-side rendering
      cache: "no-store",
    };

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      // Handle rate limit specifically
      if (response.status === 429) {
        throw new Error(`API rate limit reached. Please try again later.`);
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

/**
 * Generic HTTP POST request to Jikan API
 * Note: Jikan API is primarily a GET API, but this function is included for completeness
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @returns Promise with response data
 */
export const httpPost = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    // Wait to respect rate limits
    await waitForRateLimit();

    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle rate limit specifically
      if (response.status === 429) {
        throw new Error(`API rate limit reached. Please try again later.`);
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
