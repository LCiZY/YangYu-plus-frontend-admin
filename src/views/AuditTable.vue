<template>
    <div style="padding: 10px;overflow: scroll; max-height: calc(100vh - 88px);">
        <div style="background: #fff; border-radius: 8px; padding: 20px;">
            <div class="query-c">
                查询审核请求：
                <Input search @on-search="search" placeholder="根据审核请求的ID查询"
                       v-model="searchContent" style="width: auto" />
                <Button type="primary" :loading="tableDataLoading" @click="refresh"  class="margin-left">
                    <span v-if="!tableDataLoading">刷新</span>
                    <span v-else>Loading...</span>
                </Button>
            </div>
            <br>
            <Table size="small" border :loading="tableDataLoading" :columns="columns" :data="auditingActivitiesDisplayed"></Table>
            <br>
            <Page :total="auditCount" show-sizer show-elevator @on-change="toPage" @on-page-size-change="pageSizeChange"/>
        </div>
        <!-- 活动详情对话框 -->
        <Modal v-model="activityInfoModal" fullscreen title="活动审核">
            <p slot="header" style="color:#515a6e;text-align:center;font-size: larger;font-weight: bold;">
                <Icon type="ios-information-circle"></Icon>
                <span>{{chooseActivity.operType==='1'?'待审核的新活动':'待审核修改后的活动'}}</span>
            </p>
            <div class="demo-split"  style="background:#eee;padding: 20px">
                <Split v-model="splitLeft">
                    <div slot="left" class="demo-split-pane" style="height: 100%;">
                        <Card :bordered="false" >
                            <a :href="chooseActivity.activityCoverPicUrl" target="_blank">
                                <img :src="chooseActivity.activityCoverPicUrl" class="image-size"  style="float: right;" >
                            </a>
                            <h1>活动信息</h1>
                            <h3>审核请求ID：{{ chooseActivity.auditRequestId }}</h3>
                            <h3>操作类型：{{chooseActivity.operType==='1'?'添加':'修改'}}</h3>
                            <h3 v-show="chooseActivity.operComment && chooseActivity.operComment!==''">
                                操作备注：{{ chooseActivity.operComment }}</h3>
                            <h3>审核请求时间：{{ chooseActivity.auditRequestTime }}</h3>
                            <h3>活动ID：{{ chooseActivity.activityId }}</h3>
                            <h3>创建用户ID：{{ chooseActivity.userId }}</h3>
                            <h3 v-show="chooseActivity.merchantId && chooseActivity.merchantId!==''">
                                创建商家ID：{{ chooseActivity.merchantId }}</h3>
                            <h3>活动名称：{{ chooseActivity.activityName }}</h3>
                            <h3>活动类型：{{ chooseActivity.activityType }}</h3>
                            <h3>活动日期：{{ chooseActivity.activityDate }}</h3>
                            <h3>活动地点：{{ chooseActivity.activityPlace }}</h3>
                            <h3>活动对象：{{ chooseActivity.activityObject }}</h3>
                            <h3>活动人数：{{ chooseActivity.activityMembers }}</h3>
                            <h3>活动平均花费：{{ chooseActivity.activityAverCost }}</h3>
                            <h3>活动描述</h3><p>{{ chooseActivity.activityDesc }}</p>
                        </Card>
                    </div>
                    <div slot="right" class="demo-split-pane no-padding">
                        <Split v-model="splitRight" mode="vertical">
                            <div slot="top" class="demo-split-pane">
                                <Card :bordered="false" style="height: 100%;">
                                    <a :href="chooseUserInfo.userAvatarUrl" target="_blank">
                                        <img :src="chooseUserInfo.userAvatarUrl" class="image-size" style="float: right;" >
                                    </a>
                                    <h2>创建者信息</h2>
                                    <h4>用户名：{{chooseUserInfo.userName}}</h4>
                                    <h4>用户ID：{{chooseUserInfo.userId}}</h4>
                                    <h4>用户手机号：{{chooseUserInfo.userCellPhoneNum}}</h4>
                                    <h4>用户余额：{{chooseUserInfo.userAccountBalance}}</h4>
                                    <h4>用户性别：{{chooseUserInfo.userGender}}；&nbsp;&nbsp;孩子性别：{{chooseUserInfo.userChildGender}}</h4>
                                    <h4>用户孩子所处阶段：{{chooseUserInfo.userChildStage}}</h4>
                                    <h4>用户孩子生日：{{chooseUserInfo.userChildBirthday}}</h4>
                                    <h4>用户上次登陆时间：{{chooseUserInfo.userLastLoginTime}}</h4>
                                    <h4>用户所处区域：{{chooseUserInfo.userZone}}</h4>
                                </Card>
                            </div>
                            <div slot="bottom" class="demo-split-pane">
                                <Card :bordered="false" style="height: 100%;">
                                    <h2>活动图片</h2>
                                    <a v-for="item in chooseActivity.activityImages" :key="item.activityImageId"
                                       :href="item.activityImageUrl" target="_blank">
                                        <img :src="item.activityImageUrl" class="image-size"/>
                                    </a>
                                </Card>
                            </div>
                        </Split>
                    </div>
                </Split>
            </div>
            <div slot="footer" style="text-align: center!important;">
                <Button type="success" size="large"  @click="approve(chooseActivity.auditRequestId)">通过</Button>
                <Button type="error" size="large"  @click="refused(chooseActivity.auditRequestId)" >不通过</Button>
                <Button type="primary" size="large"  @click="closeModal" >关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { instance } from '../components/Index'
