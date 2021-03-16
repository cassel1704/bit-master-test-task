import React from "react";
import { observer } from "mobx-react";
import { Typography, Button } from "antd";
import { YMaps } from "react-yandex-maps";

import "./App.css";
import { IRootStore } from "./store";
import Map from "./components/Map";
import Input from "./components/Input";
import Drivers from "./components/Drivers";
import Driver from "./components/Drivers/Driver";

const { Title, Text } = Typography;

interface IApp {
  store: IRootStore;
}

const Application: React.FC<IApp> = ({ store }) => {
  const {
    newOrder,
    mapError,
    disabled,
    ordering,
    createdOrderId,
    nearestDriver,
    addressInput,
    map,
    drivers,
  } = store;
  const {
    value: inputValue,
    error: inputError,
    handleChange: inputHandleChange,
    handleEnter: inputHandleEnter,
  } = addressInput;

  const handleNewOrderClick = () => {
    newOrder();
  };

  return (
    <YMaps>
      <div className="application">
        {!createdOrderId && (
          <>
            <div className="application__header header">
              <div className="hedaer__title">
                <Title level={2}>Детали заказа</Title>
              </div>
              <div className="header__input">
                <Title level={5}>Откуда</Title>
                <Input
                  placeholder="Укажите ваш адрес"
                  value={inputValue}
                  disabled={disabled}
                  error={inputError}
                  onChange={inputHandleChange}
                  onEnter={inputHandleEnter}
                />
                {mapError && (
                  <Text className="block map-error" type="danger">
                    Не удалось распознать адрес, попробуйте еще раз
                  </Text>
                )}
              </div>
              {!ordering && nearestDriver && (
                <div className="header__driver">
                  <Title level={5}>Подходящий экипаж</Title>
                  <Driver
                    car_mark={nearestDriver.car_mark}
                    car_model={nearestDriver.car_model}
                    car_color={nearestDriver.car_color}
                    car_number={nearestDriver.car_number}
                  />
                </div>
              )}
            </div>
            <div className="application__body main">
              <div className="main__map">
                <Map store={map} />
              </div>
              <div className="main__drivers">
                <Drivers store={drivers} />
              </div>
            </div>
            <div className="application__footer">
              <Button
                type="primary"
                onClick={handleNewOrderClick}
                disabled={disabled}
                loading={ordering}
              >
                Заказать такси
              </Button>
            </div>
          </>
        )}
        {createdOrderId && (
          <div>
            <Title level={4}>Заказ №{createdOrderId} успешно оформлен!</Title>
          </div>
        )}
      </div>
    </YMaps>
  );
};

export default observer(Application);
