// const { name } = require('./package');

// const project = name;
const project = `ng-microapp-${Math.round(Math.random() * 999).toString().padStart(2, '0')}`;

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    library: `${project}-[name]`,
    libraryTarget: 'umd',
    // angular 11 -
    // jsonpFunction: `webpackJsonp_${project}`,
    // angular 12 +
    chunkLoadingGlobal: `webpackJsonp_${project}`,
    globalObject: 'window',
  },
  externals: {
    'zone.js': 'Zone',
  },
};
