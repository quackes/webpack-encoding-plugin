/**
 * Created by pd06093 on 12.11.2015.
 */

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const test = require('ava');

const EncodingPlugin = require('..');

test.cb('should encode bundle in iso-8859-1', t =>{

    webpack({
        entry: path.resolve(__dirname, 'src', 'test-entry.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        plugins: [new EncodingPlugin('iso-8859-1')]
    }, (err, stats)=>{

        if (err) {
            return t.end(err);
        } else if (stats.hasErrors()) {
            return t.end(stats.toString());
        }

        const statsJson = stats.toJson()
        statsJson.assets.forEach(file => {
            let filePath = path.resolve(statsJson.outputPath, file.name);

            let fileContent = fs.readFileSync(filePath, 'utf8');

            // check if file contains an "Ö" in iso-8859-1 ()
            t.true(fileContent.indexOf(String.fromCharCode(65533), '"Ö" in iso-8859-1 not found') > 0)

        });
        t.end();
    });
});