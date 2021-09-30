# yangyu 后台管理项目 - 前端页面
### [点击访问 ➡️ 线上地址](https://admin.mumuzi.site/#/login)
* 若访问的页面不是预期页面，可在url后加一个/home就行

## 开发环境&工具
```
nodejs
npm
```

## 开发步骤
1. 进入项目文件夹后使用npm安装依赖
```
npm i
```
2. 本地调试
```
npm run serve
```
3. 打包生成`dist`文件夹
````
npm run build
````
> 打包后的文件不能放在服务器根目录，否则会出现空白页面。
> 如果确实要把文件放在服务器根目录则需要更改打包的路径，打开 `vue.config.js` 文件，将`publicPath: './',`删去即可。

4. 将生成的`dist`文件夹通过vscode插件上传到服务器，部署调试（可选）
- 教程:
- [vscode sftp插件使用]()
- [部署vue项目](https://mumuzi.site/note.%2Fnotes%2F%E5%89%8D%E7%AB%AF%2Fvue%2Flinux%E9%83%A8%E7%BD%B2vue3.x%E9%A1%B9%E7%9B%AE%E5%B9%B6%E4%BD%BF%E7%94%A8nginx%E8%AE%BF%E9%97%AE.md)


## 其他
### 本项目相关依赖
* [vue-router](https://router.vuejs.org/zh/)
* [iview](https://www.iviewui.com/docs/guide/install)
* [axios](https://www.kancloud.cn/yunye/axios/234845)
* [vuex](https://vuex.vuejs.org/zh/)

### 功能

#### 标签栏
* 点击标签切换页面
* 刷新当前标签页
* 关闭其他标签/关闭所有标签

**注意：** 组件的名称和路由的名称一定要一致，例如 `Home.vue` 组件名称 `name: home`，则在路由文件中也要给它设置为 `name: home`，否则页面内容不能缓存

```js
// 在router文件中
{
    path: 'home',
    name: 'home',
    component: () => import('../views/Home.vue')
}

// 在Home.vue中
export default {
    name: 'home'
}
```

#### 权限控制
* 如果在未登陆的情况下访问指定页面 将会重定向到登陆页


#### 页面标题 `document.title`
- 在 `src/utils/index` 下可设置默认的 `title`，在每个路由配置项上可设置对应的 `title`，具体示例请看代码

#### 其它
* 利用`axios`拦截器 实现了`ajax`请求前展示`loading` 请求结束关闭`loading`
* UI库使用的是`iView` 有大量的组件可用 