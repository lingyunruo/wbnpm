#### A tool that mimics NPM

##### Introduction
We dont have local npm server, just have a local git lib. 
So i take a case like that get package from gitlab server to project`s node_modules direction.

##### Useage

install
```js
npm install wbnpm -g
```

##### Set domain and alias
```shell
// 设置git域名
wbnpm set domain gitlab.xxx.xxx

// 设置组
wbnpm set group nbgroup

// 设置别名
wnnpm set alias app git@gitlab.xxx.com/bn:app.git
```

##### init direction
```shell
wbnpm init
```

##### install component
```shell
wbnpm install xxx
```

##### uninstall component
```shell
wbnpm uninstall xxx
```

##### initialize a react project
```js
wbnpm init react
```



#### 一个模拟npm的工具

##### 简介
由于只有私有gitlab，没有自己的npm服务器，所以采取了这样一个直接从gitlab上拉取代码到node_modules文件夹下的手段。方法兼容npm，也就是如果找不到对应git仓库，那么就直接执行npm。

建立方式是，先建立git group，在group里的每一个git仓库都是一个模块。所以需要确认在本地install的时候有git的权限。


##### 使用方法



安装：
```js
npm install wbnpm -g
```

初始化目录
```shell
wbnpm init
```

设置域名和组或者别名
```shell
// 设置git域名
wbnpm set domain gitlab.xxx.xxx

// 设置组
wbnpm set group nbgroup

// 设置别名
wnnpm set alias app git@gitlab.xxx.com/bn:app.git
```

安装组件
```shell
wbnpm install xxx
```

卸载组件
```shell
wbnpm uninstall xxx
```
