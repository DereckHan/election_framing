var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        script: "./js/script.js"
    },
    output: {
        path: path.resolve(__dirname, 'bin'),
        filename: "[name].entry.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.png$/,
            loader: "url-loader?limit=100000"
        }, {
            test: /\.jpg$/,
            loader: "file-loader"
        }]
    }
}
