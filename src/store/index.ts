import { types, flow, Instance, getRoot } from "mobx-state-tree";
import { ApiStore, apiStore, IDriverStore } from "../api/store";
import { MOSCOW_COORDS } from "../constants";
import { PositionType } from "../types";

interface IHandleClick {
  position: PositionType;
  center: PositionType;
}
export interface IAddressInputStore extends Instance<typeof AdressInputStore> {}
export interface IApiStore extends Instance<typeof ApiStore> {}
export interface IMapStore extends Instance<typeof MapStore> {}
export interface IDriversStore extends Instance<typeof DriversStore> {}
export interface IRootStore {
  api: IApiStore;
  map: IMapStore;
  addressInput: IAddressInputStore;
  drivers: IDriversStore;
  nearestDriver: IDriverStore | null;
  createdOrderId: string | null;
  newOrder: () => void;
  newOrderLoading: boolean;
  newOrderError: string | null;
  mapError: string | null;
  disabled: boolean;
  ordering: boolean;
}

const MapCenterPositionStore = types.model({
  lat: types.number,
  lon: types.number,
});

const CurrentPositionStore = types.model({
  lat: types.maybeNull(types.number),
  lon: types.maybeNull(types.number),
});

const DriversStore = types
  .model({
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getRoot(self);
    },
    get drivers() {
      return this.root.api.drivers.data || [];
    },
  }))
  .actions((self) => ({
    getDrivers: flow(function* fetch({ address, lat, lon }) {
      self.loading = true;
      self.error = null;

      try {
        yield self.root.api.drivers.getDrivers({ address, lat, lon });
      } catch (e) {
        self.error = e.message;
      } finally {
        self.loading = false;
      }
    }),
  }));

const MapStore = types
  .model({
    initialized: types.boolean,
    currentPosition: CurrentPositionStore,
    mapCenter: MapCenterPositionStore,
    loading: types.boolean,
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getRoot(self);
    },
    get drivers() {
      return this.root.api.drivers.data || [];
    },
  }))
  .actions((self) => ({
    init() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setMapCenter(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.log("error: ", error);
        }
      );
      self.initialized = true;
    },

    setCurrentPosition(lat: number | null, lon: number | null) {
      self.currentPosition = { lat, lon };
    },

    setMapCenter(lat: number, lon: number) {
      self.mapCenter = { lat, lon };
    },
  }))
  .actions((self) => ({
    setPositionByMap: flow(function* (lat: number, lon: number) {
      self.loading = true;
      self.error = null;

      try {
        const result = yield self.root.api.geocode.getGeoObject(
          `${lon}, ${lat}`
        );
        const { name } = result;
        self.setCurrentPosition(lat, lon);
        self.root.drivers.getDrivers({ address: name, lat, lon });
        self.root.addressInput.setValue(name);
      } catch (e) {
        self.error = e.message;
        self.setCurrentPosition(null, null);
      } finally {
        self.loading = false;
      }
    }),
    setPositionByInput: flow(function* (query: string) {
      self.loading = true;
      self.error = null;

      try {
        const result = yield self.root.api.geocode.getGeoObject(query);
        const { name, position } = result;
        const { lat, lon } = position;
        self.setCurrentPosition(lat, lon);
        self.setMapCenter(lat, lon);
        self.root.drivers.getDrivers({ address: name, lat, lon });
        self.root.addressInput.setValue(name);
      } catch (e) {
        self.error = e.message;
        self.setCurrentPosition(null, null);
      } finally {
        self.loading = false;
      }
    }),
  }))
  .actions((self) => ({
    handleClick(params: IHandleClick) {
      const { position, center } = params;
      const { lat, lon } = position;
      const { lat: latCenter, lon: lonCenter } = center;
      self.setPositionByMap(lat, lon);
      self.setMapCenter(latCenter, lonCenter);
    },
  }));

const AdressInputStore = types
  .model({
    validated_value: types.maybeNull(types.string),
    value: types.optional(types.string, ""),
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get root(): IRootStore {
      return getRoot(self);
    },
  }))
  .actions((self) => ({
    setValue(value: string) {
      self.value = value;
      self.validated_value = value;
    },

    setError(error: string) {
      self.error = error;
    },

    handleChange(value: string) {
      this.setValue(value);

      if (self.validated_value) {
        self.validated_value = null;
      }

      if (self.error) {
        self.error = null;
      }
    },

    handleEnter() {
      self.root.map.setPositionByInput(self.value);
    },
  }));

const RootStore = types
  .model("RootStore", {
    api: ApiStore,
    map: MapStore,
    addressInput: AdressInputStore,
    drivers: DriversStore,
    newOrderLoading: types.boolean,
    newOrderError: types.maybeNull(types.string),
  })
  .views((self) => ({
    get nearestDriver() {
      const drivers = self.api.drivers.data || [];
      if (!drivers.length) {
        return null;
      }
      return drivers[0];
    },
    get mapError() {
      return self.map.error;
    },
    get createdOrderId() {
      const order_id = self.api.order.order_id || null;
      return order_id;
    },
    get disabled() {
      return self.newOrderLoading || self.drivers.loading;
    },
    get ordering() {
      return self.newOrderLoading;
    },
    get position() {
      return self.api.geocode.data?.position;
    },
  }))
  .actions((self) => ({
    newOrder: flow(function* () {
      const validated_value = self.addressInput.validated_value;
      if (!validated_value || !self.position) {
        self.addressInput.setError("Заполните ваш адрес!");
        return;
      }

      if (!self.nearestDriver) {
        self.addressInput.setError("Нет выбранного экипажа!");
        return;
      }

      self.newOrderLoading = true;

      try {
        yield self.api.order.newOrder({
          address: validated_value,
          lat: self.position!.lat,
          lon: self.position!.lon,
          crew_id: self.nearestDriver!.crew_id,
        });
      } catch (e) {
        self.newOrderError = e.message;
      } finally {
        self.newOrderLoading = false;
      }
    }),
  }));

export default RootStore.create({
  api: apiStore,
  map: MapStore.create({
    initialized: false,
    currentPosition: { lat: null, lon: null },
    mapCenter: { lat: MOSCOW_COORDS[0], lon: MOSCOW_COORDS[1] },
    loading: false,
  }),
  addressInput: AdressInputStore.create({}),
  drivers: DriversStore.create({ loading: false }),
  newOrderLoading: false,
});
