#### 一个模拟npm的工具

##### 简介
由于只有私有gitlab，没有自己的npm服务器，所以采取了这样一个直接从gitlab上拉取代码到node_modules文件夹下的手段。方法兼容npm，也就是如果找不到对应git仓库，那么就直接执行npm


##### 使用方法



安装：
```js
npm install wbnpm -g
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

初始化目录
```shell
wbnpm init
```

安装组件
```shell
wbnpm install xxx
```

卸载组件
```shell
wbnpm uninstall xxx
```
