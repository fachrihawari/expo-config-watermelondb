"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSettingsGradle = exports.setAppBuildGradle = exports.setAndroidMainApplication = exports.setGradleProperties = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const setGradleProperties = (config) => {
    return (0, config_plugins_1.withGradleProperties)(config, (config) => {
        // Set kotlin version
        config.modResults.push({
            type: "property",
            key: "android.kotlinVersion",
            value: "1.6.0",
        });
        // Set packaging options
        config.modResults.push({
            type: "property",
            key: "android.packagingOptions.pickFirsts",
            value: "**/libc++_shared.so",
        });
        return config;
    });
};
exports.setGradleProperties = setGradleProperties;
const setAndroidMainApplication = (config) => {
    return (0, config_plugins_1.withMainApplication)(config, (config) => {
        config.modResults.contents = (0, generateCode_1.mergeContents)({
            tag: "watermelondb-import",
            src: config.modResults.contents,
            newSrc: `
        import com.nozbe.watermelondb.jsi.WatermelonDBJSIPackage;
        import com.facebook.react.bridge.JSIModulePackage;
      `,
            anchor: /import android\.app\.Application;/,
            // Inside the dependencies block.
            offset: 1,
            comment: "//",
        }).contents;
        config.modResults.contents = (0, generateCode_1.mergeContents)({
            tag: "watermelondb-function",
            src: config.modResults.contents,
            newSrc: `
        @Override
        protected JSIModulePackage getJSIModulePackage() {
          return new WatermelonDBJSIPackage();
        }      
      `,
            anchor: /protected String getJSMainModuleName\(\) \{/,
            // Inside the dependencies block.
            offset: -2,
            comment: "//",
        }).contents;
        return config;
    });
};
exports.setAndroidMainApplication = setAndroidMainApplication;
const setAppBuildGradle = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (config) => {
        config.modResults.contents = (0, generateCode_1.mergeContents)({
            tag: "watermelondb",
            src: config.modResults.contents,
            newSrc: `
        implementation project(':watermelondb-jsi')
      `,
            anchor: /dependencies(?:\s+)?\{/,
            // Inside the dependencies block.
            offset: 1,
            comment: "//",
        }).contents;
        return config;
    });
};
exports.setAppBuildGradle = setAppBuildGradle;
const setSettingsGradle = (config) => {
    return (0, config_plugins_1.withSettingsGradle)(config, (config) => {
        config.modResults.contents = (0, generateCode_1.mergeContents)({
            tag: "watermelondb",
            src: config.modResults.contents,
            newSrc: `        
        include ':watermelondb-jsi'
        project(':watermelondb-jsi').projectDir = new File(rootProject.projectDir, '../node_modules/@nozbe/watermelondb/native/android-jsi')
      `,
            anchor: /include ':app'/,
            offset: -1,
            comment: "//",
        }).contents;
        return config;
    });
};
exports.setSettingsGradle = setSettingsGradle;
//# sourceMappingURL=withAndroid.js.map