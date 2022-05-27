# LanAQi Microapp

目前测试所支持的版本

- nodejs 14.x
- nodejs 16.x (不推荐)

- @angular/cli@11.x.x
- @angular/cli@12.x.x
- @angular/cli@13.x.x (不兼容)

- @angular-builders/custom-webpack@11.x.x
- @angular-builders/custom-webpack@12.x.x
- @angular-builders/custom-webpack@13.x.x (不兼容)

## 根项目

``` bash

ng new aqi-microapp \
--verbose=true \
--strict=true \
--skip-tests=false \
--skip-install=true \
--skip-git=true \
--create-application=false

```

## 库项目

``` bash

ng generate library ng-microapp \
--prefix=ma \
--skip-install=true \
--skip-package-json=false \
--skip-ts-config=false

```

## 例子项目

ma-demo-main ->

``` bash

ng generate application \
ma-demo-main \
--style=less \
--strict=true \
--skip-tests=true \
--skip-package-json=false \
--skip-install=true \
--routing=true \
--prefix=ma-main \
--minimal=true \
--inline-template=false \
--inline-style=false

```

ma-demo-app1 ->

``` bash

ng generate application \
ma-demo-app1 \
--style=less \
--strict=true \
--skip-tests=true \
--skip-package-json=false \
--skip-install=true \
--routing=true \
--prefix=ma-app1 \
--minimal=true \
--inline-template=false \
--inline-style=false

```

ma-demo-app2 ->

``` bash

ng generate application \
ma-demo-app2 \
--style=less \
--strict=true \
--skip-tests=true \
--skip-package-json=false \
--skip-install=true \
--routing=true \
--prefix=ma-app2 \
--minimal=true \
--inline-template=false \
--inline-style=false

```

### 步骤

不论是主应用还是子应用都需要做前期准备。

``` bash

# angular 11
npm install @angular-builders/custom-webpack@11.x.x --save-dev

# angular 12
npm install @angular-builders/custom-webpack@12.x.x --save-dev

# angular 13
npm install @angular-builders/custom-webpack@13.x.x --save-dev

```

项目根目录（即与 package.json 同一个目录）下添加 custom-webpack.config.js 配置文件。

``` typescript

const { name } = require('./package');

const project = name;

module.exports = {
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    output: {
        library: `${project}-[name]`,
        libraryTarget: 'umd',
        // angular 11 -
        // jsonpFunction: `webpackJsonp_${project}`,
        // angular 12 +
        chunkLoadingGlobal: `webpackJsonp_${project}`,
        globalObject: 'window',
    },
    // externals: {
    //     'zone.js': 'Zone',
    // },
};

```

再修改 angular.json 配置文件，把所有应用类型的 @angular-devkit/build-angular 替换为 @angular-builders/custom-webpack 即可（覆盖所有 webpack 配置）。

再到 [packageName] > architect > build > options 添加 webpack 自定义外置配置文件。

``` json

"architect": {
    "build": {
        "builder": "@angular-builders/custom-webpack:browser",
        "options": {
            "customWebpackConfig": {
                "path": "./custom-webpack.config.js"
            }
        }
    }
}

```

### 可选

在 angular.json 中 [packageName] > architect > configurations > production 中添加 "vendorChunk": true 配置。

``` json

"production": {
  "outputHashing": "all",
  "vendorChunk": true
},

```

使用外部 zone.js 资源，在 custom-webpack.config.js 排除 zone.js 打包。

``` typescript

const { name } = require('./package');

const project = name;

module.exports = {
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    library: `${project}-[name]`,
    libraryTarget: 'umd',
    // angular 11 -
    // jsonpFunction: `webpackJsonp_${project}`,
    // angular 12 +
    chunkLoadingGlobal: `webpackJsonp_${project}`,
    globalObject: 'window',
  },
  externals: {
    'zone.js': 'Zone',
  },
};

```

在 src/index.html 中添加外部 CDN 资源。

``` html

<script src="https://cdn.bootcdn.net/ajax/libs/zone.js/0.11.5/zone.min.js" exclude></script>

```
在 src/polyfills.ts 中注释 zone.js 的引入。

``` typescript

// import 'zone.js';  // Included with Angular CLI.

```

