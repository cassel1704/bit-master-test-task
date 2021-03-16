import AxiosMockAdapter from "axios-mock-adapter";
import getDistanceFromLatLonInKm from "../utils/getDistanceFromLatLonInKm";
import { mainApiInstance } from "./axios";
import { BASE_API_URLS } from "./constants";
import driversMock from "./driversMock.json";
import orderMock from "./orderMock.json";

const jsonHeaders = { "content-type": "application/json" };

const getDrivers = (config: any) => {
  const { data } = config;
  const { addresses } = JSON.parse(data);
  const { lat, lon } = addresses[0];

  const drivers = driversMock.data.crews_info.map((driver) => ({
    ...driver,
    distance: getDistanceFromLatLonInKm(lat, lon, driver.lat, driver.lon),
  }));

  return [
    200,
    JSON.stringify({
      ...driversMock,
      data: { ...driversMock.data, crews_info: drivers },
    }),
    jsonHeaders,
  ];
};

const newOrder = () => [200, orderMock, jsonHeaders];

export const configureAxiosMockAdapter = () => {
  const mockInstance = new AxiosMockAdapter(mainApiInstance, {
    delayResponse: 2500,
  });

  mockInstance.onPost(BASE_API_URLS.GET_DRIVERS).reply(getDrivers);
  mockInstance.onPost(BASE_API_URLS.NEW_ORDER).reply(newOrder);
};
