export type DriverType = {
  crew_id?: string;
  car_mark: string;
  car_model: string;
  car_color: string;
  car_number?: string;
  distance?: number;
};

export type PositionType = {
  lat: number;
  lon: number;
};

type AddressesType = {
  lat: number;
  lon: number;
  address: string;
};

export type getDriversType = {
  source_time: string;
  addresses: Array<AddressesType>;
};

export type newOrderType = {
  source_time: string;
  addresses: Array<AddressesType>;
  crew_id: string;
};
