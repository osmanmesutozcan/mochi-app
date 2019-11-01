const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const srcDir = '../src/';

// const servicesSrcDir = '../src/services-src/';
// const WORKERS = ['connection', 'intellisense'].reduce((acc, service) => {
//   acc[`${service}.worker`] = path.join(__dirname, servicesSrcDir, service, `${service}.worker.ts`);
//   return acc;
// }, {});

module.exports = {
  entry: {
    client: path.join(__dirname, srcDir + 'client.ts'),
    background: path.join(__dirname, srcDir + 'background.ts'),
    // ...WORKERS,
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    publicPath: '/js/',
    filename: '[name].js',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    },
  },
  module: {
    rules: [
      // { test: /\.worker\.ts$/, use: ['ts-loader', 'worker-loader'] },
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.png$/, use: 'file-loader' },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({ configFile: './tsconfig.json' }),
    ],
  },
  plugins: [
    // exclude locale files in moment
    new MonacoEditorWebpackPlugin({ languages: [] }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyPlugin([{ from: '.', to: '../' }], { context: 'public' }),
  ],
};
