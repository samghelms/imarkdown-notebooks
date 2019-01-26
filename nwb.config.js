const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      plugins: [
        new MonacoWebpackPlugin()
      ]
    }
  }
}
