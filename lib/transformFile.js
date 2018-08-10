/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 15:54:55
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('@arted/utils/fs'),
    babel = require('babel-core'),
    settings = require('./settings');


/**
 *****************************************
 * 转码文件
 *****************************************
 */
module.exports = function transformFile(src, dist, options, callback) {

    // 重载函数
    switch (arguments.length) {
        case 2:
            switch (typeof dist) {
                case 'string':
                    return transformFile(src, dist, null, null);
                case 'function':
                    return transformFile(src, null, null, dist);
                case 'object':
                    return transformFile(src, null, dist, null);
                default:
                    return transformFile(src, null, null, null);
            }
        case 3:
            switch (typeof options) {
                case 'function':
                    return transformFile(src, dist, null, options);
                case 'object':
                    return transformFile(src, dist, options, null);
                default:
                    return transformFile(src, dist, null, null);
            }
        default:
            break;
    }

    // 返回【promise】
    return new Promise((resolve, reject) => {
        babel.transformFile(src, { ...settings, ...options }, async (err, result) => {

            // 处理错误
            if (err) {
                return reject(err);
            }

            // 写入文件
            try {
                dist && await fs.writeFile(dist, result.code);
            } catch (err) {
                return reject(err);
            }

            // 合并对象
            result = { src, dist, ...result };

            // 执行回调
            callback && await callback(null, result);
            resolve(result);
        });
    });
};
