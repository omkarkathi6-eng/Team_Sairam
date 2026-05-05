// import { refreshToken } from "./auth";

// const API_BASE_URL = "https://www.jobraze.in";

// // Store the original fetch
// export const customFetch = async (url, options = {}) => {
//   // Add auth header if token exists

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const headers = {
//     "Content-Type": "application/json",

//     ...options.headers,
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}${url}`, {
//       ...options,
//       headers,

//       credentials: "include",
//     });

//     // If token is expired, try to refresh it
//     if (response.status === 401) {
//       const refreshResponse = await refreshToken();
//       if (refreshResponse?.access_token) {
//         // Retry the original request with new token

//         headers["Authorization"] = `Bearer ${refreshResponse.access_token}`;
//         return fetch(`${API_BASE_URL}${url}`, {
//           ...options,
//           headers,
//           credentials: "include",
//         });
//       } else {
//         // If refresh fails, clear auth and redirect to login
//         if (typeof window !== "undefined") {
//           localStorage.removeItem("token");
//           window.dispatchEvent(new Event("unauthorized"));
//         }
//         throw new Error("Session expired. Please log in again.");
//       }
//     }

//     return response;
//   } catch (error) {
//     console.error("API request failed:", error);

//     throw error;
//   }
// };

import { refreshToken } from "./auth";

const API_BASE_URL = "https://www.jobraze.in";

// Store the original fetch
export const customFetch = async (url, options = {}) => {
  // Add auth header if token exists

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",

    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,

      credentials: "include",
    });

    // If token is expired, try to refresh it
    if (response.status === 401) {
      const refreshResponse = await refreshToken();
      if (refreshResponse?.access_token) {
        // Retry the original request with new token

        headers["Authorization"] = `Bearer ${refreshResponse.access_token}`;
        return fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
          credentials: "include",
        });
      } else {
        // If refresh fails, clear auth and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("unauthorized"));
        }
        throw new Error("Session expired. Please log in again.");
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);

    throw error;
  }
};
