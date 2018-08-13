/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 19:54:30
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');


/**
 *****************************************
 * 查找文件
 *****************************************
 */
module.exports = function resolvePath(context = process.cwd()) {
    return function resolve(name, ...args) {
        let list;

        // 相对模块
        if (name.startsWith('.') || name.startsWith('/') || /^\w:[\\/]/.test(name)) {
            return findFile(path.resolve(context, name, ...args));
        }

        // 分离路径
        list = context.split(path.sep);

        // 查找绝对模块
        while (list.length) {
            let dir = path.join(...list, 'node_modules'),
                file = findFile(path.resolve(dir, name, ...args));

            // 存在文件
            if (file) {
                return file;
            }

            // 上一级
            list.pop();
        }
    };
};


/**
 *****************************************
 * 查找文件
 *****************************************
 */
function findFile(src) {
    try {
        return require.resolve(src);
    } catch (err) {
        // do nothing;
    }
}
