/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 15:47:32
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 生成配置
 *****************************************
 */
module.exports = {
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
