#!/usr/bin/env node

/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 18:36:02
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    argv = require('yargs').argv,
    fs = require('@arted/utils/fs'),
    path = require('@arted/utils/path'),
    stdout = require('@arted/utils/stdout'),
    transformCode = require('../lib/transform');


/**
 *****************************************
 * 定义脚本
 *****************************************
 */
async function run() {
    let src = argv.src || argv._[0],
        dist = argv.dist || argv._[1];

    // 判断是否指定目录
    if (src) {
        console.log(src, dist);

        // 打印信息
        stdout.block('Transform File:');

        // 转码文件
        transform(path.cwd(src), dist && path.cwd(dist));
    }
}


/**
 *****************************************
 * 转码文件
 *****************************************
 */
async function transform(src, dist) {
    if (!src.endsWith('node_modules')) {
        let stats = await fs.stat(src);

        // 查看状态
        if (stats) {

            // 处理目录
            if (stats.isDirectory()) {

                // 判断是否指定目录`
                if (!dist) {
                    return stdout.error('Error: The output dir is must!');
                }

                // 获取目标文件夹信息
                stats = await fs.stat(dist);

                // 不存在文件
                if (stats) {
                    if (!stats.isDirectory()) {
                        return stdout.error('Error: The output dir is not a Directory!');
                    }
                } else {
                    await fs.mkdir(dist);
                }

                // 处理子文件
                return await Promise.all((await fs.readdir(src)).map(
                    name => transform(path.resolve(src, name), path.resolve(dist, name))
                ));
            }

            // 生成目录文件
            if (!dist) {
                dist = src.replace(/\.?(\w+)$/, '.min.$1');
            }

            // 打印信息
            stdout.info(`copy: ${relative(src)} --> ${relative(dist)}`);

            // 转码文件
            if (src.endsWith('.js')) {
                let code = await fs.readFile(src, 'utf-8');

                // 判断是否需要转码
                if (code.indexOf('\nimport ') !== -1 || code.indexOf('\nexport ') !== -1) {
                    code = transformCode(code).code;
                }

                // 写入文件
                return await fs.writeFile(dist, code);
            }

            // 拷贝文件
            await fs.copyFile(src, dist);
        }
    }
}

/**
 *****************************************
 * 获取相对路径
 *****************************************
 */
function relative(src) {
    return path.relative(path.cwd(), src);
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = run().catch(stdout.error);
