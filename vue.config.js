module.exports = {
    devServer: {
        port: 80, //  指定端口号以侦听
        hotOnly: false, //  启用热模块替换，而无需页面刷新作为构建失败时的回退。
        proxy: {
            '/api': {
                target: 'https://mumuzi.site/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
        },
    },
    publicPath: './',
}