import { get } from '@/api'
import { isNumber } from '../utils/getInfo'
import { homeDataAuditingActivityCount } from './Home'

export default {
    name: 'auditTable',
    data() {
        return {
            searchContent: '',
            tableDataLoading: false,
            auditingActivities: [],
            auditingActivitiesDisplayed: [],
            chooseActivity: {},
            chooseUserInfo: {},
            activityInfoModal: false,
            splitLeft: 0.5,
            splitRight: 0.5,
            pageSize: 20,
            auditCount: 100,
            currIndex: 1,
            rowIndex: -1,
            refuseReason: '',
            columns: [
                {
                    title: '审核请求ID',
                    key: 'auditRequestId',
                    resizable: true,
                    width: 120,
                },
                {
                    title: '操作类型',
                    key: 'operType',
                    resizable: true,
                    width: 120,
                    render: (h, params) => h('div', [
                        h('strong', params.row.operType === '1' ? '添加活动' : '修改活动'),
                    ]),
                },
                {
                    title: '申请时间',
                    key: 'auditRequestTime',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '操作备注',
                    key: 'operComment',
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 200,
                    align: 'center',
                    render: (h, params) => h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.rowIndex = params.index
                                    this.activityInfoModal = true
                                    this.chooseActivity = params.row
                                    this.queryUserInfoById(this, params.row.userId)
                                    this.queryPreActivityImages(params.row.activityId)
                                },
                            },
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'success',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.rowIndex = params.index
                                    this.approve(params.row.auditRequestId)
                                },
                            },
                        }, '通过'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.rowIndex = params.index
                                    this.refused(params.row.auditRequestId)
                                },
                            },
                        }, '不通过'),
                    ]),
                },
            ],
        }
    },
    mounted() {
        this.auditCount = homeDataAuditingActivityCount
        this.getAuditingPreActivitiesPageByPage(this.currIndex)
    },
    methods: {
        /* eslint-disable */
        show(index) {
        },
        getAuditingPreActivitiesPageByPage(index) {
            if (!index) return
            let startIndex = (index - 1) * this.pageSize
            let self = this
            this.tableDataLoading = true
            get('/preActivity/getAuditingPreActivities', {
                params: { start: startIndex, number: this.pageSize },
            }).then(res => {
                console.log(res)
                self.auditingActivities[index] = res
                self.auditingActivitiesDisplayed = res
                self.tableDataLoading = false
            }).catch((error) => {
                console.log('查询失败')
                self.tableDataLoading = false
            })
        },
        search() { // 按类型搜索
            let self = this
            self.tableDataLoading = true
            // eslint-disable-next-line radix
            let id = parseInt(this.searchContent - 0)
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(id)) {
                // 输入类型错误
                return
            }
            get('/preActivity/queryAuditingRequestJoinPreActivityById', {
                params: { auditRequestId: id },
            })
            .then(res => {
                console.log(res)
                self.auditingActivitiesDisplayed = [res]
                self.tableDataLoading = false
            })
            .catch((error) => {
                console.log('查询失败')
                self.tableDataLoading = false
            })
        },
        refresh() { // 刷新本页面
            instance.reloadPage()
            this.toPage(this.currIndex)
        },
        toPage(index) { // 查看第 index 页的活动 index=1，2，3。。
            this.currIndex = index
            if (!this.auditingActivities[index]) {
                this.getAuditingPreActivitiesPageByPage(index)
            } else {
                this.auditingActivitiesDisplayed = this.auditingActivities[index]
            }
        },
        pageSizeChange(size) {
            this.pageSize = size
        },
        queryUserInfoById(self, id) { // 查询userId为id的用户信息
            get('/user/queryUserById', {
                params: { userId: id },
            }).then(res => {
                console.log(res)
                self.chooseUserInfo = res
            }).catch((error) => {
                console.log('获取用户信息失败')
            })
        },
        queryPreActivityImages(id) { // 查询userId为id的用户信息
            let self = this
            get('/preActivity/queryPreActivityImagesByActivityId', {
                params: { activityId: id },
            }).then(res => {
                console.log(res)
                self.$set(self.chooseActivity,'activityImages',res)
            }).catch((error) => {
                console.log('获取preActivity图片失败')
            })
        },
        approve(id) {
            if (!id) return
            let self = this
            get('/adminManage/approveActivity', {
                params: { auditRequestId: id },
            }).then(res => {
                self.$Notice.success({
                    title: '操作成功',
                })
                let index = this.auditingActivities.indexOf(this.auditingActivitiesDisplayed)
                this.auditingActivitiesDisplayed.splice(this.rowIndex, 1)
                this.auditingActivities[index] = this.auditingActivitiesDisplayed
                this.closeModal()
            }).catch((error) => {
                self.$Notice.error({
                    title: '【通过审核】操作失败',
                })
            })
        },
        refused(id) {
            if (!id) return
            let self = this
            get('/adminManage/refuseActivity', {
                params: { auditRequestId: id, refuseReason: this.refuseReason },
            }).then(res => {
                self.$Notice.success({
                    title: '操作成功',
                })
                let index = this.auditingActivities.indexOf(this.auditingActivitiesDisplayed)
                this.auditingActivitiesDisplayed.splice(this.rowIndex, 1)
                this.auditingActivities[index] = this.auditingActivitiesDisplayed
                this.closeModal()
            }).catch((error) => {
                self.$Notice.error({
                    title: '【不通过审核】操作失败',
                })
            })
        },
        closeModal() {
            this.activityInfoModal = false
        },
    },
}

</script>

<style scoped>

    .image-size {
        width: 100px!important;
        height: 100px!important;
    }
    .margin-left {
        margin-left: 20px;
    }

    .demo-split{
        height: 100%;
    }
    .demo-split-pane{
        padding: 10px;
    }
    .demo-split-pane.no-padding{
        height: 100%;
        padding: 0;
    }
    .demo-split-pane {
        height: 100%;
    }
    .ivu-card {
        height: 100%;
    }
    .ivu-card-body {
        height: 100%;
    }
    .ivu-modal-footer {
        border: none;
    }
    .demo-upload-list{

    }

    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: inline-block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
