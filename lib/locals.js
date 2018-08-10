/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 16:35:49
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 创建模块
 *****************************************
 */
const
    vm = require('vm'),
    fs = require('fs'),
    path = require('@arted/utils/path'),
    transform = require('./transform'),
    locals = {};


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = { execute, executeFile };


/**
 *****************************************
 * 执行文件
 *****************************************
 */
function executeFile(filename, options) {
    return execute(fs.readFileSync(filename, 'utf-8'), { filename, babelOptions: options });
}


/**
 *****************************************
 * 执行代码
 *****************************************
 */
function execute(code, { filename = path.cwd('./__temp.js'), babelOptions } = {}) {

    // 生成模块
    if (!(filename in locals) || locals.code !== code) {
        let script = new vm.Script(transform(code, babelOptions).code, { filename }),
            dirname = path.dirname(filename),
            loader = createLoader(dirname, babelOptions),
            local = { exports: {} };

        // 执行代码
        script.runInNewContext({
            process,
            module: local,
            exports: local.exports,
            require: loader,
            __dirname: dirname,
            __filename: filename
        });

        // 缓存模块
        locals[filename] = { code, exports: local.exports };
    }

    // 返回模块
    return locals[filename].exports;
}


/**
 *****************************************
 * 创建加载器
 *****************************************
 */
function createLoader(dirname, babelOptions) {
    let resolve = (...args) => path.resolve(dirname, ...args),
        loader = src => executeFile(resolve(src), babelOptions);

    // 返回函数
    loader.resolve = resolve;
    return loader;
}
