<template>
    <div style="padding: 10px;overflow: scroll; max-height: calc(100vh - 88px);" id="activity">
        <div style="background: #fff; border-radius: 8px; padding: 20px;">
            <div class="query-c">
                查询：
                <Input search placeholder="请输入查询内容" style="width: auto" />
                <Button type="primary" @click="search" class="margin-left">确定</Button>
                <Button type="primary" :loading="tableDataLoading" @click="refresh"  class="margin-left">
                    <span v-if="!tableDataLoading">刷新</span>
                    <span v-else>Loading...</span>
                </Button>
            </div>
            <br>
            <Table size="small" max-height="670" border
                   :loading="tableDataLoading" :columns="columns" :data="activitiesDisplay"
                   on-cell-click="cellClick">
            </Table>
            <br>
            <Page :total="100" show-sizer show-elevator @on-change="toPage"/>
        </div>
        <!-- 活动详情对话框 -->
        <Modal v-model="activityInfoModal" fullscreen title="活动详情">
            <p slot="header" style="color:#515a6e;text-align:center;font-size: larger;font-weight: bold;">
                <Icon type="ios-information-circle"></Icon>
                <span>活动详情</span>
            </p>
            <div class="demo-split"  style="background:#eee;padding: 20px">
                <Split v-model="splitLeft">
                        <div slot="left" class="demo-split-pane" style="height: 100%;">
                            <Card :bordered="false" >
                                <a :href="chooseActivity.activityCoverPicUrl" target="_blank">
                                    <img :src="chooseActivity.activityCoverPicUrl" class="image-size"  style="float: right;">
                                </a>
                                <h1>活动信息</h1>
                                 <h3>活动ID：{{ chooseActivity.activityId }}</h3>
                                   <h3>创建用户ID：{{ chooseActivity.userId }}</h3>
                                   <h3>创建商家ID：{{ chooseActivity.merchantId }}</h3>
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
                                            <img :src="chooseUserInfo.userAvatarUrl" class="image-size" style="float: right;" alt="无法显示">
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
                <Button type="primary" size="large"  @click="closeModal">确定</Button>
            </div>
        </Modal>
        <!-- 删除确认对话框 -->
        <Modal
            draggable
            v-model="deleteModal"
            title="是否删除此活动？"
            :loading="deleteModalLoading"
            @on-ok="deleteActivity">
            <p>活动ID：{{chooseActivity.activityId}}</p>
            <p>活动名：{{chooseActivity.activityName}}</p>
        </Modal>
        <!-- 更新活动对话框 -->
        <Modal v-model="updateModal" fullscreen title="修改活动信息">
            <p slot="header" style="color:#515a6e;text-align:center;font-size: larger;font-weight: bold;">
                <Icon type="md-color-filter" />
                <span>修改活动信息</span>
            </p>
            <div class="demo-split"  style="background:#eee;padding: 20px">
                <Split v-model="updateSplitLeft">
                    <div slot="left" class="demo-split-pane" style="height: 100%;">
                        <Card :bordered="false" >
                            <h1>活动信息</h1>
                            <h3>活动ID：{{ chooseActivity.activityId }}</h3>
                            <h3>创建用户ID：{{ chooseActivity.userId }}</h3>
                            <h3>创建商家ID：{{ chooseActivity.merchantId }}</h3>
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
                    <div slot="right" class="demo-split-pane no-padding" style="padding: 10px;">
                                <Card :bordered="false" style="height: 100%;">
                                    <Divider plain>活动封面</Divider>
                                    <div class="demo-upload-list"
                                         style="text-align: center;width:100%!important;height: auto;margin:0;border: none;
                                         box-shadow: none;">
                                        <img :src="coverPicFileUrl"  class="image-size">
                                        <div class="demo-upload-list-cover image-size" style="left:50%;transform: translateX(-50%);">
                                            <Icon type="ios-eye-outline" @click.native="handleView('活动封面图', coverPicFileUrl)"></Icon>
                                        </div>
                                        <br/>
                                    </div>
                                        <Upload action="//jsonplaceholder.typicode.com/posts/"
                                                :before-upload="changeCoverPic" style="text-align: center;">
                                            <Button icon="ios-cloud-upload-outline">上传新的封面</Button>
                                        </Upload>
                                    <Divider plain>其余活动图片</Divider>
                                    <div class="demo-upload-list" v-for="item in showFilesUrlList" :key="item.activityImageUrl">
                                            <img :src="item.activityImageUrl">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline"
                                                      @click.native="handleView(item.name, item.activityImageUrl)">
                                                </Icon>
                                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                            </div>
                                            <br v-if="showFilesUrlList.length===3"/>
                                            <br v-if="showFilesUrlList.length===6"/>
                                    </div>
                                    <Upload
                                        v-if="showFilesUrlList.length<9"
                                        ref="upload"
                                        :show-upload-list="false"
                                        :default-file-list="showFilesUrlList"
                                        :format="['jpg','jpeg','png']"
                                        :max-size="2048"
                                        :on-exceeded-size="handleMaxSize"
                                        :before-upload="handleBeforeUpload"
                                        multiple
                                        type="drag"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        style="display: inline-block;width:58px;">
                                        <div style="width: 58px;height:58px;line-height: 58px;">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </div>
                                    </Upload>
                                    <Modal title="View Image" v-model="visible">
                                        <img :src="imgSrc" v-if="visible" style="width: 100%">
                                    </Modal>
                                </Card>
                    </div>
                </Split>
            </div>
            <div slot="footer" style="text-align: center!important;">
                <Button type="error" size="large" @click="closeModal" style="margin-right: 30px;">取消</Button>
                <Button type="primary" size="large" :loading="updateLoading" @click="updateActivity">上传</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import { instance } from '../components/Index'
