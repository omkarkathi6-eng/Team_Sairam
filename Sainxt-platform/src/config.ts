// API Configuration
export const API_CONFIG = {
  // Base URL for the API

  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://www.jobraze.in",

  // API version (if any)
  API_VERSION: "v1", // Adjust based on your API version

  // All possible endpoint variations
  ENDPOINTS: {
    // Article endpoints
    ARTICLE: {
      // Try these different endpoint formats - uncomment the one that works

      // Option 1: With API version and plural resource
      GET_ARTICLE: (id: string) => `/api/v1/articles/${id}`,

      // Option 2: Without version, with plural resource
      // GET_ARTICLE: (id: string) => `/api/articles/${id}`,

      // Option 3: With version and singular resource
      // GET_ARTICLE: (id: string) => `/api/v1/article/${id}`,

      // Option 4: Without version, with singular resource
      // GET_ARTICLE: (id: string) => `/api/article/${id}`,

      // Option 5: Custom path with get-content
      // GET_ARTICLE: (id: string) => `/api/article/get-content/${id}`,

      // Option 6: Root level
      // GET_ARTICLE: (id: string) => `/articles/${id}`,

      // Option 7: With query parameter
      // GET_ARTICLE: (id: string) => `/api/articles?id=${id}`,
    },
  },

  // Direct API endpoints to the Python backend (full URLs)
  DIRECT_API: {
    // Try these different endpoint formats - uncomment the correct one that matches your backend

    // Option 1: With API version and plural resource
    GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/v1/articles/${id}`,

    // Option 2: Without version, with plural resource
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/articles/${id}`,

    // Option 3: With version and singular resource
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/v1/article/${id}`,

    // Option 4: Without version, with singular resource
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/article/${id}`,

    // Option 5: Custom path with get-content
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/article/get-content/${id}`,

    // Option 6: Root level
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/articles/${id}`,

    // Option 7: With query parameter
    // GET_ARTICLE: (id: string) => `https://www.jobraze.in/api/articles?id=${id}`,
  },
} as const;
