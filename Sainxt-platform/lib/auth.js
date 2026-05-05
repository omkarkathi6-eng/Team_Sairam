// const TOKEN_KEY = "token";
// const REFRESH_TOKEN_KEY = "refresh_token";
// const TOKEN_EXPIRY_KEY = "token_expiry";

// // Set tokens in localStorage
// export const setAuthTokens = ({ access_token, refresh_token, expires_in }) => {
//   if (typeof window === "undefined") return;

//   const expiryTime = Date.now() + expires_in * 1000;

//   localStorage.setItem(TOKEN_KEY, access_token);
//   localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
//   localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
// };

// // Clear tokens from localStorage
// export const clearAuthTokens = () => {
//   if (typeof window === "undefined") return;

//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(REFRESH_TOKEN_KEY);
//   localStorage.removeItem(TOKEN_EXPIRY_KEY);
// };

// // Get access token
// export const getToken = () => {
//   if (typeof window === "undefined") return null;

//   return localStorage.getItem(TOKEN_KEY);
// };

// // Check if token is expired
// export const isTokenExpired = () => {
//   if (typeof window === "undefined") return true;

//   const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
//   if (!expiryTime) return true;

//   return Date.now() > parseInt(expiryTime, 10);
// };

// // Refresh token
// export const refreshToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
//     if (!refreshToken) {
//       throw new Error("No refresh token available");
//     }

//     const response = await fetch("https://www.jobraze.in/api/refresh-token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ refresh_token: refreshToken }),
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to refresh token");
//     }

//     const data = await response.json();
//     setAuthTokens(data);
//     return data;
//   } catch (error) {
//     console.error("Error refreshing token:", error);

//     clearAuthTokens();
//     throw error;
//   }
// };

// // Check if user is authenticated
// export const isAuthenticated = () => {
//   if (typeof window === "undefined") return false;

//   const token = getToken();
//   if (!token) return false;

//   // Add a small buffer (5 minutes) to account for clock skew
//   return (
//     !isTokenExpired() ||
//     Date.now() <
//       parseInt(localStorage.getItem(TOKEN_EXPIRY_KEY), 10) - 5 * 60 * 1000
//   );
// };

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

// Set tokens in localStorage
export const setAuthTokens = ({ access_token, refresh_token, expires_in }) => {
  if (typeof window === "undefined") return;

  const expiryTime = Date.now() + expires_in * 1000;

  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

// Clear tokens from localStorage
export const clearAuthTokens = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

// Get access token
export const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
};

// Check if token is expired
export const isTokenExpired = () => {
  if (typeof window === "undefined") return true;

  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;

  return Date.now() > parseInt(expiryTime, 10);
};

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch("https://www.jobraze.in/api/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      // credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setAuthTokens(data);
    return data;
  } catch (error) {
    console.error("Error refreshing token:", error);

    clearAuthTokens();
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = getToken();
  if (!token) return false;

  // Add a small buffer (5 minutes) to account for clock skew
  return (
    !isTokenExpired() ||
    Date.now() <
      parseInt(localStorage.getItem(TOKEN_EXPIRY_KEY), 10) - 5 * 60 * 1000
  );
};
