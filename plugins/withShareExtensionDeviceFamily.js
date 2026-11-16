// expo-share-intent hardcodes TARGETED_DEVICE_FAMILY = "1,2" (iPhone + iPad) for its
// ShareExtension target, ignoring `ios.supportsTablet`. Make the extension match the app so an
// iPhone-only build doesn't ship an extension that claims iPad support.
//
// Must be listed BEFORE "expo-share-intent" in app.json plugins: Xcode project mods run in
// reverse order of registration, so this then runs after the extension target exists.
const { withXcodeProject } = require('expo/config-plugins');

const EXTENSION_TARGET = 'ShareExtension';

module.exports = function withShareExtensionDeviceFamily(config) {
  return withXcodeProject(config, (cfg) => {
    const family = cfg.ios?.supportsTablet ? '"1,2"' : '"1"';
    const project = cfg.modResults;
    const configurations = project.pbxXCBuildConfigurationSection();

    for (const buildConfig of Object.values(configurations)) {
      const settings = buildConfig?.buildSettings;
      if (settings?.PRODUCT_NAME?.replace(/"/g, '') === EXTENSION_TARGET) {
        settings.TARGETED_DEVICE_FAMILY = family;
      }
    }
    return cfg;
  });
};
