const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, './dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.less']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|build)/,
        include: /src/,
        loader: 'ts-loader'
      },
      {
        test: /\.(png|jpg|gif|mp3)$/,
        loader: 'file-loader',
        options: {
          name:'asset/[name].[hash:5].[ext]'  //这里img是存放打包后图片文件夹，结合publicPath来看就是/webBlog/build/img文件夹中，后边接的是打包后图片的命名方式。
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['dist', 'main'],
      chunksSortMode: 'none'
    })
  ]
}