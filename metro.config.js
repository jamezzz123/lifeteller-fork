const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  // Ensure Metro resolves from node_modules correctly
  nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
  // Disable symlink resolution to avoid pnpm virtual store issues
  unstable_enableSymlinks: false,
};

// Watch the project root for changes
config.watchFolders = [projectRoot];

module.exports = withNativeWind(config, { input: './app/global.css' });
