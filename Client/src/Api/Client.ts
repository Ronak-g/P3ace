import axios from "axios";

const Client = axios.create({
  baseURL: "http://localhost:5000",
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
