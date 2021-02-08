<template>
    <div class="home-container">
        <div class="home-content">
            <Button @click="getUser">ajax 测试</Button>

            <Input :rows="30" style="margin-top: 20px" v-model="userInfo" type="textarea" />
        </div>
    </div>
</template>

<script>
import { fetchUserData, get, post } from '@/api'


export default {
    name: 'home',
    data() {
        return {
            userInfo: '',
        }
    },
    methods: {
        getUserData() {
            fetchUserData().then(res => {
                this.userInfo = JSON.stringify(res, null, 4)
            })
        },
        getUser() {
            get('user/queryUserById', {
                params: { userId: '19927522531' },
                headers: { Authorization: 'admin 123456' },
            }).then(res => {
                this.userInfo = JSON.stringify(res, null, 4)
            })
        },
    },
}
</script>

<style scoped>
.home-container {
    padding: 10px;
    padding-top: 5px;
}
.home-content {
    padding: 10px;
    border-radius: 5px;
    background: #fff;
}
</style>
