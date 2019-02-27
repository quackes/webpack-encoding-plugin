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
        const { options, constructor: { name: pluginName } } = this;
        const matchFileName = ModuleFilenameHelpers.matchObject.bind(undefined, options);

        compiler.hooks.compilation.tap(
            pluginName, compilation => {
                const { jsonpScript } = compilation.mainTemplate.hooks;
                if (jsonpScript) {
                    jsonpScript.tap(pluginName, s => s.replace(/["']utf-8["']/gi, `"${options.encoding}"`));
                }
                return compilation;
            }
        );

        compiler.hooks.emit.tapAsync(pluginName, ({ assets, errors }, callback) => {
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
                    errors.push(new Error(`${file} from ${pluginName}: ${e.message}`));
                }
            });

            console.log(`Assets converted to ${options.encoding}`);
            callback();
        });
    }
}

module.exports = EncodingPlugin;
