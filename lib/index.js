/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 15:50:38
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = {
    ...require('./locals'),
    transform: require('./transform'),
    transformFile: require('./transformFile'),
    transformFileSync: require('./transformFileSync')
};
