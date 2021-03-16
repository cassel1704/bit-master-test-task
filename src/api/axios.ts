import axios from "axios";
import { BASE_API_URL, YANDEX_GEOCODE_API_URL } from "./constants";

function createInstance(baseURL: string) {
  const instance = axios.create({
    validateStatus: (status) => status >= 200 && status < 400,
    baseURL,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
}

export const mainApiInstance = createInstance(BASE_API_URL);
export const geocodeApiInstance = createInstance(YANDEX_GEOCODE_API_URL);
