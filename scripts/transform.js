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
        babel.transformFile(src, options, function (err, result) {

            // 处理错误
            if (err) {
                return reject(err);
            }

            // 写入文件
            fs.writeFile(dist, result.code, err => {

                // 处理错误
                if (err) {
                    return reject(err);
                }

                // 转译成功
                resolve({ src, dist, code: result.code });
            });
        });
    });
};
