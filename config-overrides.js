const path = require('path');
const {
  override,
  removeModuleScopePlugin,
  addWebpackAlias,
} = require('customize-cra');
const reactAppRewirePostcss = require('react-app-rewire-postcss');

module.exports = override(
  // this makes Dictionary visible from the src folder
  removeModuleScopePlugin(),
  // this fixes paths for css absolute imports
  config => reactAppRewirePostcss(config, true),
);
