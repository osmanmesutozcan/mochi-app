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
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        issuer: { test: /\.(s[ac]ss|css)$/i },
        use: { loader: 'file-loader' },
      },
      {
        // in css files, svg is loaded as a url formatted string
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: { test: /\.css$/ },
        use: {
          loader: 'svg-url-loader',
          options: { encoding: 'none', limit: 10000 },
        },
      },
      {
        // in ts and tsx files (both of which compile to js),
        // svg is loaded as a raw string
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: { test: /\.[tj]sx?$/ },
        use: {
          loader: 'raw-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
  externals: { '@microsoft/typescript-etw': 'FakeModule' },
  plugins: [
    // exclude locale files in moment
    new MonacoEditorWebpackPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyPlugin([{ from: '.', to: '../' }], { context: 'public' }),
  ],
};
