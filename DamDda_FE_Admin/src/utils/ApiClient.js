import axios from "axios";
import { SERVER_URL } from "./URLs";

const apiClient = axios.create({
  baseURL: `${SERVER_URL}`,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = token;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

const postRefreshTokenApi = async () => {
  console.log("Token Reissue !!");
  try {
    const response = await axios({
      method: "POST",
      url: `${SERVER_URL}/admin/reissue`,
      headers: {
        Authorization: sessionStorage.getItem("accessToken"),
      },
      data: {
        username: "admin",
        refreshToken: sessionStorage.getItem("refreshToken"),
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to POST new tokens", error);
  }
};

apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = sessionStorage.getItem("accessToken");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      try {
        const response = await postRefreshTokenApi();
        if (response.status === 200) {
          // get new tokens
          const newAccessToken = response.headers.authorization;
          const newRefreshToken = response.data.refreshToken;
          // set new tokens
          setAuthToken(newAccessToken);
          sessionStorage.setItem("accessToken", newAccessToken);
          sessionStorage.setItem("refreshToken", newRefreshToken);
          // re-request
          prevRequest.headers.Authorization = newAccessToken;
          return apiClient(prevRequest);
        } else {
          throw new Error(
            "Failed to refresh access token... CODE:" + response.status
          );
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
