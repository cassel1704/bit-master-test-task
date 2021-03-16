import React from "react";
import { observer } from "mobx-react";
import { Typography } from "antd";

import Driver from "./Driver";
import { IDriversStore } from "../../store";
import Spinner from "../Spinner";
import { IDriverStore } from "../../api/store";

interface IDrivers {
  store: IDriversStore;
}

const { Text } = Typography;

const Drivers: React.FC<IDrivers> = ({ store }) => {
  const { error, loading, drivers } = store;

  return (
    <div style={{ height: "100%" }}>
      {loading && <Spinner tip="Поиск экипажей..." />}
      {error && (
        <Text className="block" type="danger">
          При поиске экипажей произошла ошибка
        </Text>
      )}
      {!loading && !error && (
        <>
          {drivers.length ? (
            <div className="main__drivers-list">
              {drivers.map((driver: IDriverStore) => (
                <Driver
                  key={driver.crew_id}
                  car_mark={driver.car_mark}
                  car_model={driver.car_model}
                  car_color={driver.car_color}
                  distance={driver.distance}
                />
              ))}
            </div>
          ) : (
            <div>
              <Text className="block" type="danger">
                Для поиска экипажей введите адрес
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default observer(Drivers);
