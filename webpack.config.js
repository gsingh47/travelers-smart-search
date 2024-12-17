const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    contentScript: './src/content/content.ts',
    background: './src/background/background.ts',
    react: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  mode: 'production',
  module: {
    rules: [
      { 
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {'runtime': 'automatic'}]
            ]
          }
        }
      },
      { 
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {
            limit: 10000
          },
        },
      }
    ]
  },
  resolve: {
    extensions: [".*",".js",".jsx",".ts",".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'popup.html'
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { 
          from: "public" 
        },
      ],
    })
  ],
};