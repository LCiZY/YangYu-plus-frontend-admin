<template>
    <div class="main-content">
        <Card style="width:40%;margin-top:2%;" class="center">
            <Form  style="padding: 2% 20%;text-align: left;" label-position="left" :label-width="100">
                <FormItem label="管理员ID" >
                    <Input type="text" @on-blur="inputNameBlur" disabled v-model="adminInfo.adminId"/>
                </FormItem>
                <FormItem label="管理员身份" >
                    <Input type="text" @on-blur="inputNameBlur" disabled  :value="adminInfo.adminStatus === '1'?'超级管理员':'普通管理员'"/>
                </FormItem>
                <FormItem label="管理员名称" >
                    <Input type="text" @on-blur="inputNameBlur"  v-model="adminInfo.adminName"
                            placeholder="管理员名称"/>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<script>
import { get } from '@/api'

export default {
    name: 'userinfo',
    data() {
        return {
            adminInfo: { },
            oldName: '',
        }
    },
    mounted() {
        this.adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
        this.oldName = this.adminInfo.adminName
    },
    methods: {
        inputNameBlur() {
            if (this.oldName === this.adminInfo.adminName) {
                return
            }
            this.oldName = this.adminInfo.adminName
            get('/admin/updateAdmin', {
                params: { adminId: this.adminInfo.adminId, adminName: this.adminInfo.adminName },
            }).then(res => {
                if (res === 'success') {
                    this.$Message.success('修改成功~')
                } else {
                    this.$Message.error('修改失败')
                }
            }).catch((error) => {
                this.$Message.error('修改失败')
            })
        },
    },
}
</script>

<style scoped>
.head-line{
    color: #17233d;
}
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
.name-input{
    max-width: 40%;
}
</style>
