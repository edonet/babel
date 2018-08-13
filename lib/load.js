/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-13 15:50:56
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
    vm = require('vm'),
    path = require('path'),
    transform = require('./transform'),
    resolvePath = require('./resolvePath');


/**
 *****************************************
 * 加载模块
 *****************************************
 */
module.exports = function load(request, options = {}) {
    let {
            reader = readFile,
            resolver = resolveRequest,
            context = process.cwd(),
            babelOptions
        } = options;

    // 解析路径
    return new Promise((resolve, reject) => {
        resolver(context, request, (err, url) => {

            // 处理错误
            if (err) {
                return reject(err);
            }

            // 读取文件
            reader(url, (err, source) => {

                // 处理错误
                if (err) {
                    return reject(err);
                }

                try {
                    let { filename } = parsePath(url),
                        context = path.dirname(filename),
                        deferred;

                    // 解析【json】
                    if (filename.endsWith('.json')) {
                        return resolve(JSON.parse(source));
                    }

                    // 去除空白
                    source = source.trim();

                    // 解析类【json】对象
                    if (source.startsWith('{') && source.endsWith('}')) {
                        return resolve(JSON.parse(source));
                    }

                    // 转化代码
                    source = transform(source, babelOptions).code;

                    // 执行代码
                    deferred = execCode(source, {
                        load: src => load(src, { ...options, context }),
                        resolve: (...args) => resolvePath(context)(...args),
                        context,
                        filename
                    });

                    // 监听结果
                    deferred.then(resolve).catch(reject);
                } catch (err) {
                    return reject(err);
                }
            });
        });
    });
};


/**
 *****************************************
 * 读取文件
 *****************************************
 */
function readFile(request, callback) {
    return fs.readFile(request.replace(/\?.*$/, ''), 'utf-8', callback);
}


/**
 *****************************************
 * 解析文件路径
 *****************************************
 */
function resolveRequest(context, request, callback) {
    try {
        let { filename, query } = parsePath(request),
            path = resolvePath(context)(filename);

        // 执行回调
        callback(null, path ? path + query : path);
    } catch (err) {
        callback(err);
    }
}


/**
 *****************************************
 * 解析路径
 *****************************************
 */
function parsePath(request) {
    let idx = (request.indexOf('?') + 1 || request.length + 1) - 1,
        filename = request.substr(0, idx),
        query = request.substr(idx);

    // 返回结果
    return { filename, query };
}


/**
 *****************************************
 * 执行代码
 *****************************************
 */
function execCode(code, options) {
    let local = { exports: {} },
        filename = options.filename,
        script = new vm.Script(format(code), { filename });

    // 执行代码
    script.runInNewContext({
        process,
        module: local,
        exports: local.exports,
        __MODULE_LOADER__: options.load,
        __MODULE_RESOLVE__: options.resolve,
        __dirname: options.context,
        __filename: filename
    });

    // 返回结果
    return local.deferred().then(() => local.exports);
}


/**
 *****************************************
 * 格式化代码
 *****************************************
 */
function format(code) {
    code = code
        .replace(/(^|\s)require\(/mg, '$1await __MODULE_LOADER__(')
        .replace(/(^|\s)require.resolve\(/mg, '$1await __MODULE_RESOLVE__(');

    // 返回结果
    return `module.deferred = async () => {${ code }};`;
}
