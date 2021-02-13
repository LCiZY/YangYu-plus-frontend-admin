import axios from 'axios'
import { Message } from 'view-design'
import router from '@/router'
import { showLoading, closeLoading } from '@/utils/loading'
import { resetTokenAndClearUser } from '@/utils'
import { isLocalIp } from '@/utils/getInfo'


const serverUrl = 'https://www.mumuzi.site:8443'
const service = axios.create({
    baseURL: isLocalIp(window.location.origin) ? window.location.origin : serverUrl,
    timeout: 60000,
})

service.interceptors.request.use(config => {
    showLoading()
    if (localStorage.getItem('adminVerifyCode')) {
        config.headers.Authorization = localStorage.getItem('adminVerifyCode')
    }

    return config
}, (error) => Promise.reject(error))

service.interceptors.response.use(response => {
    closeLoading()
    const res = response.data
    // 这里是接口处理的一个示范，可以根据自己的项目需求更改
    // 错误处理
    if (res.code != 0 && res.msg) {
        Message.error({
            content: res.msg,
        })

        // token 无效，清空路由，退出登录
        if (res.code == 2) {
            resetTokenAndClearUser()
            router.push('login')
        }

        return Promise.reject()
    }

    // 如果接口正常，直接返回数据
    return res
}, (error) => {
    closeLoading()
    if (error.name == 'Error') {
        Message.error({
            content: error.msg,
        })
    } else {
        Message.error({
            content: error.response.data.data || error.message,
        })
    }

    return Promise.reject(error)
})

export default service
