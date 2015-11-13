# Webpack Encoding Plugin

I ran into the problem of needing my js files outputted by webpack in another encoding.
Thats, because the delivering webserver enforces the http contenttype. 

## Usage

install module

    npm install webpack-encoding-plugin
    
setup webpack config
   
``` javascript
module.exports = {
    entry: './test.js',
    output: {
        path: '../dist',
        filename: 'bundle.js'
    },
    resolveLoader: {
        root: path.join(__dirname, '../../node_modules')
    },

    plugins: [new encodingPlugin('iso-8859-1')]
};
```