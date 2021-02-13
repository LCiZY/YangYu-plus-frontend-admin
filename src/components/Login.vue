<template>
    <div class="login-vue" :style="bg">
        <div class="container">
            <p class="title">WELCOME</p>
            <div class="input-c">
                <Input prefix="ios-contact" v-model="account" placeholder="用户名" clearable @on-blur="verifyAccount"/>
                <p class="error">{{accountError}}</p>
            </div>
            <div class="input-c">
                <Input type="password" v-model="pwd" prefix="md-lock" placeholder="密码" clearable @on-blur="verifyPwd"
                       @keyup.enter.native="submit"/>
                <p class="error">{{pwdError}}</p>
            </div>
            <Button :loading="isShowLoading" class="submit" type="primary" @click="submit">登陆</Button>
        </div>
    </div>
</template>

<script>
import { fetchUserData, get, post } from '@/api'
import { getKey } from '../utils/getInfo'

export default {
    name: 'login',
    data() {
        return {
            account: '',
            pwd: '',
            adminInfo: {},
            accountError: '',
            pwdError: '',
            isShowLoading: false,
            bg: {},
        }
    },
    created() {
        this.bg.backgroundImage = 'url(' + require('../assets/imgs/bg0' + new Date().getDay() + '.jpg') + ')'
    },
    watch: {
        $route: {
            handler(route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true,
        },
    },
    methods: {
        verifyAccount() {
        },
        verifyPwd() {
        },
        register() {

        },
        forgetPwd() {

        },
        submit() {
            let self = this
            this.isShowLoading = true
            get('admin/adminLogin', {
                params: { adminId: this.account, adminPassword: this.pwd },
            }).then(res => {
                if (res === 'authorization fail') {
                    this.pwdError = '用户名或密码错误'
                    this.isShowLoading = false
                } else if (res === 'fail' || res === '') {
                    this.pwdError = '服务器错误'
                    this.isShowLoading = false
                } else {
                    // 登陆成功 假设这里是后台返回的 token
                    let authorization = getKey(self.account, res)
                    // 设置之后，每次请求会自动带上
                    localStorage.setItem('adminVerifyCode', authorization)
                    get('admin/queryAdminById', {
                        params: { adminId: self.account },
                    }).then(res1 => {
                        this.adminInfo = res1
                        // 登陆成功 设置用户信息
                        console.log('res1:' + res1)
                        localStorage.setItem('adminInfo', JSON.stringify(res1, null, 4))
                        localStorage.setItem('adminId', res1.adminId)
                        localStorage.setItem('adminName', res1.adminName)
                        localStorage.setItem('adminStatus', res1.adminStatus)
                        // eslint-disable-next-line max-len
                        localStorage.setItem('userImg', 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1658123300,1268380095&fm=26&gp=0.jpg')
                        self.$router.push({ path: self.redirect || '/home' })
                    }).catch((error) => {
                        console.log('获取个人信息失败')
                        this.isShowLoading = false
                    })
                }
            }).catch((error) => {
                this.pwdError = '登陆失败:网络错误'
                this.isShowLoading = false
            })
        },


    },
}
</script>

<style>
    .login-vue {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }

    .login-vue .container {
        background: rgba(255, 255, 255, .5);
        width: 300px;
        text-align: center;
        border-radius: 10px;
        padding: 30px;
    }

    .login-vue .ivu-input {
        background-color: transparent;
        color: #fff;
        outline: #fff;
        border-color: #fff;
    }

    .login-vue ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, .8);
    }

    .login-vue .title {
        font-size: 16px;
        margin-bottom: 20px;
    }

    .login-vue .input-c {
        margin: auto;
        width: 200px;
    }

    .login-vue .error {
        color: red;
        text-align: left;
        margin: 5px auto;
        font-size: 12px;
        padding-left: 30px;
        height: 20px;
    }

    .login-vue .submit {
        width: 200px;
    }

    .login-vue .account {
        margin-top: 30px;
    }

    .login-vue .account span {
        cursor: pointer;
    }

    .login-vue .ivu-icon {
        color: #eee;
    }

    .login-vue .ivu-icon-ios-close-circle {
        color: #777;
    }
</style>
