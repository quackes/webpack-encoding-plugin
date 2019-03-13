const fs = require('fs');
const { RawSource, SourceMapSource } = require('webpack-sources');
const encoding = require('encoding');
const { ModuleFilenameHelpers } = require('webpack');

const DEFAULT_OPTIONS = {
    test: /(\.js|\.css)($|\?)/i,
};

class EncodingPlugin {
    constructor(options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...(typeof options === 'string' ? { encoding: options } : options),
        };
    }

    apply(compiler) {
        const { options } = this;
        const matchFileName = ModuleFilenameHelpers.matchObject.bind(undefined, options);

        compiler.hooks.emit.tapAsync('EncodingPlugin', ({ assets, errors }, callback) => {
            Object.keys(assets).filter(matchFileName).forEach(file => {
                const asset = assets[file];
                let source;
                let map;
                try {
                    if (asset.sourceAndMap) {
                        const sourceAndMap = asset.sourceAndMap();
                        source = sourceAndMap.source;
                        map = sourceAndMap.map;
                    } else {
                        source = asset.source();
                        map = typeof asset.map === 'function' ?
                            asset.map() :
                            null;
                    }

                    const encodedSource = encoding.convert(source, options.encoding, 'UTF-8');
                    if (asset.existsAt && fs.existsSync(asset.existsAt)) {
                        fs.writeFileSync(asset.existsAt, encodedSource);
                    }

                    assets[file] = map ?
                        new SourceMapSource(encodedSource, file, map) :
                        new RawSource(encodedSource);
                } catch (e) {
                    errors.push(new Error(`${file} from EncodingPlugin: ${e.message}`));
                }
            });

            callback();
        });
    }
}

module.exports = EncodingPlugin;
