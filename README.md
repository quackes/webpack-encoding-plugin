# Webpack Encoding Plugin

Take contol over the encoding of emitted webpack assets.
This can be useful, if the delivering webserver enforces a specifix content-type, 
so that your js-code is not interpreted as utf-8 by the browser.

## Usage

install module

    npm install webpack-encoding-plugin
    
setup webpack config
   
``` javascript
var EncodingPlugin = require('webpack-encoding-plugin');
module.exports = {
    entry: './entry.js',
    output: {
        path: '../dist',
        filename: 'bundle.js'
    },
    plugins: [new encodingPlugin('iso-8859-1')]
};
```

## Encodings

The Plugin uses [iconv-lite](https://www.npmjs.com/package/iconv-lite) to handle the encoding.
A list of supported encodings can be found [here](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)