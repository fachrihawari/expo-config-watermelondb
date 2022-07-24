"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withWatermelonDB = void 0;
const withAndroid_1 = require("./withAndroid");
const withWatermelonDB = (config) => {
    config = (0, withAndroid_1.setGradleProperties)(config);
    config = (0, withAndroid_1.setAndroidMainApplication)(config);
    config = (0, withAndroid_1.setAppBuildGradle)(config);
    config = (0, withAndroid_1.setSettingsGradle)(config);
    return config;
};
exports.withWatermelonDB = withWatermelonDB;
//# sourceMappingURL=withWatermelonDB.js.map