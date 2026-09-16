import axios from "axios";

const Client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// this thing actally intercepts error and makes them readable by only giving info thats req like status and msg

Client.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong";

      return Promise.reject({
        status,
        message,
      });
    }

    return Promise.reject(error);
  }
);

export default Client;
