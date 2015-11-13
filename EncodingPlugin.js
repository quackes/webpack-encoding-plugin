var fs = require('fs');

var encoding = require('encoding');

function EncodingPlugin(options) {
    this.encoding = options;
}

EncodingPlugin.prototype.apply = function (compiler) {
    var targetEncoding = this.encoding;
    compiler.plugin('after-emit', function (compilation, callback) {

        for (assetName in compilation.assets) {
            var asset = compilation.assets[assetName];
            var converted = encoding.convert(asset._cachedSource, targetEncoding, 'UTF-8');
            fs.writeFileSync(asset.existsAt, converted);
        }
        console.log('Assets converted to ' + targetEncoding);
        callback();

    });
};

module.exports = EncodingPlugin;