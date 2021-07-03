const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFerderationPlugin } = require("webpack").container;

module.exports = (env = {}) => ({
  mode: "development",
  cache: false,
  devtool: "source-map",
  optimization: {
    minimize: false,
  },
  target: "web",
  entry: path.resolve(__dirname, "./src/main.js"),
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".vue", ".jsx", ".js", ".json"],
    alias: {
      vue: "@vue/runtimne-dom",
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.png/,
        use: {
          loader: "url-loader",
          options: { limit: 8192 },
        }
      },
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          "css-loader",
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ModuleFerderationPlugin({
      name: "library",
      filename: "remoteEntry.js",
      remotes: {
        home: "library@http://localhost:3002/remoteEntry.js",
      },
      exposes: {
        "./Content": "./src/components/Content",
        "./Button": "./src/components/Button",
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
    }),
    new VueLoaderPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 3002,
    hot: true,
    headers: {
      "Acess-Control-Allow-Origin": "*",
      "Acess-Control-Allow-Methos": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Acess-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
})
