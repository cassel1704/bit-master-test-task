import React from "react";
import { Typography } from "antd";
import { DriverType } from "../../types";
const { Text } = Typography;

const Driver: React.FC<DriverType> = ({
  car_mark,
  car_model,
  car_color,
  car_number,
  distance,
}) => {
  return (
    <div className={`driver ${distance ? "driver__underline " : ""}`}>
      <div className="driver__left">
        <div className="driver__image"></div>
        <div className="driver__details">
          <Text
            className="driver__car"
            strong
          >{`${car_mark} ${car_model}`}</Text>
          <Text className="driver__car-color">{car_color}</Text>
          {car_number && (
            <Text className="driver__number-plate" keyboard>
              {car_number}
            </Text>
          )}
        </div>
      </div>
      <div className="driver__right">
        {distance && (
          <div className="driver__distance">{distance.toFixed(2)} км</div>
        )}
      </div>
    </div>
  );
};

export default Driver;
