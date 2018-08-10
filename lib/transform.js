/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 15:52:00
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
 * 转化代码
 *****************************************
 */
module.exports = function transform(code, options) {
    return babel.transform(code, { ...settings, ...options });
};
