const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const pages = glob.sync('**/*.html', { cwd: 'src/pages' }).map((p) => p.slice(0, -11))

module.exports = {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  cache: true,
  devtool: 'source-map',
  devServer: {
    allowedHosts: 'all',
    watchFiles: ['./src/**/*.html'],
    hot: true,
    port: 3000,
    client: {
      webSocketURL: {
        port: 0
      },
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  entry: pages.reduce((config, page) => {
    config[page] = `./src/pages/${page}/index.ts`
    return config
  }, {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanTerminalPlugin(),
		new CopyWebpackPlugin({ patterns: [{ from: 'public', to: '.' }] })
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          minify: {
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeComments: true,
            removeRedundantAttributes: false,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
          },
          template: `./src/pages/${page}/index.html`,
          filename: `${page}.html`,
          chunks: [page]
        })
    )
  )
}
