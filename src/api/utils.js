export const getGeoObjectByResult = (result) => {
  const GeoObject =
    (result &&
      result.data &&
      result.data.response.GeoObjectCollection.featureMember.find(
        (item) =>
          item.GeoObject.metaDataProperty.GeocoderMetaData.precision === "exact"
      )) ||
    (result &&
      result.data &&
      result.data.response.GeoObjectCollection.featureMember[0].GeoObject);

  return GeoObject.GeoObject;
};

export const getCurrentSourceTime = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join("");
};
