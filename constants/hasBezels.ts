import * as Device from "expo-device";

export const hasBezels =
  Device.brand === "Apple" &&
  (Device.deviceYearClass ?? 2020) <= 2017 &&
  Device.modelName !== "iPhone X";
