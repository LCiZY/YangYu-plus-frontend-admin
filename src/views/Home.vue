<template>
    <div class="home-container" style="text-align: center;">
        <Row style="padding:20px">
            <Col span="11">
                <Card>
                    <div style="text-align:center">
                        <img src="../assets/icons/activity.png" width="8%">
                        <p slot="title" class="head-line">活动总数</p>
                        <p class="data">{{activityCount}}个</p>
                    </div>
                </Card>
            </Col>
            <Col span="11" offset="2">
                <Card>
                    <div style="text-align:center">
                        <img src="../assets/icons/activity_1.png" width="8%">
                        <p slot="title"  class="head-line">待审核活动数量</p>
                        <p class="data">{{auditingActivityCount}}个</p>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row style="padding:20px">
            <Col span="11">
                <Card>
                    <div style="text-align:center">
                        <img src="../assets/icons/course.png" width="8%">
                        <p slot="title"  class="head-line">课程总数</p>
                        <p class="data">{{courseCount}}个</p>
                    </div>
                </Card>
            </Col>
            <Col span="11" offset="2">
                <Card>
                    <div style="text-align:center">
                        <img src="../assets/icons/course_1.png" width="8%">
                        <p slot="title"  class="head-line">待审核课程数量</p>
                        <p class="data">{{auditingCourseCount}}个</p>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row style="padding:20px">
            <Col span="11">
                <Card>
                    <p slot="title"  class="head-line">Borderless card</p>
                    <p class="data">Content of card</p>
                </Card>
            </Col>
            <Col span="11" offset="2">
                <Card>
                    <p slot="title"  class="head-line">Borderless card</p>
                    <p class="data">Content of card</p>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import { fetchUserData, get, post } from '@/api'
import { isNumber } from '../utils/getInfo'

// eslint-disable-next-line import/no-mutable-exports
let homeDataActivityCount = 0
// eslint-disable-next-line import/no-mutable-exports
let homeDataAuditingActivityCount = 0
// eslint-disable-next-line import/no-mutable-exports
let homeDataCourseCount = 0
// eslint-disable-next-line import/no-mutable-exports
let homeDataAuditingCourseCount = 0

export default {
    name: 'home',
    data() {
        return {
            defaultTotal: 100,
            activityCount: 0,
            auditingActivityCount: 0,
            courseCount: 0,
            auditingCourseCount: 0,
        }
    },
    mounted() {
        this.queryActivityCount()
        this.queryAuditCount()
        homeDataCourseCount = this.courseCount
        homeDataAuditingCourseCount = this.auditingCourseCount
    },
    methods: {
        queryActivityCount() {
            let self = this
            get('/activity/queryActivityCount').then(res => {
                if (isNumber(res)) {
                    self.activityCount = res
                } else {
                    self.activityCount = self.defaultTotal
                }
                homeDataActivityCount = self.activityCount
            }).catch((error) => {
                self.activityCount = self.defaultTotal
                homeDataActivityCount = self.activityCount
            })
        },
        queryAuditCount() {
            let self = this
            get('/preActivity/queryAuditRequestCount').then(res => {
                if (isNumber(res)) {
                    self.auditingActivityCount = res
                } else {
                    self.auditingActivityCount = self.defaultTotal
                }
                homeDataAuditingActivityCount = self.auditingActivityCount
            }).catch((error) => {
                self.auditCount = self.defaultTotal
                homeDataAuditingActivityCount = self.auditingActivityCount
            })
        },
    },
}

export { homeDataActivityCount, homeDataAuditingActivityCount, homeDataCourseCount, homeDataAuditingCourseCount }

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
.head-line {
    color:#464c5b;
    font-size: xx-large;
    font-weight: bold;
}
.data{
    color: #aaa;
}
</style>
