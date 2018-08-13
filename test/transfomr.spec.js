/**
 *****************************************
 * Created by lifx
 * Created on 2018-08-10 16:12:21
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载模块
 *****************************************
 */
import fs from '@arted/utils/fs';
import resolvePath from '../lib/resolvePath';
import transform from '../lib/transform';
import transformFile from '../lib/transformFile';
import babel from '../lib/locals';
import load from '../lib/load';


/**
 *****************************************
 * 测试模块
 *****************************************
 */
describe('测试【transform】', () => {

    /* 查找文件 */
    test('查找文件', () => {
        let resolve = resolvePath();

        expect(resolve('./')).toBe(require.resolve('../'));
        expect(resolve('./package')).toBe(require.resolve('../package.json'));
        expect(resolve('./lib/resolvePath')).toBe(require.resolve('../lib/resolvePath.js'));
        expect(resolve('./.gitignore')).toBe(require.resolve('../.gitignore'));
        expect(resolve('./.gitignore123')).toBeUndefined();
        expect(resolve('yargs')).toBe(require.resolve('yargs'));
        expect(resolve('yargs2')).toBeUndefined();
    });

    /* 转码 */
    test('transform', () => {
        expect(
            transform('import a from "./a"; export default a + 1').code.indexOf('import')
        ).toBe(-1);
    });

    /* 转码文件 */
    test('transformFile', async () => {
        let code = 'import a from "./a"; export default a + 1',
            src = __dirname + '/a',
            dist = __dirname + '/b';

        // 创建文件
        await fs.writeFile(src, code);
        await transformFile(src, dist);

        // 校验结果
        expect(await fs.readFile(dist, 'utf-8')).toBe(transform(code).code);

        // 清除文件
        await fs.unlink(src);
        await fs.unlink(dist);
    });

    /* 执行代码 */
    test('执行代码', async () => {
        let code = 'import a from "./a"; export default a + 1',
            src = './a';

        // 创建文件
        await fs.writeFile(src, 'export default 3;');

        // 校验执行结果
        expect(babel.execute(code).default).toBe(4);

        // 消除文件
        await fs.unlink(src);
    });

    /* 执行文件 */
    test('执行文件', async () => {
        let list = ['./a', './b', './c', './d'];

        await Promise.all(list.map((file, idx) => (
            fs.writeFile(file, (
                idx ?
                `import val from "${list[idx - 1]}"; export default val + ${ idx + 1}` :
                'export default 1;'
            ))
        )));

        // 校验执行结果
        expect(babel.executeFile(list[0]).default).toBe(1);
        expect(babel.executeFile(list[1]).default).toBe(3);
        expect(babel.executeFile(list[2]).default).toBe(6);
        expect(babel.executeFile(list[3]).default).toBe(10);

        // 消除文件
        await Promise.all(list.map(file => fs.unlink(file)));
    });

    /* 加载文件 */
    test('加载文件', async () => {
        let list = ['./a', './b', './c', './d'];

        await Promise.all(list.map((file, idx) => (
            fs.writeFile(file, (
                idx ?
                `import val from "${list[idx - 1]}?test=1"; export default val + ${ idx + 1}` :
                'export default 1;'
            ))
        )));

        // 校验执行结果
        expect((await load(list[0])).default).toBe(1);
        expect((await load(list[1])).default).toBe(3);
        expect((await load(list[2])).default).toBe(6);
        expect((await load(list[3])).default).toBe(10);

        // 消除文件
        await Promise.all(list.map(file => fs.unlink(file)));
    });
});
