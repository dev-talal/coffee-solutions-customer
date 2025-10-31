import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const apiService: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// request interceptor
apiService.interceptors.request.use(async (config) => {
  const token = Cookies.get(
    process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
  );

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response interceptor
apiService.interceptors.response.use(
  (response) => {
    const { config } = response;

    if (config?.method?.toLowerCase() !== "get") {
      toast.success(response?.data?.message || "Success");
    }

    return Promise.resolve(response);
  },
  (error) => {
    const { config, response } = error;

    if (config?.method?.toLowerCase() !== "get") {
      const message =
        response?.data?.message ||
        response?.data?.error ||
        "Something went wrong!";

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default apiService;
