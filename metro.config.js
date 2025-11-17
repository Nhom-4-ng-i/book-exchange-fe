const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require('nativewind/metro');

let config = getSentryExpoConfig(__dirname);
config = withNativeWind(config, { input: './global.css' });

module.exports = config;