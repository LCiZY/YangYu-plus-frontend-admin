module.exports = {
    devServer: {
        port: 8888, //  指定端口号以侦听
        hotOnly: false, //  启用热模块替换，而无需页面刷新作为构建失败时的回退。
    },
    publicPath: './',
}
