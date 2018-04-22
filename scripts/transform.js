/**
 *****************************************
 * Created by lifx
 * Created on 2018-04-15 21:36:59
 *****************************************
 */
'use strict';

/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('fs'),
    babel = require('babel-core'),
    options = {
        ast: false,
        comments: false,
        sourceMaps: false,
        presets: [
            require.resolve('babel-preset-env'),
            require.resolve('babel-preset-stage-3')
        ],
        plugins: [
            require.resolve('babel-plugin-transform-runtime')
        ]
    };


/**
 *****************************************
 * 转译文件
 *****************************************
 */
module.exports = function transform(src, dist) {
    return new Promise((resolve, reject) => {
        fs.readFile(src, { encoding: 'utf8' }, (err, code) => {

            // 处理错误
            if (err) {
                return reject(err);
            }

            // 直接输出文件
            if (code.lastIndexOf('module.exports') === -1) {
                code = babel.transform(code, options).code;
            }

            // 写入文件
            fs.writeFile(
                dist, code, err => err ? reject(err) : resolve({ src, dist, code: code })
            );
        });
    });
};
