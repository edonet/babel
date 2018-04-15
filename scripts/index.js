#!/usr/bin/env node


/**
 *****************************************
 * Created by lifx
 * Created on 2018-03-31 22:04:58
 *****************************************
 */
'use strict';


/*
 ****************************************
 * 设置环境变量
 ****************************************
 */
process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const
    fs = require('fs'),
    path = require('path'),
    { promisify } = require('util'),
    transform = require('./transform'),
    cwd = process.cwd(),
    args = process.argv.slice(2);



/**
 *****************************************
 * 启动脚本
 *****************************************
 */
async function run() {
    let src = args[0] && path.resolve(cwd, args[0]),
        dist = args[1] && path.resolve(cwd, args[1]),
        stats;

    // 无参数
    if (!src) {
        return;
    }

    // 获取文件信息
    try {
        stats = await promisify(fs.stat)(src);
    } catch (err) {
        return console.error('Error: File or directory not exists!');
    }

    // 打印提示
    console.log(`${ '-'.repeat(80) }\nTransform File:\n${ '-'.repeat(80) }`);

    // 处理文件夹
    if (stats.isDirectory()) {
        let files = await promisify(fs.readdir)(src);

        // 获取输出目录
        if (!dist) {
            dist = path.resolve(src, '../dist');
        }

        // 获取目录信息
        try {
            stats = await promisify(fs.stat)(dist);
        } catch (err) {
            stats = null;
        }

        // 创建输出目录
        if (!stats) {
            await promisify(fs.mkdir)(dist);
        } else if (!stats.isDirectory()) {
            return console.error('Error: The output dir is not a Directory!');
        }

        // 处理文件
        return await Promise.all(files.map(file => {

            // 只处理【js】文件
            if (file.endsWith('.js')) {
                return transform(path.resolve(src, file), path.resolve(dist, file)).then(
                    res => console.log(`==> ${ res.src } --> ${ res.dist }`)
                );
            }

            // 返回【Promise】
            return Promise.resolve();
        }));
    }

    // 获取输入路径
    if (!dist) {
        dist = src.replace(/(js)?$/, 'min.js');
    }

    // 处理文件
    await transform(src, dist);

    // 打印成功信息
    console.log(`==> ${ src } --> ${ dist }`);
}



/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = (
    run().catch(err => console.error(err))
);
