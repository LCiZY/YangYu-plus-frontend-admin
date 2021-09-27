<template>
    <div class="main-content">
        <Card style="width:40%;margin-top:2%;" class="center">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" style="padding: 2% 20%;" >
                <FormItem prop="password1">
                    <Input type="password" password prefix="ios-lock-outline"
                           v-model="formInline.password1" placeholder="输入新密码"/>
                </FormItem>
                <FormItem prop="password2">
                    <Input type="password" password prefix="ios-lock-outline"
                           v-model="formInline.password2" placeholder="再次输入新密码"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit(formInline)">提交</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { post } from '@/api'

export default {
    name: 'password',
    data() {
        return {
            adminInfo: { },
            formInline: {
                password1: '',
                password2: '',
            },
            ruleInline: {
                password1: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码不少于6位', trigger: 'blur' },
                ],
                password2: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码不少于6位', trigger: 'blur' },
                ],
            },
        }
    },
    mounted() {
        this.adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
    },
    methods: {
        handleSubmit(value) {
            if (value.password1 !== value.password2) {
                this.$Message.error({
                    background: true,
                    content: '两次输入密码不一致',
                })
                return
            }
            let self = this
            let form = new FormData()
            form.append('adminId', this.adminInfo.adminId)
            form.append('adminPassword', this.formInline.password1)
            post('/admin/update', form).then(res => {
                if (res === 'success') {
                    self.$Message.success('修改成功~')
                } else {
                    self.$Message.error('修改失败')
                }
            }).catch((error) => {
                console.log("error:", error)
                self.$Message.error('修改失败')
            })
        },
    },
}
</script>

<style scoped>
.main-content{
    width: 100vw;
    height: 100vh;
}
.center{
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

</style>
