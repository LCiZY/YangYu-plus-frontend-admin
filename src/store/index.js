import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isShowLoading: false, // 全局 loading
        // 左侧菜单栏数据
        menuItems: [{
                name: 'home', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '主页', // 文本内容
            },
            // {
            //     name: 'other', // 要跳转的路由名称 不是路径
            //     size: 18, // icon大小
            //     type: 'ios-egg-outline', // icon类型
            //     text: '单独的路由', // 点击侧边栏跳到一个单独的路由页面，需要提前在 router.js 定义
            // },
            // {
            //     size: 18, // icon大小
            //     type: 'md-arrow-forward', // icon类型
            //     text: '外链',
            //     url: 'https://www.baidu.com',
            //     isExternal: true, // 外链 跳到一个外部的 URL 页面
            // },
            {
                text: '活动管理',
                type: 'md-bicycle',
                children: [{
                        type: 'ios-search',
                        name: 'activityTable',
                        text: '活动查询',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        type: 'ios-grid',
                        text: 'Pre活动查询',
                        name: 'preActivityTable',
                    },
                    {
                        type: 'md-checkbox-outline',
                        text: '活动审核',
                        name: 'auditTable',
                    },
                ],
            },
            {
                text: '课程管理',
                type: 'md-book',
                children: [{
                        type: 'ios-search',
                        name: 'courseTable',
                        text: '课程查询',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        type: 'md-checkbox-outline',
                        name: 'auditCourseTable',
                        text: '课程审核',
                    },
                ],
            },
            {
                text: '订单管理',
                type: 'ios-basket',
                children: [{
                    type: 'ios-search',
                    name: 'queryOrder',
                    text: '订单查询',
                    // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                    // hidden: true,
                }, ],
            },
            {
                text: '商家管理',
                type: 'md-person',
                children: [{
                        type: 'ios-search',
                        name: 'queryMerchant',
                        text: '商家查询',
                        // hidden 属性 隐藏此菜单 可以通过在地址栏上输入对应的 URL 来显示页面
                        // hidden: true,
                    },
                    {
                        type: 'md-checkbox-outline',
                        name: 'auditMerchant',
                        text: '商家审核',
                    },
                    {
                        type: 'ios-chatbubbles',
                        name: 'chatWithMerchant',
                        text: '消息中心',
                    },
                ],
            },
            {
                text: '账户设置',
                type: 'md-settings',
                children: [{
                        type: 'ios-notifications-outline',
                        name: 'msg',
                        text: '查看消息',
                    },
                    {
                        type: 'md-lock',
                        name: 'password',
                        text: '修改密码',
                    },
                    {
                        type: 'md-person',
                        name: 'userinfo',
                        text: '基本资料',
                    },
                    {
                        size: 18, // icon大小
                        type: 'md-arrow-forward', // icon类型
                        text: '商家后台',
                        url: 'https://merchant.mumuzi.site',
                        isExternal: true, // 外链 跳到一个外部的 URL 页面
                    },
                ],
            },
        ],
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
        setLoading(state, isShowLoading) {
            state.isShowLoading = isShowLoading
        },
    },
})

export default store