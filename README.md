# babel
Transform File by Babel

## Installation
npm
``` shell
$ npm install -g @arted/babel
```

or yarn
``` shell
$ yarn global add @arted/babel
```

## Usage
shell
``` shell
$ babel from.js to.js
```

node api
``` javascript
const babel = '@arted/babel';

// 执行文件
const md = babel.executeFile(__dirname + '/md.js');
```
