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
    babel = require('babel-core'),
    settings = require('./settings');


/**
 *****************************************
 * 转码文件
 *****************************************
 */
module.exports = function transformFile(src, options) {
    return babel.transformFileSync(src, { ...settings, ...options });
};