import { fetchUserData, get, post } from '@/api'


export default {
    name: 'activityTable',
    data() {
        return {
            tableDataLoading: false,
            activityInfoModal: false, // 显示活动信息的模态框
            deleteModal: false, // 询问是否删除活动的模态框
            deleteModalLoading: false, // 正在删除的loading标志
            updateModal: false, // 修改活动的模态框
            updateLoading: false, // 正在上传修改过的活动信息的loading标志
            pageSize: 20, // 每次请求活动的数量
            currIndex: 1, // 当前页面的索引，初始是第一页
            chooseActivity: {}, // 当前选择的活动
            chooseActivityDeletedIndex: -1, // 当前选择的活动在本页的索引
            chooseUserInfo: {}, // 当前选择的活动所属用户的信息
            splitLeft: 0.4, // 活动信息的模态框左半边宽度的初始比重
            splitRight: 0.6, // 活动信息的模态框右半边宽度的初始比重
            updateSplitLeft: 0.7, // 更新活动信息的模态框左半边宽度的初始比重
            updateSplitRight: 0.3, // 活动信息的模态框右半边宽度的初始比重
            columns: [ // 表头
                {
                    title: '活动ID',
                    key: 'activityId',
                    resizable: true,
                    width: 120,
                },
                {
                    title: '创建用户ID',
                    key: 'userId',
                    resizable: true,
                    width: 120,
                },
                {
                    title: '创建商家ID',
                    key: 'merchantId',
                    resizable: true,
                    width: 120,
                },
                {
                    title: '活动名称',
                    key: 'activityName',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动类型',
                    key: 'activityType',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动日期',
                    key: 'activityDate',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动地点',
                    key: 'activityPlace',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动对象',
                    key: 'activityObject',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动人数',
                    key: 'activityMembers',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动平均花费',
                    key: 'activityAverCost',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动描述',
                    key: 'activityDesc',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '活动封面',
                    key: 'activityCoverPicUrl',
                    resizable: true,
                    width: 180,
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 180,
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
                                    // this.show(params.index)
                                    console.log('params')
                                    console.log(params)
                                    this.chooseActivity = params.row
                                    this.activityInfoModal = true
                                    this.queryUserInfoById(this, params.row.userId)
                                },
                            },
                        }, '查看'),
                        h('Button', {
                            props: {
                                type: 'warning',
                                size: 'small',
                            },
                            style: {
                                marginRight: '5px',
                            },
                            on: {
                                click: () => {
                                    this.activityImages = []
                                    this.activityCoverPic = null
                                    this.coverPicFileUrl = ''
                                    this.activityImagesDeleted = []
                                    this.showFilesUrlList = []
                                    this.chooseActivity = params.row
                                    this.updateModal = true
                                    this.coverPicFileUrl = this.chooseActivity.activityCoverPicUrl
                                    let i = 0
                                    for (; i < this.chooseActivity.activityImages.length; i++) {
                                        this.showFilesUrlList.push({
                                            name: 'image_' + this.chooseActivity.activityImages[i].activityImageId,
                                            activityImageUrl: this.chooseActivity.activityImages[i].activityImageUrl,
                                            activityImageId: this.chooseActivity.activityImages[i].activityImageId,
                                        })
                                    }
                                    console.log('showlist:')
                                    console.log(this.showFilesUrlList)
                                },
                            },
                        }, '修改'),
                        h('Button', {
                            props: {
                                type: 'error',
                                size: 'small',
                            },
                            on: {
                                click: () => {
                                    this.chooseActivity = params.row
                                    this.chooseActivityDeletedIndex = params.index
                                    this.deleteModal = true
                                },
                            },
                        }, '删除'),
                    ]),
                },
            ],
            activitiesDisplay: [ // 当前页显示出来的活动
            ],
            activities: [ // 所有的活动，比如第一页在 activities[1] 里
            ],
            // 编辑页面选择附属图片部分所需变量
            activityImages: [], // 需要上传的新增加的活动图片
            activityCoverPic: null, // 活动封面图
            coverPicFileUrl: '', // 活动封面图的url
            activityImagesDeleted: [], // 已经删除的活动图片的id
            imgName: '', // 预览图片时的图片名
            imgSrc: '', // 预览图片时的图片地址
            visible: false, // 预览图片时的窗口控制变量
            showFilesUrlList: [], // 除了封面图，其他图片的url
        }
    },
    mounted() {
        this.queryActivityPageByPage(this.currIndex)
        this.showFilesUrlList = this.$refs.upload.fileList
    },
    methods: {
        search() { // 按类型搜索
            instance.gotoPage('auditTable', {})
        },
        refresh() { // 刷新本页面
            instance.reloadPage()
            this.toPage(this.currIndex)
        },
        toPage(index) { // 查看第 index 页的活动 index=1，2，3。。
            this.currIndex = index
            if (!this.activities[index]) {
                this.queryActivityPageByPage(index)
            } else {
                this.activitiesDisplay = this.activities[index]
            }
        },
        queryActivityPageByPage(index) { // 向服务器查询第index页的活动
            if (!index) return
            let startIndex = (index - 1) * this.pageSize
            let self = this
            this.tableDataLoading = true
            get('/activity/queryCompleteActivityPageByPage', {
                params: { start: startIndex, number: self.pageSize },
            }).then(res => {
                console.log(res)
                self.activities[index] = res
                self.tableDataLoading = false
                self.activitiesDisplay = res
            }).catch((error) => {
                console.log('获取活动失败')
                self.tableDataLoading = false
            })
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
        deleteActivity(id, index) { // 删除activityId指定的活动
            this.deleteModalLoading = true
            let self = this
            get('/activity/deleteActivity', {
                params: { activityId: id },
            }).then(res => {
                self.activitiesDisplay.splice(index, 1)
                console.log('删除活动：' + res)
                self.deleteModalLoading = false
                self.deleteModal = false
                if (res && res !== 'fail') {
                    self.$Notice.success({
                        title: '删除成功',
                    })
                }
            }).catch((error) => {
                console.log('删除活动失败')
                self.deleteModalLoading = false
                self.deleteModal = false
                self.$Notice.error({
                    title: '删除失败',
                })
            })
        },
        updateActivity() { // 上传修改至服务器
        },
        closeModal() {
            this.activityInfoModal = false
            this.deleteModal = false
            this.updateModal = false
        },
        show(index) { // 显示调试信息，测试用
            this.$Modal.info({
                title: '详情',
                // content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`,
                // content: JSON.stringify(this.activitiesDisplay[index], null, 4),
                content: '<Button type="text">Text</Button>',
            })
        },
        handleView(name, src) {
            this.imgSrc = src
            this.imgName = name
            this.visible = true
        },
        handleRemove(file) {
            let index = this.activityImages.indexOf(file)
            if (index === -1) { // 说明这个图片是已经存在于服务器的
                this.activityImagesDeleted.push(file.activityImageId)
                let i = 0
                for (; i < this.showFilesUrlList.length; i++) {
                    if (this.showFilesUrlList[i].activityImageId === file.activityImageId) {
                        this.showFilesUrlList.splice(i, 1)
                        return
                    }
                }
            }
            this.activityImages.splice(index, 1)
            this.showFilesUrlList.splice(index, 1)
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.',
            })
        },
        handleBeforeUpload(file) {
            const check = this.showFilesUrlList.length < 9
            if (!check) {
                this.$Notice.warning({
                    title: '不可以超过9张图片',
                })
                return false
            }
            this.activityImages.push(file)
            let url1 = window.URL.createObjectURL(file)
            this.showFilesUrlList.push({
                name: file.name,
                activityImageUrl: url1,
            })
            return false
        },
        changeCoverPic(file) {
            this.activityCoverPic = file
            this.coverPicFileUrl = window.URL.createObjectURL(file)
            return false
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
