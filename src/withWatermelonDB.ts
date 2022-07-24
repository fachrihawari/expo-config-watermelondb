import { ExportedConfig } from "@expo/config-plugins";

import {
  setAndroidMainApplication,
  setAppBuildGradle,
  setGradleProperties,
  setSettingsGradle,
} from "./withAndroid";

export const withWatermelonDB = (config: ExportedConfig) => {
  config = setGradleProperties(config);
  config = setAndroidMainApplication(config);
  config = setAppBuildGradle(config);
  config = setSettingsGradle(config);

  return config;
};
