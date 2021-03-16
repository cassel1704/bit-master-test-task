import { getDriversType, newOrderType } from "../types";
import { mainApiInstance, geocodeApiInstance } from "./axios";
import {
  BASE_API_URLS,
  YANDEX_GEOCODE_API_URL,
  YANDEX_GEOCODE_TOKEN,
} from "./constants";

const getGetcodeGeoObject = (query: string) =>
  geocodeApiInstance({
    method: "get",
    url: YANDEX_GEOCODE_API_URL,
    params: {
      geocode: query,
      format: "json",
      apikey: YANDEX_GEOCODE_TOKEN,
    },
  });

const getDrivers = (data: getDriversType) =>
  mainApiInstance({
    method: "post",
    url: BASE_API_URLS.GET_DRIVERS,
    data,
  });

const newOrder = (data: newOrderType) =>
  mainApiInstance({
    method: "post",
    url: BASE_API_URLS.NEW_ORDER,
    data,
  });

export { getGetcodeGeoObject, getDrivers, newOrder };
