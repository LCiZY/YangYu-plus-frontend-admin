import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [{
    path: '/',
    name: 'indexMain',
    meta: { title: '首页' },
    component: () =>
        import('../components/IndexMain.vue'),
},
{
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () =>
        import('../components/Login.vue'),
},
// {
//     path: '/other', // 点击侧边栏跳到一个单独的路由页面，需要定义，层级和其他顶级路由一样
//     name: 'other',
//     meta: { title: '单独的路由' },
//     component: () => import('../views/Other.vue'),
// },
{
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: () =>
        import('../components/404.vue'),
},
{ path: '/index', redirect: '/' },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () =>
            import('../views/Home.vue'),
    },

    activityTable: {
        path: 'activities', // 在url上显示的
        name: 'activityTable', // 唯一标识此路由
        meta: { title: '活动列表' },
        component: () =>
            import('../views/Activities.vue'),
    },
    preActivityTable: {
        path: 'preActivities',
        name: 'preActivityTable',
        meta: { title: 'Pre活动列表' },
        component: () =>
            import('../views/PreActivities.vue'),
    },
    auditTable: {
        path: 'activityAudit',
        name: 'auditTable',
        meta: { title: '待审核的活动' },
        component: () =>
            import('../views/AuditTable.vue'),
    },

    courseTable: {
        path: 'courses',
        name: 'courseTable',
        meta: { title: '课程列表' },
        component: () =>
            import('../views/course/course.vue'),
    },
    auditCourseTable: {
        path: 'courseAudit',
        name: 'auditCourseTable',
        meta: { title: '待审核的课程' },
        component: () =>
            import('../views/course/courseAudit.vue'),
    },

    queryOrder: {
        path: 'queryOrder',
        name: 'queryOrder',
        meta: { title: '订单查询' },
        component: () =>
            import('../views/order/queryOrder.vue'),
    },

    queryMerchant: {
        path: 'queryMerchant',
        name: 'queryMerchant',
        meta: { title: '商家查询' },
        component: () =>
            import('../views/merchant/queryMerchant.vue'),
    },
    auditMerchant: {
        path: 'auditMerchant',
        name: 'auditMerchant',
        meta: { title: '商家入驻' },
        component: () =>
            import('../views/merchant/auditMerchant.vue'),
    },
    chatWithMerchant: {
        path: 'chatWithMerchant',
        name: 'chatWithMerchant',
        meta: { title: '商家消息' },
        component: () =>
            import('../views/merchant/chatWithMerchant.vue'),
    },

    password: {
        path: 'password',
        name: 'password',
        meta: { title: '修改密码' },
        component: () =>
            import('../views/admin/Password.vue'),
    },
    msg: {
        path: 'msg',
        name: 'msg',
        meta: { title: '通知消息' },
        component: () =>
            import('../views/admin/Msg.vue'),
    },
    userinfo: {
        path: 'userinfo',
        name: 'userinfo',
        meta: { title: '用户信息' },
        component: () =>
            import('../views/admin/UserInfo.vue'),
    },
}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router