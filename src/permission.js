import { LoadingBar } from 'view-design'
import router from './router'
import store from './store'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'

// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    if (to.path === '/' || to.path === '/index') {
        document.title = '软件工程方法学习笔记'
    }
    LoadingBar.start()
    if (localStorage.getItem('adminVerifyCode')) {
        if (to.path === '/login') {
            next({ path: '/home' })
        } else if (hasMenus) {
            next()
        } else {
            try {
                // 这里可以用 await 配合请求后台数据来生成路由
                // const data = await axios.get('xxx')
                // const routes = createRoutes(data)
                const routes = createRoutes(store.state.menuItems)
                // 动态添加路由
                router.addRoutes(routes)
                hasMenus = true
                next({ path: to.path || '/home' })
            } catch (error) {
                resetTokenAndClearUser()
                next(`/login?redirect=${to.path}`)
            }
        }
    } else {
        hasMenus = false
        if (to.path === '/login') {
            next()
        } else if (to.path === '/' || to.path === '/index') {
            document.title = '软件工程方法学习笔记'
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})

router.afterEach(() => {
    LoadingBar.finish()
})
