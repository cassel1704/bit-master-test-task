import { observer } from "mobx-react";
import React from "react";
import { Map as YMap, Placemark as YPlacemark } from "react-yandex-maps";

import { IMapStore } from "../../store";
import Spinner from "../Spinner";
import { IDriverStore } from "../../api/store";
import taxiIcon from "../../assets/taxi-mark.png";
import markIcon from "../../assets/mark.png";

interface IMap {
  store: IMapStore;
}

const Map: React.FC<IMap> = ({ store }) => {
  const {
    init,
    initialized,
    handleClick,
    currentPosition,
    mapCenter,
    drivers,
  } = store;
  const { lat: markerLat, lon: markerLon } = currentPosition;
  const { lat: mapLat, lon: mapLon } = mapCenter;

  const clickOnMap = (e: any) => {
    const coords = e.get("coords");
    const centerCoords = e.originalEvent.map.getCenter();
    const [latCenter, lonCenter] = centerCoords;
    const lat = Number(coords[0]);
    const lon = Number(coords[1]);

    handleClick({
      position: { lat, lon },
      center: { lat: latCenter, lon: lonCenter },
    });
  };

  const onLoad = () => {
    init();
  };

  return (
    <div style={{ height: "100%" }}>
      {!initialized && <Spinner tip="Загрузка карты..." />}
      <YMap
        width="100%"
        height="100%"
        state={{ center: [mapLat, mapLon], zoom: 15 }}
        onClick={clickOnMap}
        onLoad={onLoad}
      >
        {markerLat && markerLon && (
          <YPlacemark
            geometry={[markerLat, markerLon]}
            options={{
              iconLayout: "default#image",
              iconImageHref: markIcon,
              iconImageSize: [32, 32],
            }}
          />
        )}

        {drivers.length > 0 && (
          <>
            {drivers.map((driver: IDriverStore) => (
              <YPlacemark
                key={driver.crew_id}
                geometry={[driver.lat, driver.lon]}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: taxiIcon,
                  iconImageSize: [32, 32],
                }}
              />
            ))}
          </>
        )}
      </YMap>
    </div>
  );
};

export default observer(Map);
