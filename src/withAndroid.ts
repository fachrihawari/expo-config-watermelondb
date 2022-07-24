import {
  ConfigPlugin,
  withAppBuildGradle,
  withGradleProperties,
  withMainApplication,
  withSettingsGradle,
} from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";

export const setGradleProperties: ConfigPlugin = (config) => {
  return withGradleProperties(config, (config) => {
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

export const setAndroidMainApplication: ConfigPlugin = (config) => {
  return withMainApplication(config, (config) => {
    config.modResults.contents = mergeContents({
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

    config.modResults.contents = mergeContents({
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

export const setAppBuildGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = mergeContents({
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

export const setSettingsGradle: ConfigPlugin = (config) => {
  return withSettingsGradle(config, (config) => {
    config.modResults.contents = mergeContents({
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
