/**
 * Created by pd06093 on 12.11.2015.
 */

const webpack = require('webpack');
const path = require('path');

const EncodingPlugin = require('..');

webpack({
    entry: './src/test.js',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'bundle.js'
    },
    plugins: [new EncodingPlugin('iso-8859-1')]
});
