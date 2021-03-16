import { DriverType } from "./../types/index";
import { flow, types, Instance } from "mobx-state-tree";
import { getDrivers, getGetcodeGeoObject, newOrder } from "./requests";
import { getCurrentSourceTime, getGeoObjectByResult } from "./utils";

export interface IDriverStore extends Instance<typeof DriverStore> {}

const DriverStore = types.model({
  crew_id: types.identifier,
  car_mark: types.string,
  car_model: types.string,
  car_color: types.string,
  car_number: types.string,
  driver_name: types.string,
  driver_phone: types.string,
  distance: types.number,
  lat: types.number,
  lon: types.number,
});

const DriversStore = types
  .model({
    data: types.maybeNull(types.array(DriverStore)),
  })
  .actions((self) => ({
    getDrivers: flow(function* fetch({ address, lat, lon }) {
      self.data = null;

      try {
        const data = {
          source_time: getCurrentSourceTime(),
          addresses: [
            {
              address,
              lat,
              lon,
            },
          ],
        };

        const result = yield getDrivers(data);
        const drivers =
          (result &&
            result.data &&
            result.data.data &&
            result.data.data.crews_info) ||
          [];
        self.data = drivers.sort((a: DriverType, b: DriverType) => {
          const distanceA = a.distance || 0;
          const distanceB = b.distance || 0;
          return distanceA - distanceB;
        });
      } catch (e) {
        throw e;
      }
    }),
  }));

const PositionStore = types.model({ lat: types.number, lon: types.number });

const GeocodeDataStore = types.model({
  name: types.maybeNull(types.string),
  description: types.maybeNull(types.string),
  position: PositionStore,
});

const GeocodeStore = types
  .model({ data: types.maybeNull(GeocodeDataStore) })
  .actions((self) => ({
    getGeoObject: flow(function* fetch(query: string) {
      try {
        const result = yield getGetcodeGeoObject(query);
        self.data = null;

        if (result && result.data) {
          const GeoObject = getGeoObjectByResult(result);
          const { pos } = GeoObject.Point;
          const [lon, lat] = pos.split(" ");
          const data = {
            ...GeoObject,
            position: { lat: Number(lat), lon: Number(lon) },
          };
          self.data = data;
          return data;
        }
      } catch (e) {
        throw e;
      }
    }),
  }));

const OrderStore = types
  .model({ order_id: types.maybeNull(types.string) })
  .actions((self) => ({
    newOrder: flow(function* fetch({ crew_id, address, lat, lon }) {
      try {
        const data = {
          source_time: getCurrentSourceTime(),
          addresses: [
            {
              address,
              lat,
              lon,
            },
          ],
          crew_id,
        };
        const result = yield newOrder(data);
        self.order_id =
          (result &&
            result.data &&
            result.data.data &&
            result.data.data.order_id) ||
          null;
      } catch (e) {
        throw e;
      }
    }),
  }));

export const ApiStore = types.model({
  geocode: GeocodeStore,
  drivers: DriversStore,
  order: OrderStore,
});

export const apiStore = ApiStore.create({
  drivers: DriversStore.create({ data: null }),
  geocode: GeocodeStore.create({}),
  order: OrderStore.create({}),
});
